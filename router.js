// Ultra-lightweight, zero-runtime client-side router for instant page transitions
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

  function updateNavActive(path) {
    const norm = path.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const linkNorm = href.replace(/\/$/, '') || '/';
      if (linkNorm === norm || (norm === '/' && linkNorm === '/index.html') || (norm === '/register' && linkNorm === '/register.html') || (norm === '/roadmap' && linkNorm === '/roadmap.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
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
        const newMain = doc.querySelector('main');
        const curMain = document.querySelector('main');
        if (newMain && curMain) {
          curMain.innerHTML = newMain.innerHTML;
          curMain.className = newMain.className;
        }
        document.title = doc.title;
        updateNavActive(path);
        window.scrollTo(0, 0);

        // Execute scripts in the newly loaded page
        doc.querySelectorAll('script').forEach(s => {
          if (s.src && s.src.includes('router.js')) return;
          const newScript = document.createElement('script');
          if (s.src) {
            newScript.src = s.src;
          } else {
            newScript.textContent = s.textContent;
          }
          document.body.appendChild(newScript);
        });
      };

      if (document.startViewTransition) {
        document.startViewTransition(applyContent);
      } else {
        applyContent();
      }

      if (push) {
        window.history.pushState({ path }, '', url);
      }
    } catch (e) {
      // Fallback to native navigation if fetch fails
      window.location.href = url;
    }
  }

  // Intercept local link clicks
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || a.target === '_blank') {
      return;
    }
    e.preventDefault();
    loadPage(href, true);
  });

  window.addEventListener('popstate', () => {
    loadPage(window.location.pathname, false);
  });

  // Pre-cache other pages on idle for instant sub-millisecond clicks
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
