/* Home de Forth: menú móvil, video con fachada, conteo de números, manifiesto que se enciende al
   bajar, línea del proceso y fila de casos. Las entradas genéricas ([data-reveal]) y el
   pop-up de leads los maneja site.js. */
(function () {
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = function (name, props) { try { if (w.lmTrack) w.lmTrack(name, props); } catch (e) {} };
  function onView(el, fn, threshold) {
    if (!el) return;
    if (reduce || !('IntersectionObserver' in w)) return fn();
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: threshold || 0.3 });
    io.observe(el);
  }

  // Menú móvil y borde del nav al hacer scroll
  var nav = d.getElementById('fnav'), burger = d.querySelector('.f-nav__burger'), menu = d.getElementById('fmenu');
  burger.addEventListener('click', function () { var open = menu.classList.toggle('is-open'); burger.setAttribute('aria-expanded', open); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); } });
  var sentinel = d.getElementById('hero');
  if ('IntersectionObserver' in w) new IntersectionObserver(function (en) { nav.classList.toggle('is-scrolled', !en[0].isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);

  // Logo: en el hero se ve grande; cuando sale por debajo del menú, el del menú aparece volando
  // desde donde estaba el grande (animación FLIP) y al volver arriba regresa al hero.
  var heroLogo = d.getElementById('heroLogo'), navLogo = d.getElementById('navLogo');
  if (heroLogo && navLogo && 'IntersectionObserver' in w) {
    var shown = false;
    var fly = function () {
      var from = heroLogo.getBoundingClientRect(), to = navLogo.getBoundingClientRect();
      nav.classList.add('has-logo'); heroLogo.classList.add('is-gone');
      if (reduce) return;
      var sc = from.height / to.height;
      navLogo.animate([
        { transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(' + sc + ')', opacity: 1 },
        { transform: 'none', opacity: 1 }
      ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    var land = function () {
      var done = function () { nav.classList.remove('has-logo'); heroLogo.classList.remove('is-gone'); };
      if (reduce) return done();
      var to = heroLogo.getBoundingClientRect(), from = navLogo.getBoundingClientRect();
      heroLogo.classList.remove('is-gone');
      var sc = from.height / to.height;
      heroLogo.animate([
        { transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(' + sc + ')' },
        { transform: 'none' }
      ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
      nav.classList.remove('has-logo');
    };
    new IntersectionObserver(function (en) {
      var visible = en[0].isIntersecting;
      if (!visible && !shown) { shown = true; fly(); }
      else if (visible && shown) { shown = false; land(); }
    }, { rootMargin: '-' + nav.offsetHeight + 'px 0px 0px 0px' }).observe(heroLogo);
  }

  // Entrada del hero
  w.requestAnimationFrame(function () { sentinel.classList.add('is-in'); });

  // Video: la miniatura se cambia por YouTube solo al dar play
  d.querySelectorAll('[data-video]').forEach(function (box) {
    box.querySelector('button').addEventListener('click', function () {
      var id = box.getAttribute('data-video');
      box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Video de Forth" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      track('hero_video_play', { video_id: id });
    });
  });

  // Números que cuentan hasta su valor
  d.querySelectorAll('[data-count]').forEach(function (el) {
    var end = Number(el.getAttribute('data-count')), prefix = el.getAttribute('data-prefix') || '';
    onView(el, function () {
      if (reduce) return;
      var start = performance.now(), dur = 1400;
      (function step(now) {
        var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(end * eased);
        if (t < 1) w.requestAnimationFrame(step);
      })(start);
    }, 0.6);
  });

  // Manifiesto: cada palabra se enciende a medida que el texto cruza la pantalla
  var manifest = d.getElementById('manifest');
  if (manifest) {
    var words = [];
    Array.prototype.slice.call(manifest.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { manifest.insertBefore(d.createTextNode(part), node); return; }
          var s = d.createElement('span'); s.textContent = part; manifest.insertBefore(s, node); words.push(s);
        });
        manifest.removeChild(node);
      } else words.push(node);
    });
    if (reduce || !('IntersectionObserver' in w)) words.forEach(function (s) { s.classList.add('is-on'); });
    else {
      // Una palabra se enciende cuando pasa del 62 % de la pantalla y se apaga si vuelve a bajar.
      var wio = new IntersectionObserver(function (en) {
        en.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting || e.boundingClientRect.top < 0); });
      }, { rootMargin: '0px 0px -38% 0px' });
      words.forEach(function (s) { wio.observe(s); });
    }
  }

  // Línea del proceso
  onView(d.getElementById('steps'), function () { d.getElementById('steps').classList.add('is-in'); }, 0.4);

  // Fila de casos
  var row = d.getElementById('casesRow');
  d.querySelectorAll('[data-cases]').forEach(function (btn) {
    btn.addEventListener('click', function () { row.scrollBy({ left: Number(btn.getAttribute('data-cases')) * (row.firstElementChild.offsetWidth + 18), behavior: reduce ? 'auto' : 'smooth' }); });
  });
})();
