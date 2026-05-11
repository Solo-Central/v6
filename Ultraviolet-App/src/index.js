import "dotenv/config";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { request as httpsRequest } from "node:https";
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";

const bare = createBareServer("/bare/");
const app = express();

app.use(express.json());

app.post("/api/vm", (req, res) => {
  const apiKey = process.env.HYPERBEAM_API_KEY || Buffer.from("c2tfbGl2ZV84R0N2OVZ6V2ZFMTRGUTZGa1RrY3VId19TNUZ6SnNFc0hacTg3WGQ1bFpr", "base64").toString();
  if (!apiKey) {
    return res.status(500).json({ error: "key aint set stupid" });
  }

  const { start_url } = req.body;
  const postData = JSON.stringify(start_url ? { start_url } : {});
  const options = {
    hostname: "engine.hyperbeam.com",
    path: "/v0/vm",
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const hyperReq = httpsRequest(options, (hyperRes) => {
    let data = "";
    hyperRes.on("data", (chunk) => { data += chunk; });
    hyperRes.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        if (hyperRes.statusCode !== 200) {
          return res.status(hyperRes.statusCode).json({ error: parsed.message || "Hyperbeam API error" });
        }
        res.json({ session_id: parsed.session_id, embed_url: parsed.embed_url, admin_token: parsed.admin_token });
      } catch {
        res.status(500).json({ error: "Invalid response from Hyperbeam" });
      }
    });
  });

  hyperReq.on("error", () => {
    res.status(500).json({ error: "Failed to reach Hyperbeam" });
  });

  hyperReq.write(postData);
  hyperReq.end();
});

app.post("/api/vm/navigate", (req, res) => {
  const { session_id, admin_token, url } = req.body;
  if (!session_id || !admin_token || !url) {
    return res.status(400).json({ error: "Missing session_id, admin_token, or url" });
  }

  const postData = JSON.stringify({ url });
  const options = {
    hostname: "engine.hyperbeam.com",
    path: `/v0/vm/${session_id}`,
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${admin_token}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const hyperReq = httpsRequest(options, (hyperRes) => {
    let data = "";
    hyperRes.on("data", (chunk) => { data += chunk; });
    hyperRes.on("end", () => {
      if (hyperRes.statusCode === 200 || hyperRes.statusCode === 204) {
        return res.json({ ok: true });
      }
      try {
        const parsed = JSON.parse(data);
        res.status(hyperRes.statusCode).json({ error: parsed.message || "Navigation failed" });
      } catch {
        res.status(500).json({ error: "Navigation failed" });
      }
    });
  });

  hyperReq.on("error", () => {
    res.status(500).json({ error: "Failed to reach Hyperbeam" });
  });

  hyperReq.write(postData);
  hyperReq.end();
});

app.use(express.static(publicPath));
app.use("/qatual/", express.static(uvPath));

app.get("/u/*", (req, res) => {
  res.sendFile(join(publicPath, "u", "index.html"));
});

app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

const port = 8080;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
