/* Biblioteca Forth: buscador, filtro de clases por tema, sección activa en el menú lateral y
   menú lateral en celular. */
(function () {
  var d = document, w = window;
  var side = d.getElementById('bside'), burger = d.querySelector('.b-burger');
  var links = d.querySelectorAll('[data-nav]'), groups = d.querySelectorAll('[data-group]');
  var q = d.getElementById('bq'), empty = d.getElementById('bempty');
  var topic = 'all';

  burger.addEventListener('click', function () { var o = side.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); });
  side.addEventListener('click', function (e) { if (e.target.closest('a')) side.classList.remove('is-open'); });

  // Sección activa: la que cruza el tercio superior de la pantalla
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-nav') === x.target.id); });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    groups.forEach(function (g) { io.observe(g); });
  }

  function apply() {
    var term = q.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var any = false;
    groups.forEach(function (g) {
      var cards = g.querySelectorAll('[data-search]'), shown = 0;
      cards.forEach(function (c) {
        var text = c.getAttribute('data-search').normalize('NFD').replace(/[̀-ͯ]/g, '');
        var okTopic = g.id !== 'clases' || topic === 'all' || c.getAttribute('data-topic') === topic;
        var ok = okTopic && (!term || text.indexOf(term) !== -1);
        c.hidden = !ok; if (ok) shown++;
      });
      // Con búsqueda, se esconden las secciones sin resultados (y "Empieza por aquí" para no repetir)
      g.hidden = term ? (shown === 0 || g.id === 'inicio') : false;
      if (shown) any = true;
    });
    empty.hidden = !term || any;
  }
  q.addEventListener('input', apply);
  d.querySelectorAll('.b-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      topic = chip.getAttribute('data-topic');
      d.querySelectorAll('.b-chip').forEach(function (c) { c.classList.toggle('is-on', c === chip); });
      apply();
    });
  });
})();
