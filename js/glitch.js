// Efecto Glitch Cyberpunk - Transición de páginas
(function() {
  const GLITCH_DURATION = 850; // ms

  // Crear overlay si no existe (fallback por si el HTML no lo tiene)
  function ensureOverlay() {
    let overlay = document.getElementById('glitch-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'glitch-overlay';
      overlay.innerHTML = `
        <div class="glitch-bars"><span></span><span></span><span></span><span></span></div>
        <div class="glitch-wrapper">
          <div class="glitch-text" data-text="NIXCOBT">NIXCOBT</div>
          <div class="glitch-bar"></div>
          <div class="glitch-sub">Iniciando transmisión_</div>
        </div>`;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function triggerGlitch(callback) {
    const overlay = ensureOverlay();
    document.body.classList.add('glitching');
    overlay.classList.add('active');

    // Sonido visual: cambiar textos aleatoriamente tipo matrix
    const texts = ['NIXCOBT', 'CARGANDO', 'SYSTEM // 0101', 'CONECTANDO', '>>_'];
    const glitchText = overlay.querySelector('.glitch-text');
    const subText = overlay.querySelector('.glitch-sub');
    let interval = setInterval(() => {
      if (glitchText) {
        const rnd = texts[Math.floor(Math.random() * texts.length)];
        glitchText.textContent = rnd;
        glitchText.setAttribute('data-text', rnd);
      }
      if (subText) {
        subText.textContent = Math.random() > 0.5 ? 'Iniciando transmisión_' : 'Cargando sistema_  ' + Math.floor(Math.random()*100) + '%';
      }
    }, 90);

    setTimeout(() => {
      clearInterval(interval);
      if (callback) callback();
    }, GLITCH_DURATION);
  }

  // Interceptar clicks en enlaces internos .html
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = ensureOverlay();

    // Entrada inicial con glitch suave
    document.body.classList.add('glitching');
    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
      document.body.classList.remove('glitching');
    }, 650);

    // Links que deben hacer glitch
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Solo enlaces internos que terminan en .html o son ./ o ../ y no anchors, no externos, no _blank, no data-bs-*
      const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');
      const isModalTrigger = link.hasAttribute('data-bs-toggle') || link.hasAttribute('data-bs-target');
      const isSamePageAnchor = href.includes('#');
      if (isExternal || isModalTrigger || isSamePageAnchor) return;
      if (!href.endsWith('.html') && href !== './' && href !== '../') {
        // también capturar href que apuntan a .html con rutas relativas
        if (!href.includes('.html')) return;
      }
      if (link.target === '_blank') return;

      link.addEventListener('click', (e) => {
        // Evitar doble trigger si ya está activo
        if (overlay.classList.contains('active')) return;
        const dest = link.getAttribute('href');
        // Si es la misma página, no hacer transición
        const current = window.location.pathname.split('/').pop() || 'index.html';
        const target = dest.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
        if (current === target && !dest.includes('/')) {
          // mismo archivo, verificar si realmente es misma ruta
          // Dejar que el navegador maneje (no recargar)
          // Pero igual hacemos glitch si es link de nav active? No
          return;
        }
        e.preventDefault();
        triggerGlitch(() => {
          window.location.href = dest;
        });
      });
    });

    // Soporte para navegación con teclado / back/forward: mostrar glitch al cargar (ya hecho arriba)
  });

  // Exponer función global por si se quiere llamar manual
  window.triggerGlitchTransition = triggerGlitch;
})();
