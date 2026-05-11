document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.createElement('div');
    navbar.innerHTML = `
    <div class="navbar-container">
        <nav class="navbar">
            <div class="nav-logo">
                <a href="/"><img class="logo-icon" src="/assets/logo.webp"></a>
            </div>
            <div class="nav-links">
                <a href="/pages/gxmez.html" class="nav-link" title="Games">
                    <i class="fas fa-gamepad"></i>
                    <span class="link-text">Games</span>
                </a>
                <a href="/pages/4pps.html" class="nav-link" title="Apps">
                    <i class="fas fa-border-all"></i>
                    <span class="link-text">Apps</span>
                </a>
                <a href="/pages/bookmarklets.html" class="nav-link" title="Bookmarklets">
                    <i class="fa-solid fa-bookmark"></i>
                    <span class="link-text">Bookmarklets</span>
                </a>
                <a href="/pages/settings.html" class="nav-link" title="Settings">
                    <i class="fa-solid fa-gear"></i>
                    <span class="link-text">Settings</span>
                </a>
                <div class="nav-dropdown">
                    <button class="nav-link dropdown-toggle" title="More">
                        <i class="fas fa-plus"></i>
                        <span class="link-text">More</span>
                    </button>
                    <div class="dropdown-menu">
                        <a href="/extra/discord.html" class="dropdown-item" title="Discord">
                            <i class="fa-brands fa-discord"></i>
                            Discord
                        </a>
                        <a href="/extra/credits.html" class="dropdown-item" title="Credits">
                            <i class="fa-solid fa-users"></i>
                            Credits
                        </a>
                        <a href="/extra/partners.html" class="dropdown-item" title="Partners">
                            <i class="fa-solid fa-handshake"></i>
                            Partners
                        </a>
                        <a href="/extra/suggest.html" class="dropdown-item" title="Suggestions">
                            <i class="fa-solid fa-message"></i>
                            Suggestions
                        </a>
                        <a href="/extra/DMCA.html" class="dropdown-item" title="DMCA">
                            <i class="fa-solid fa-scale-balanced"></i>
                            DMCA
                        </a>
                    </div>
                </div>
                <div style="width:1px;height:24px;background:var(--border-primary);opacity:0.3;margin:0 6px;align-self:center;"></div>
                <a href="/pages/account.html" class="nav-link" id="nav-account-link" title="Account">
                    <img id="nav-account-avatar" src="" referrerpolicy="no-referrer" style="display:none;width:32px;height:32px;border-radius:50%;object-fit:cover;">
                    <i class="fa-solid fa-user" id="nav-account-icon"></i>
                    <span class="link-text" id="nav-account-text">Account</span>
                </a>
            </div>
        </nav>
    </div>`;
    document.body.prepend(navbar.firstElementChild);

    const firebaseScript = document.createElement('script');
    firebaseScript.type = 'module';
    firebaseScript.src = '/js/firebase-init.js';
    document.head.appendChild(firebaseScript);

    document.addEventListener('soloAuthChanged', (e) => {
        const user = e.detail.user;
        const avatar = document.getElementById('nav-account-avatar');
        const icon = document.getElementById('nav-account-icon');
        const text = document.getElementById('nav-account-text');
        if (!avatar || !icon || !text) return;

        if (user) {
            avatar.src = user.photoURL || '';
            avatar.style.display = user.photoURL ? 'inline-block' : 'none';
            icon.style.display = user.photoURL ? 'none' : '';
            text.textContent = user.displayName || 'Account';
        } else {
            avatar.style.display = 'none';
            icon.style.display = '';
            text.textContent = 'Account';
        }
    });
});
