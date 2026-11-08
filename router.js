// Lightweight SPA router + shared chrome (mobile nav)
(function () {
  const routes = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/features': 'index.html',
    '/register': 'register.html',
    '/register.html': 'register.html',
    '/roadmap': 'roadmap.html',
    '/roadmap.html': 'roadmap.html'
  };

  const pageCache = new Map();

  function closeMobileNav() {
    const panel = document.getElementById('mobileNav');
    const toggle = document.getElementById('navToggle');
    if (panel) {
      panel.classList.remove('open');
      panel.hidden = true;
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '打开菜单');
    }
  }

  function bindMobileNav() {
    const toggle = document.getElementById('navToggle');
    const panel = document.getElementById('mobileNav');
    if (!toggle || !panel || toggle.dataset.bound === '1') return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
  }

  function updateNavActive(path) {
    const norm = path.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkNorm = href.replace(/\/$/, '') || '/';
      const match =
        linkNorm === norm ||
        (norm === '/' && (linkNorm === '/' || linkNorm === '/index.html')) ||
        (norm === '/register' && (linkNorm === '/register' || linkNorm === '/register.html')) ||
        (norm === '/roadmap' && (linkNorm === '/roadmap' || linkNorm === '/roadmap.html'));
      link.classList.toggle('active', match);
    });
  }

  async function loadPage(url, push = true) {
    const parsed = new URL(url, window.location.origin);
    const path = parsed.pathname;
    const file = routes[path] || (path.endsWith('.html') ? path.substring(1) : 'index.html');

    try {
      let html = pageCache.get(file);
      if (!html) {
        const res = await fetch(file);
        if (!res.ok) throw new Error('Network error');
        html = await res.text();
        pageCache.set(file, html);
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const applyContent = () => {
        if (typeof window.disposePage === "function") window.disposePage();
        window.disposePage = undefined;
        const newMain = doc.querySelector('main');
        const curMain = document.querySelector('main');
        if (newMain && curMain) {
          curMain.innerHTML = newMain.innerHTML;
          curMain.className = newMain.className;
        }

        // Refresh header CTA / active state from fetched page when present
        const newHeader = doc.querySelector('header');
        const curHeader = document.querySelector('header');
        if (newHeader && curHeader) {
          curHeader.innerHTML = newHeader.innerHTML;
        }

        document.title = doc.title;
        updateNavActive(path);
        closeMobileNav();
        bindMobileNav();
        window.scrollTo(0, 0);

        doc.querySelectorAll('script').forEach(s => {
          if (s.src && s.src.includes('router.js')) return;
          const newScript = document.createElement('script');
          if (s.src) newScript.src = s.src;
          else newScript.textContent = s.textContent;
          document.body.appendChild(newScript);
          if (!s.src) newScript.remove();
        });
      };

      if (document.startViewTransition) {
        document.startViewTransition(applyContent);
      } else {
        applyContent();
      }

      if (push) window.history.pushState({ path }, '', url);
    } catch (e) {
      window.location.href = url;
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || a.target === '_blank') {
      return;
    }
    e.preventDefault();
    closeMobileNav();
    loadPage(href, true);
  });

  window.addEventListener('popstate', () => {
    loadPage(window.location.pathname, false);
  });

  bindMobileNav();

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      ['register.html', 'roadmap.html', 'index.html'].forEach(f => {
        if (!pageCache.has(f)) {
          fetch(f).then(r => r.text()).then(html => pageCache.set(f, html)).catch(() => {});
        }
      });
    });
  }
})();
