(function () {
  // Inject drawer HTML
  var drawerHTML = `
<!-- Navigation Drawer Overlay -->
<div id="drawer-overlay" class="fixed inset-0 bg-primary/30 backdrop-blur-[3px] z-[55] hidden opacity-0 transition-opacity duration-300" style="background:rgba(1,45,29,0.35);backdrop-filter:blur(3px);"></div>

<!-- Navigation Drawer -->
<aside id="nav-drawer" class="fixed inset-y-0 left-0 z-[60] flex flex-col h-full rounded-r-2xl shadow-2xl transition-transform duration-500 ease-in-out overflow-hidden"
  style="width:min(85%,340px);background:rgba(249,249,249,0.97);backdrop-filter:blur(16px);border-right:1px solid #735c00;transform:translateX(-100%);">

  <!-- Profile Header -->
  <div style="background:#1b4332;" class="px-6 pt-6 pb-5 flex flex-col gap-4 border-b border-yellow-700/20">
    <div class="flex justify-between items-start">
      <div class="w-16 h-16 rounded-full border-2 border-yellow-200 overflow-hidden shadow-lg">
        <img alt="NBKKC Profile" class="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBht9ubYUw3KW7a6hsKfe3UW0czV4O3Eq5EwgJbgRKemddLK9ZvyzzxmvccJsEm_d6IR2KmQq3EQyV3UlCLw2ZxKswK4llxUwN0XkDUvYojqp2TiRnV6Q82fYbGpRq6Z5KxFeAYXvQLeX3a8WusslnZmygGtUjgWZVrM0o0shFsGJcWvWi2fwfxuDCrRma5yP2fyzU9oCEhJGE-cwkmQBROp4OAhyZIhbqZLjHO--h2LoMjKAKMrO-bVjWzaxHBJ-tcXVVbeoa43gNV" />
      </div>
      <span class="material-symbols-outlined" style="color:#ffe088;font-variation-settings:'FILL' 1;font-size:24px;">verified</span>
    </div>
    <div>
      <h2 style="color:#ffe088;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;line-height:1.3;">NBKKC Agro Foods</h2>
      <p style="color:rgba(166,208,185,0.85);font-size:14px;margin-top:2px;">Mana Raithu Premium</p>
    </div>
    <span style="color:rgba(166,208,185,0.6);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;font-family:'Montserrat',sans-serif;">v1.0.2</span>
  </div>

  <!-- Nav Items -->
  <nav class="flex-1 overflow-y-auto" style="border-top:none;">
    <div style="border-bottom:1px solid #c1c8c2;padding:8px 0;">
      <a href="dealer-distributor.html" class="drawer-link" style="display:flex;align-items:center;gap:16px;padding:14px 24px;color:#414844;text-decoration:none;transition:all 0.25s;">
        <span class="material-symbols-outlined" style="color:#735c00;">handshake</span>
        <span style="font-family:'Work Sans',sans-serif;font-size:16px;">Dealer Registration</span>
      </a>
      <a href="certifications.html" class="drawer-link" style="display:flex;align-items:center;gap:16px;padding:14px 24px;color:#414844;text-decoration:none;transition:all 0.25s;">
        <span class="material-symbols-outlined" style="color:#735c00;">verified</span>
        <span style="font-family:'Work Sans',sans-serif;font-size:16px;">Certifications</span>
      </a>
    </div>
    <div style="padding:8px 0;">
      <a href="#" class="drawer-link" style="display:flex;align-items:center;gap:16px;padding:14px 24px;color:#414844;text-decoration:none;transition:all 0.25s;">
        <span class="material-symbols-outlined" style="color:#735c00;">local_shipping</span>
        <span style="font-family:'Work Sans',sans-serif;font-size:16px;">Track Order</span>
      </a>
      <a href="contact-us.html" class="drawer-link" style="display:flex;align-items:center;gap:16px;padding:14px 24px;color:#414844;text-decoration:none;transition:all 0.25s;">
        <span class="material-symbols-outlined" style="color:#735c00;">support_agent</span>
        <span style="font-family:'Work Sans',sans-serif;font-size:16px;">Support</span>
      </a>
      <a href="about-us.html" class="drawer-link" style="display:flex;align-items:center;gap:16px;padding:14px 24px;color:#414844;text-decoration:none;transition:all 0.25s;">
        <span class="material-symbols-outlined" style="color:#735c00;">info</span>
        <span style="font-family:'Work Sans',sans-serif;font-size:16px;">About Us</span>
      </a>
    </div>
    <!-- Language Selection -->
    <div style="padding:20px 24px 16px;border-top:1px solid #c1c8c2;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span class="material-symbols-outlined" style="color:#717973;font-size:18px;">language</span>
        <span style="font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#717973;">Language Selection</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button id="drawer-lang-en" onclick="drawerSetLanguage('en')"
          style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:12px 16px;border-radius:12px;background:#1b4332;color:#86af99;font-family:'Work Sans',sans-serif;font-size:16px;font-weight:600;border:none;cursor:pointer;transition:all 0.25s;">
          <span>English</span>
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:18px;">check_circle</span>
        </button>
        <button id="drawer-lang-te" onclick="drawerSetLanguage('te')"
          style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:12px 16px;border-radius:12px;color:#414844;font-family:'Work Sans',sans-serif;font-size:16px;border:none;background:transparent;cursor:pointer;transition:all 0.25s;">
          <span>తెలుగు (Telugu)</span>
        </button>
        <button id="drawer-lang-hi" onclick="drawerSetLanguage('hi')"
          style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:12px 16px;border-radius:12px;color:#414844;font-family:'Work Sans',sans-serif;font-size:16px;border:none;background:transparent;cursor:pointer;transition:all 0.25s;">
          <span>हिन्दी (Hindi)</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Footer -->
  <div style="background:#012d1d;padding:20px 24px;border-top:1px solid rgba(115,92,0,0.4);display:flex;flex-direction:column;align-items:center;gap:10px;">
    <p style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#ffe088;">Mana Raithu</p>
    <div style="display:flex;gap:24px;">
      <span class="material-symbols-outlined" style="color:rgba(134,175,153,0.7);cursor:pointer;font-size:22px;">book</span>
      <span class="material-symbols-outlined" style="color:rgba(134,175,153,0.7);cursor:pointer;font-size:22px;">potted_plant</span>
      <span class="material-symbols-outlined" style="color:rgba(134,175,153,0.7);cursor:pointer;font-size:22px;">public</span>
    </div>
    <div style="display:flex;gap:16px;">
      <a href="#" style="color:rgba(134,175,153,0.7);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Montserrat',sans-serif;text-decoration:none;">Privacy Policy</a>
      <a href="contact-us.html" style="color:rgba(134,175,153,0.7);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Montserrat',sans-serif;text-decoration:none;">Contact Us</a>
    </div>
    <p style="font-size:10px;color:rgba(134,175,153,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:'Montserrat',sans-serif;">Version 1.0.2 &bull; &copy; 2024 NBKKC</p>
  </div>
</aside>`;

  // Insert drawer into body
  document.body.insertAdjacentHTML('beforeend', drawerHTML);

  // Hover styles for drawer links
  var style = document.createElement('style');
  style.textContent = '.drawer-link:hover { background:#f3f3f4; padding-left:32px !important; }';
  document.head.appendChild(style);

  var drawer = document.getElementById('nav-drawer');
  var overlay = document.getElementById('drawer-overlay');

  // Find and upgrade the menu button
  var menuBtn = document.getElementById('menu-btn');
  if (!menuBtn) {
    // Find the first menu icon span and wrap/replace it
    var menuSpans = document.querySelectorAll('.material-symbols-outlined');
    for (var i = 0; i < menuSpans.length; i++) {
      if (menuSpans[i].textContent.trim() === 'menu') {
        var span = menuSpans[i];
        var btn = document.createElement('button');
        btn.id = 'menu-btn';
        btn.setAttribute('aria-label', 'Open navigation menu');
        btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;';
        span.id = 'menu-icon';
        span.parentNode.insertBefore(btn, span);
        btn.appendChild(span);
        menuBtn = btn;
        break;
      }
    }
  }

  function openDrawer() {
    drawer.style.transform = 'translateX(0)';
    overlay.classList.remove('hidden');
    overlay.style.opacity = '0';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    });
    document.body.style.overflow = 'hidden';
    var icon = document.getElementById('menu-icon');
    if (icon) icon.textContent = 'close';
  }

  function closeDrawer() {
    drawer.style.transform = 'translateX(-100%)';
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.classList.add('hidden'); }, 300);
    document.body.style.overflow = '';
    var icon = document.getElementById('menu-icon');
    if (icon) icon.textContent = 'menu';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (drawer.style.transform === 'translateX(0px)' || drawer.style.transform === 'translateX(0)') {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // Language switcher
  window.drawerSetLanguage = function (lang) {
    ['en', 'te', 'hi'].forEach(function (l) {
      var btn = document.getElementById('drawer-lang-' + l);
      if (!btn) return;
      var icon = btn.querySelector('.material-symbols-outlined');
      if (l === lang) {
        btn.style.background = '#1b4332';
        btn.style.color = '#86af99';
        btn.style.fontWeight = '600';
        if (!icon) {
          var ic = document.createElement('span');
          ic.className = 'material-symbols-outlined';
          ic.setAttribute('style', "font-variation-settings:'FILL' 1;font-size:18px;");
          ic.textContent = 'check_circle';
          btn.appendChild(ic);
        }
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#414844';
        btn.style.fontWeight = '400';
        if (icon) icon.remove();
      }
    });
  };
})();
