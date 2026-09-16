/* lucianomusella.com — web-v2 · nav, motion, embeds, tracking (sin dependencias) */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = w.matchMedia('(max-width: 600px)').matches;

  /* ---------- atribución + tracking (dataLayer, sin proveedor) ---------- */
  var utm = {};
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k); });
    if (Object.keys(utm).length) sessionStorage.setItem('lm_utm', JSON.stringify(utm));
    else utm = JSON.parse(sessionStorage.getItem('lm_utm') || '{}');
    if (!localStorage.getItem('lm_first_touch')) {
      localStorage.setItem('lm_first_touch', JSON.stringify({ at: new Date().toISOString(), landing: location.pathname, referrer: d.referrer || 'direct', utm: utm }));
    }
    if (!sessionStorage.getItem('lm_sid')) sessionStorage.setItem('lm_sid', Math.random().toString(36).slice(2) + Date.now().toString(36));
  } catch (e) {}
  w.dataLayer = w.dataLayer || [];
  function track(event, props) {
    var p = Object.assign({ event: event, path: location.pathname, page_type: d.body.dataset.page || 'page', ts: Date.now() }, utm, props || {});
    try { p.session_id = sessionStorage.getItem('lm_sid'); p.first_touch = JSON.parse(localStorage.getItem('lm_first_touch') || 'null'); } catch (e) {}
    w.dataLayer.push(p);
    if (w.console && (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || /vercel\.app$/.test(location.hostname))) console.log('[track]', event, p);
    if (typeof w.fbq === 'function' && p.fb_event) { try { w.fbq('trackCustom', p.fb_event, {}); } catch (e) {} }
  }
  w.lmTrack = track;
  track('page_view', d.body.dataset.pageProps ? JSON.parse(d.body.dataset.pageProps) : {});
  d.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var props = {};
    try { props = JSON.parse(el.getAttribute('data-track-props') || '{}'); } catch (err) {}
    props.href = el.getAttribute('href') || null;
    track(el.getAttribute('data-track'), props);
  });

  /* ---------- recursos: filtro + búsqueda (cliente, sin dependencias) ---------- */
  var rgrid = d.getElementById('rgrid');
  if (rgrid) {
    var cards = Array.prototype.slice.call(rgrid.querySelectorAll('.ci'));
    var chips = Array.prototype.slice.call(d.querySelectorAll('#rfilters .chip'));
    var input = d.getElementById('rsearch'), clearBtn = d.querySelector('.search__x'), empty = d.getElementById('rempty');
    var state = { c: '', q: '' }, tmr = null;
    function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    function apply(fromUser) {
      var q = norm(state.q).trim(), words = q ? q.split(/\s+/) : [], shown = 0;
      cards.forEach(function (el) {
        var okC = !state.c || (state.c === 'houston' ? el.dataset.coll === 'houston' : el.dataset.cat === state.c);
        var hay = norm(el.dataset.hay);
        var okQ = words.every(function (wd) { return hay.indexOf(wd) >= 0; });
        var show = okC && okQ; el.classList.toggle('is-hidden', !show); if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      chips.forEach(function (b) { b.classList.toggle('is-active', (b.dataset.filter || '') === state.c); });
      if (clearBtn) clearBtn.hidden = !state.q;
      try {
        var u = new URL(location.href); state.c ? u.searchParams.set('c', state.c) : u.searchParams.delete('c'); state.q ? u.searchParams.set('q', state.q) : u.searchParams.delete('q'); u.hash = '';
        history.replaceState(null, '', u.pathname + (u.search || '') );
      } catch (e) {}
      if (fromUser) track('resource_filter', { category: state.c || 'all', query: state.q || '', results: shown });
    }
    chips.forEach(function (b) { b.addEventListener('click', function () { state.c = b.dataset.filter || ''; apply(true); }); });
    if (input) {
      input.addEventListener('input', function () { state.q = input.value; clearTimeout(tmr); tmr = setTimeout(function () { apply(true); }, 160); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; state.q = ''; apply(true); } });
    }
    if (clearBtn) clearBtn.addEventListener('click', function () { input.value = ''; state.q = ''; apply(true); input.focus(); });
    try {
      var qp = new URLSearchParams(location.search), h = (location.hash || '').replace('#', '');
      state.c = qp.get('c') || (h && (h === 'houston' || d.querySelector('#rfilters .chip[data-filter="' + h + '"]')) ? h : '');
      state.q = qp.get('q') || ''; if (input && state.q) input.value = state.q;
    } catch (e) {}
    apply(false);
    if (!mobile && input && !location.hash && !state.q) { /* el buscador queda listo, sin robar el foco en móvil */ }
  }

  /* ---------- tutorial: mostrar la serie que coincide con ?ruta= (si el video está en varias) ---------- */
  var sers = d.querySelectorAll('.ser');
  if (sers.length > 1) {
    try {
      var rq = new URLSearchParams(location.search).get('ruta');
      var hit = rq && d.querySelector('.ser[data-serie="' + rq + '"]');
      if (hit) { sers.forEach(function (s) { s.hidden = s !== hit; }); }
    } catch (e) {}
  }

  /* ---------- nav ---------- */
  var nav = d.querySelector('.nav'), hero = d.querySelector('.hero'), burger = d.querySelector('.burger'), menu = d.querySelector('.menu');
  var lastY = 0;
  function onScroll() {
    var y = w.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > 400 && y > lastY && !(menu && menu.classList.contains('is-open')));
    }
    var prog = d.querySelector('.progress');
    if (prog) { var h = d.documentElement.scrollHeight - w.innerHeight; prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')'; }
    lastY = y;
  }
  w.addEventListener('scroll', function () { w.requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
  if (hero && nav) {
    new IntersectionObserver(function (en) { nav.classList.toggle('is-light', en[0].isIntersecting && en[0].intersectionRatio > 0.15); }, { threshold: [0, 0.15, 0.5] }).observe(hero);
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open); burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open); d.body.style.overflow = open ? 'hidden' : '';
      if (open) nav.classList.remove('is-hidden');
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('is-open'); burger.classList.remove('is-open'); d.body.style.overflow = ''; }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) burger.click(); });
  }
  /* deep-link (Home -> /tutoriales/#ruta-x): aterrizar en el ancla de forma determinista, sin depender del scroll suave */
  if (location.hash && location.hash.length > 1 && !rgrid) {
    try {
      var tgt = d.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (tgt) w.addEventListener('load', function () { setTimeout(function () { tgt.scrollIntoView({ behavior: 'instant', block: 'start' }); }, 60); });
    } catch (e) {}
  }
  /* item activo */
  var path = location.pathname;
  d.querySelectorAll('.nav__links a').forEach(function (a) {
    var h = a.getAttribute('href');
    if ((h === '/' && (path === '/' || path === '/index.html')) || (h !== '/' && path.indexOf(h) === 0)) a.classList.add('is-active');
  });

  /* ---------- hero: entrada + parallax + video ---------- */
  if (hero) {
    w.requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('is-in'); }, 80); });
    var media = hero.querySelector('.hero__media'), vid = hero.querySelector('video');
    if (vid) {
      if (mobile || reduce) { vid.removeAttribute('autoplay'); vid.pause(); vid.style.display = 'none'; }
      else { vid.addEventListener('canplay', function () { hero.classList.add('has-video'); }); var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    }
    if (media && !reduce && !mobile) {
      var ticking = false;
      w.addEventListener('scroll', function () {
        if (ticking) return; ticking = true;
        w.requestAnimationFrame(function () {
          var y = Math.min(w.scrollY, hero.offsetHeight);
          media.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0)';
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ---------- reveals ---------- */
  var rev = d.querySelectorAll('[data-reveal]');
  if (reduce) rev.forEach(function (el) { el.classList.add('is-in'); });
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* ---------- tema del body según sección visible ---------- */
  var secs = d.querySelectorAll('[data-bg]');
  if (secs.length) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) d.body.dataset.theme = en.target.dataset.bg; });
    }, { threshold: 0.35 });
    secs.forEach(function (s) { tio.observe(s); });
  }

  /* ---------- filas horizontales ---------- */
  d.querySelectorAll('.row').forEach(function (row) {
    var sc = row.querySelector('.row__scroll'), prev = row.querySelector('[data-prev]'), next = row.querySelector('[data-next]');
    if (!sc) return;
    function step() { var c = sc.firstElementChild; return c ? c.getBoundingClientRect().width + 20 : 300; }
    function upd() { if (prev) prev.disabled = sc.scrollLeft < 8; if (next) next.disabled = sc.scrollLeft + sc.clientWidth > sc.scrollWidth - 8; }
    if (prev) prev.addEventListener('click', function () { sc.scrollBy({ left: -step() * 2, behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { sc.scrollBy({ left: step() * 2, behavior: reduce ? 'auto' : 'smooth' }); });
    sc.addEventListener('scroll', function () { w.requestAnimationFrame(upd); }, { passive: true });
    w.addEventListener('resize', upd); upd();
    /* arrastre con mouse en desktop */
    var down = false, sx = 0, sl = 0;
    sc.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = sc.scrollLeft; sc.style.scrollSnapType = 'none'; });
    w.addEventListener('pointermove', function (e) { if (!down) return; sc.scrollLeft = sl - (e.clientX - sx); });
    w.addEventListener('pointerup', function () { if (!down) return; down = false; sc.style.scrollSnapType = ''; });
  });

  /* ---------- embeds diferidos de YouTube ---------- */
  d.querySelectorAll('[data-yt]').forEach(function (ph) {
    ph.addEventListener('click', function (e) {
      e.preventDefault();
      var id = ph.getAttribute('data-yt');
      var f = d.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      f.title = ph.getAttribute('data-title') || 'Video'; f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; f.allowFullscreen = true;
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
      ph.style.position = 'relative'; ph.innerHTML = ''; ph.appendChild(f);
      track('video_started', { video_id: id, title: f.title });
    });
  });
  d.querySelectorAll('[data-video-view]').forEach(function (el) {
    var seen = false;
    new IntersectionObserver(function (en) { if (!seen && en[0].isIntersecting && en[0].intersectionRatio >= 0.5) { seen = true; track('video_view', { video_id: el.getAttribute('data-video-view') }); } }, { threshold: 0.5 }).observe(el);
  });

  /* ---------- botones copiar ---------- */
  d.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var pre = b.closest('.codeblock').querySelector('pre');
      var txt = pre ? pre.innerText : '';
      function done() { var t = b.innerHTML; b.classList.add('is-done'); b.textContent = 'Copiado ✓'; setTimeout(function () { b.classList.remove('is-done'); b.innerHTML = t; }, 1600); track('resource_copy', { block: b.getAttribute('data-i') }); }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done); else done();
    });
  });

  /* ---------- lectura de recurso: started / completed ---------- */
  var art = d.querySelector('.prose[data-resource]');
  if (art) {
    var slug = art.getAttribute('data-resource'), started = false, completed = false, t0 = Date.now();
    var end = d.createElement('div'); end.style.height = '1px'; art.appendChild(end);
    w.addEventListener('scroll', function () {
      if (started) return;
      var r = art.getBoundingClientRect(); var seen = (w.innerHeight - r.top) / r.height;
      if (seen > 0.25) { started = true; track('resource_started', { resource: slug }); }
    }, { passive: true });
    new IntersectionObserver(function (en) {
      if (!completed && en[0].isIntersecting && Date.now() - t0 > 3000) { completed = true; track('resource_completed', { resource: slug, read_seconds: Math.round((Date.now() - t0) / 1000) }); }
    }).observe(end);
  }

  /* ---------- formulario del reto (prototipo, sin backend) ---------- */
  d.querySelectorAll('form[data-proto]').forEach(function (form) {
    var startedF = false;
    form.addEventListener('focusin', function () { if (!startedF) { startedF = true; track('challenge_registration_started', { challenge: form.dataset.proto }); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) {
        var f = i.closest('.field'); var bad = !i.value.trim() || (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value));
        if (f) f.classList.toggle('is-error', bad); if (bad) ok = false;
      });
      if (!ok) { var first = form.querySelector('.is-error input'); if (first) first.focus(); return; }
      form.classList.add('is-done');
      track('challenge_registered', { challenge: form.dataset.proto, prototype: true });
    });
    form.querySelectorAll('input,select').forEach(function (i) { i.addEventListener('input', function () { var f = i.closest('.field'); if (f) f.classList.remove('is-error'); }); });
  });

  /* ---------- reto: curso basado en datos ---------- */
  var courseRoot = d.getElementById('course-player'), courseDays = w.challengeCourseDays;
  if (courseRoot && Array.isArray(courseDays)) {
    var selectedDay = 0, selectedLesson = 0, openDays = { 0: true };
    var totalLessons = courseDays.reduce(function (n, day) { return n + day.lessons.length; }, 0);
    var completedLessons = courseDays.reduce(function (n, day) { return n + day.lessons.filter(function (lesson) { return lesson.status === 'completed'; }).length; }, 0);
    function esc(value) { var div = d.createElement('div'); div.textContent = value; return div.innerHTML; }
    function renderCourse() {
      var current = courseDays[selectedDay].lessons[selectedLesson];
      var daysHtml = courseDays.map(function (day, dayIndex) {
        var lessonsHtml = day.lessons.map(function (lesson, lessonIndex) {
          var active = dayIndex === selectedDay && lessonIndex === selectedLesson;
          var marker = lesson.status === 'completed' ? '<span class="course-check" aria-label="Completada">✓</span>' : '<span class="course-num">' + (lessonIndex + 1) + '</span>';
          return '<button class="course-lesson' + (active ? ' is-active' : '') + '" type="button" data-course-lesson="' + dayIndex + ':' + lessonIndex + '">' + marker + '<span>' + esc(lesson.title) + '</span><i>' + (lesson.status === 'active' ? 'En curso' : lesson.status === 'completed' ? 'Completada' : 'Pendiente') + '</i></button>';
        }).join('');
        return '<section class="course-day' + (openDays[dayIndex] ? ' is-open' : '') + '"><button class="course-day__toggle" type="button" aria-expanded="' + !!openDays[dayIndex] + '" data-course-day="' + dayIndex + '"><span><b>' + esc(day.title) + '</b><small>' + day.lessons.length + ' lecciones</small></span><span class="course-chevron">⌄</span></button><div class="course-day__lessons">' + lessonsHtml + '</div></section>';
      }).join('');
      var videoHtml = current.videoId ? '<div class="course-video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(current.videoId) + '?rel=0" title="Video: ' + esc(current.title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>' : '';
      courseRoot.innerHTML = '<div class="course-top"><div><span class="eyebrow eyebrow--dot">Claude en 5 días</span><h2>Tu ruta de aprendizaje</h2></div><div class="course-progress"><span>' + completedLessons + '/' + totalLessons + ' lecciones completadas</span><div role="progressbar" aria-valuemin="0" aria-valuemax="' + totalLessons + '" aria-valuenow="' + completedLessons + '"><i style="width:' + (completedLessons / totalLessons * 100) + '%"></i></div></div></div><div class="course-layout"><aside class="course-sidebar" aria-label="Lecciones del curso">' + daysHtml + '</aside><article class="course-content"><span class="course-content__day">' + esc(courseDays[selectedDay].title) + ' · Lección ' + (selectedLesson + 1) + '</span><h3>' + esc(current.title) + '</h3><p>' + esc(current.content) + '</p>' + videoHtml + '<div class="course-content__note"><b>Tu siguiente paso</b><span>Usa esta lección con un caso real de tu trabajo. Después podrás cambiar estos contenidos directamente en <code>challengeCourseDays</code>.</span></div><div class="course-content__foot"><span class="course-status course-status--' + current.status + '">' + (current.status === 'completed' ? '✓ Completada' : current.status === 'active' ? 'En curso' : 'Pendiente') + '</span><button type="button" class="course-next" data-course-next>Siguiente lección <span>→</span></button></div></article></div>';
      courseRoot.querySelectorAll('[data-course-day]').forEach(function (button) { button.addEventListener('click', function () { var index = Number(button.dataset.courseDay); openDays[index] = !openDays[index]; renderCourse(); }); });
      courseRoot.querySelectorAll('[data-course-lesson]').forEach(function (button) { button.addEventListener('click', function () { var parts = button.dataset.courseLesson.split(':'); selectedDay = Number(parts[0]); selectedLesson = Number(parts[1]); openDays[selectedDay] = true; renderCourse(); track('challenge_lesson_selected', { day: selectedDay + 1, lesson: selectedLesson + 1, title: courseDays[selectedDay].lessons[selectedLesson].title }); }); });
      courseRoot.querySelector('[data-course-next]').addEventListener('click', function () { if (selectedLesson < courseDays[selectedDay].lessons.length - 1) selectedLesson++; else if (selectedDay < courseDays.length - 1) { selectedDay++; selectedLesson = 0; openDays[selectedDay] = true; } renderCourse(); });
    }
    renderCourse();
  }

  /* ---------- captura suave de leads ----------
     Configura la URL publicada de Apps Script una sola vez aquí. El script
     adjunto registra siempre en la pestaña "Leads" y asigna la fecha allá. */
  var LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwNEtZuSl_emmSz7hhtYI5w5-9NK3c2IevQv-xvJpJWZmznqtYquydAzTZ0cFDBW2wgvg/exec';
  var resourcePath = /^\/recursos(?:\/|$)/.test(location.pathname);
  var popupDelay = resourcePath ? 8000 : 10000;
  var popupKey = 'lm_lead_popup_closed:' + location.pathname;
  var capturedKey = 'lm_lead_captured';
  var hasInteracted = false, popupShown = false, delayDone = false;

  function leadSource() {
    if (location.pathname === '/recursos/' || location.pathname === '/recursos/index.html') return 'Recursos';
    if (resourcePath) return 'Recurso: ' + location.pathname.split('/').filter(Boolean).pop();
    return 'Página Web';
  }
  function removeLeadPopup(reason) {
    var modal = d.getElementById('lead-popup');
    if (!modal) return;
    modal.classList.remove('is-visible');
    setTimeout(function () { if (modal.parentNode) modal.parentNode.removeChild(modal); }, reduce ? 0 : 180);
    if (reason) track('lead_popup_' + reason, { source: leadSource() });
  }
  function sendLead(data) {
    if (!LEADS_ENDPOINT || LEADS_ENDPOINT.indexOf('PASTE_YOUR') !== -1) return false;
    // Apps Script acepta este POST sin requerir CORS; la respuesta no contiene datos sensibles.
    try {
      fetch(LEADS_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data), keepalive: true });
      return true;
    } catch (err) { return false; }
  }
  function showLeadPopup() {
    if (popupShown || !hasInteracted || !delayDone) return;
    try { if (sessionStorage.getItem(popupKey) || localStorage.getItem(capturedKey)) return; } catch (err) {}
    popupShown = true;
    var modal = d.createElement('section');
    modal.id = 'lead-popup'; modal.className = 'lead-pop'; modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'lead-popup-title');
    modal.innerHTML = '<div class="lead-pop__card">' +
      '<button class="lead-pop__close" type="button" aria-label="Cerrar">×</button>' +
      '<span class="lead-pop__eyebrow">Recursos prácticos de IA</span>' +
      '<h2 id="lead-popup-title">¿Te mando más ideas como esta?</h2>' +
      '<p>Déjame tus datos y te comparto recursos para aplicar IA en tu trabajo.</p>' +
      '<form class="lead-pop__form" novalidate>' +
      '<label>Nombre<input name="nombre" autocomplete="name" required placeholder="Tu nombre"></label>' +
      '<label>Email<input name="email" type="email" autocomplete="email" required placeholder="tu@email.com"></label>' +
      '<label>Celular<input name="telefono" type="tel" autocomplete="tel" required placeholder="300 000 0000"></label>' +
      '<button class="btn btn--accent" type="submit"><span class="btn__t">Quiero recibirlos</span></button>' +
      '<small>Sin spam. Puedes salir cuando quieras.</small></form></div>';
    d.body.appendChild(modal);
    w.requestAnimationFrame(function () { modal.classList.add('is-visible'); });
    modal.querySelector('.lead-pop__close').addEventListener('click', function () {
      try { sessionStorage.setItem(popupKey, '1'); } catch (err) {}
      removeLeadPopup('closed');
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.querySelector('.lead-pop__close').click(); });
    modal.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.currentTarget, nombre = form.elements.nombre.value.trim(), email = form.elements.email.value.trim(), telefono = form.elements.telefono.value.trim(), telefonoDigits = telefono.replace(/\D/g, '');
      if (!nombre || !telefonoDigits || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { form.classList.add('is-invalid'); return; }
      var submitted = sendLead({ nombre: nombre, email: email, telefono: telefonoDigits, fuente: leadSource() });
      if (!submitted) { form.classList.add('is-error'); return; }
      try { localStorage.setItem(capturedKey, '1'); } catch (err) {}
      track('lead_popup_submitted', { source: leadSource() });
      form.innerHTML = '<div class="lead-pop__success"><b>¡Listo!</b><span>Muy pronto tendrás noticias mías.</span></div>';
      setTimeout(function () { removeLeadPopup('completed'); }, 1600);
    });
    modal.querySelector('input').focus();
    track('lead_popup_shown', { source: leadSource(), delay_seconds: popupDelay / 1000 });
  }
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (eventName) {
    w.addEventListener(eventName, function () { hasInteracted = true; showLeadPopup(); }, { passive: true, once: true });
  });
  setTimeout(function () { delayDone = true; showLeadPopup(); }, popupDelay);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.getElementById('lead-popup')) d.querySelector('.lead-pop__close').click(); });

  /* ---------- feedback físico en tap ---------- */
  d.addEventListener('pointerdown', function (e) { var b = e.target.closest('.btn,.chip,.card,.res,.route,.vitem,.coll__i,.show__i'); if (b) b.classList.add('is-pressed'); }, { passive: true });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { d.addEventListener(ev, function () { d.querySelectorAll('.is-pressed').forEach(function (b) { b.classList.remove('is-pressed'); }); }, { passive: true }); });

  /* ---------- transición de página (fade) ---------- */
  if (!reduce) {
    d.body.style.opacity = '0'; d.body.style.transition = 'opacity .35s cubic-bezier(.32,.72,0,1)';
    w.requestAnimationFrame(function () { d.body.style.opacity = '1'; });
    d.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a) return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || a.target === '_blank' || /^(https?:)?\/\//.test(h) || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); d.body.style.opacity = '0'; setTimeout(function () { location.href = h; }, 180);
    });
    w.addEventListener('pageshow', function (ev) { if (ev.persisted) d.body.style.opacity = '1'; });
  }
})();
