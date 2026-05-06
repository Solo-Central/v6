// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/qatual/qatual/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/qatual/handler.js",
  client: "/qatual/client.js",
  bundle: "/qatual/bundle.js",
  config: "/qatual/config.js",
  sw: "/qatual/rizz.sw.js",
};
