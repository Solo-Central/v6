const v2Style = document.createElement('style');
v2Style.textContent = `
[data-theme="v2"] {
  --primary-bg: #171722;
  --secondary-bg: #212134;
  --navbar-bg: #2a2a42;
  --quicklink-bg: #1e1e30;
  --quicklink-hover: #2d2d4a;
  --accent-dark: #7a7a9e;
  --accent-darker: #6a6a8e;
  --accent-hover: #9d9dc9;
  --accent-blue: #7a6a9e;
  --accent-blue-dark: #6a5a8e;
  --text-white: #e6e6f0;
  --text-gray: #c8c8d8;
  --text-disabled: #6a6a7a;
  --border-primary: #7a7a9e;
  --border-secondary: #9d9dc9;
  --border-white: #e6e6f0;
  --border-pink: #b8a8d8;
  --shadow-primary: rgba(122, 122, 158, 0.4);
  --shadow-secondary: rgba(157, 157, 201, 0.4);
  --shadow-pink: rgba(184, 168, 216, 0.5);
  --shadow-white: rgba(230, 230, 240, 0.2);
  --loading-spinner: #9d9dc9;
  --roddy-box-bg: rgba(33, 33, 52, 0.9);
}`;
document.head.appendChild(v2Style);

function loadParticlesConfig(theme) {
  const configMap = {
    'dark': '/dark.json',
    'light': '/light.json',
    'mexi': '/particlesjs-config.json',
    'bubblegum': '/bubblegum.json',
    'evergreen': '/evergreen.json',
    'frogiee': '/frogiee.json',
    'lavender': '/lavender.json',
    'solarflare': '/solarflare.json',
    'moonlight': '/moonlight.json',
    'v1': null,
    'v2': '/szvy.json',
    'default': '/particlesjs-config.json'
  };

  const existingCanvas = document.querySelector('#particles-js canvas');
  if (existingCanvas) existingCanvas.remove();

  const configFile = configMap[theme];
  if (configFile && typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', configFile, function() {});
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('siteTheme', theme);
  loadParticlesConfig(theme);
  const themeDropdown = document.getElementById('themee');
  if (themeDropdown) themeDropdown.value = theme;
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('siteTheme') || 'default';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const savedFaviconUrl = localStorage.getItem('faviconUrl');
  const savedTitle = localStorage.getItem('pageTitle');
  const savedKeybind = localStorage.getItem('keybind');
  const savedCustomUrl = localStorage.getItem('customUrl');

  if (savedFaviconUrl) {
    let link = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = savedFaviconUrl;
    document.head.appendChild(link);
  }

  if (savedTitle) {
    document.title = savedTitle;
  }

  if (savedKeybind && savedCustomUrl) {
    document.addEventListener('keydown', (e) => {
      if (e.key === savedKeybind) {
        window.open(savedCustomUrl, '_blank');
      }
    });
  }

  const anticloseCheckbox = document.getElementById('anticlose');
  const ANTICLOSE_STORAGE_KEY = 'anticloseEnabled';

  if (anticloseCheckbox) {
    const savedAnticloseState = localStorage.getItem(ANTICLOSE_STORAGE_KEY);
    if (savedAnticloseState !== null) {
      anticloseCheckbox.checked = savedAnticloseState === 'true';
    }

    anticloseCheckbox.addEventListener('change', () => {
      localStorage.setItem(ANTICLOSE_STORAGE_KEY, anticloseCheckbox.checked.toString());
      updateAnticloseHandler();
    });
  }

  function updateAnticloseHandler() {
    const isAnticloseEnabled = localStorage.getItem(ANTICLOSE_STORAGE_KEY) === 'true';
    if (isAnticloseEnabled) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }

  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your work may not be saved.';
    return e.returnValue;
  }

  updateAnticloseHandler();

  const themeDropdown = document.getElementById('themee');

  if (themeDropdown) {
    themeDropdown.value = savedTheme;
    themeDropdown.addEventListener('change', () => {
      const selectedTheme = themeDropdown.value;
      applyTheme(selectedTheme);
      if (window.__soloUser && window.__soloDB) {
        import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js").then(({ doc, setDoc }) => {
          setDoc(doc(window.__soloDB, 'users', window.__soloUser.uid), { theme: selectedTheme }, { merge: true });
        });
      }
    });
  }

  loadParticlesConfig(savedTheme);
});

document.addEventListener('soloAuthChanged', async (e) => {
  const user = e.detail.user;
  if (!user || !window.__soloDB) return;

  const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const snap = await getDoc(doc(window.__soloDB, 'users', user.uid));

  if (snap.exists() && snap.data().theme) {
    applyTheme(snap.data().theme);
  } else {
    const localTheme = localStorage.getItem('siteTheme') || 'default';
    setDoc(doc(window.__soloDB, 'users', user.uid), { theme: localTheme }, { merge: true });
  }
});
