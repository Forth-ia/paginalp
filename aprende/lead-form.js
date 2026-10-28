/* /aprende — agenda integrada en la sección "Cómo empezar" (estilo iClosed).
   1. Contacto: queda guardado en el Sheets MAESTRO aunque abandone (FormularioIniciado).
   2. Preguntas: calificado -> Lead y se desbloquea el calendario de la derecha;
      no calificado -> LeadNoCalificado y curso gratis. Prioritarios: solo horarios de admin@getforth.ai.
   3. Agenda: horario libre de los closers -> Schedule. Cada evento va por pixel + API de
      Conversiones con el mismo event_id. */
(function () {
  'use strict';
  var d = document, w = window;
  var form = d.getElementById('leadForm');
  if (!form || !w.aprendeQualify) return;
  var Q = w.aprendeQualify.QUESTIONS, qualify = w.aprendeQualify.qualify, priority = w.aprendeQualify.priority;
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var book = d.getElementById('agenda'), summary = d.getElementById('lfSummary');
  // No se mueve el foco al cargar la página: solo cuando la persona ya está usando la agenda.
  var focusOk = false;
  book.addEventListener('pointerdown', function () { focusOk = true; });
  book.addEventListener('keydown', function () { focusOk = true; });

  // UTMs de la visita: se conservan si la persona navega antes de llenar el formulario.
  var utm = {};
  try {
    var qs = new URLSearchParams(location.search);
    UTM_KEYS.forEach(function (k) { if (qs.get(k)) utm[k] = qs.get(k); });
    if (Object.keys(utm).length) sessionStorage.setItem('ap_utm', JSON.stringify(utm));
    else utm = JSON.parse(sessionStorage.getItem('ap_utm') || '{}');
  } catch (e) {}

  // Preguntas de opción múltiple, generadas desde aprende-qualify.js.
  var holder = d.getElementById('lfQuestions');
  Object.keys(Q).forEach(function (name) {
    var html = '<fieldset class="lf__step" data-step><legend class="lf__q">' + Q[name].label + '</legend><div class="lf__opts">';
    Object.keys(Q[name].options).forEach(function (value) {
      html += '<label class="lf__opt"><input type="radio" name="' + name + '" value="' + value + '"><span>' + Q[name].options[value] + '</span></label>';
    });
    holder.insertAdjacentHTML('beforeend', html + '</div></fieldset>');
  });

  form.elements.pais.innerHTML = w.aprendeQualify.COUNTRIES.map(function (c) {
    return '<option value="' + c[0] + '">' + c[0] + ' (+' + c[1] + ')</option>';
  }).join('');

  var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
  var wait = form.querySelector('[data-wait]');
  var back = d.getElementById('lfBack'), count = d.getElementById('lfCount'), bar = d.getElementById('lfBar');
  var current = 0, sending = false, contact = null;

  function show(index) {
    current = index;
    steps.forEach(function (step, i) { step.classList.toggle('is-current', i === index); step.classList.remove('is-invalid'); });
    count.textContent = 'Paso ' + (index + 1) + ' de ' + steps.length;
    bar.style.width = ((index + 1) / steps.length * 100) + '%';
    back.hidden = index === 0;
    var field = steps[index].querySelector('input:checked, textarea, input:not([type="radio"]):not(.lf__hp), input');
    if (field && focusOk) field.focus({ preventScroll: true });
  }
  function bookStep(n) {
    book.querySelectorAll('[data-bstep]').forEach(function (el) { el.classList.toggle('is-on', Number(el.getAttribute('data-bstep')) <= n); });
  }
  function invalid(step) { step.classList.add('is-invalid'); return false; }
  function newId(prefix) { return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function firstName() { return contact.nombre.split(' ')[0]; }
  function names(root) { root.querySelectorAll('[data-name]').forEach(function (el) { el.textContent = firstName(); }); }
  function pixel(kind, name, params, id) {
    if (typeof w.fbq !== 'function') return;
    try { w.fbq(kind, name, params, { eventID: id }); } catch (err) {}
  }
  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
  }

  function cookie(name) {
    var m = d.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function fbc() {
    var value = cookie('_fbc');
    if (value) return value;
    try { var id = new URLSearchParams(location.search).get('fbclid'); if (id) return 'fb.1.' + Date.now() + '.' + id; } catch (e) {}
    return '';
  }
  function withContact(extra) {
    var data = { nombre: contact.nombre, email: contact.email, telefono: contact.telefono, pais: contact.pais,
      source_url: location.href.split('#')[0], fbp: cookie('_fbp'), fbc: fbc(), utm: utm };
    Object.keys(extra).forEach(function (k) { data[k] = extra[k]; });
    return data;
  }

  /* ---------- paso 1: contacto ---------- */
  form.querySelector('[data-contact]').addEventListener('click', function () {
    var el = form.elements, step = steps[current];
    var data = { nombre: el.nombre.value.trim(), email: el.email.value.trim(), telefono: el.telefono.value.trim(), pais: el.pais.value };
    var digits = data.telefono.replace(/\D/g, '');
    if (data.nombre.length < 2 || /^[=+@-]/.test(data.nombre) || !EMAIL_RE.test(data.email) ||
        !/^[+\d\s().-]+$/.test(data.telefono) || digits.length < 6 || digits.length > 15) return invalid(step);
    var changed = !contact || contact.email !== data.email || contact.telefono !== data.telefono || contact.nombre !== data.nombre;
    contact = data;
    if (changed && !el.website.value) {
      var id = newId('form');
      pixel('trackCustom', 'FormularioIniciado', { content_name: 'aprende' }, id);
      post('/api/aprende-lead', withContact({ step: 'contacto', event_id: id })).catch(function () {});
    }
    loadSlots(); // el calendario queda listo mientras responde las preguntas
    show(current + 1);
  });

  form.addEventListener('change', function (e) {
    if (e.target.type !== 'radio') return;
    setTimeout(function () { show(current + 1); }, 220);
  });
  back.addEventListener('click', function () { if (current > 0 && !sending) show(current - 1); });
  form.addEventListener('input', function () { steps[current].classList.remove('is-invalid'); });
  d.querySelectorAll('[data-open-waitlist]').forEach(function (el) { el.addEventListener('click', function () { focusOk = true; }); });

  /* ---------- paso 2: calificación ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var step = steps[current];
    if (!contact) return show(0);
    var answers = {
      aplica: (form.querySelector('input[name="aplica"]:checked') || {}).value,
      inicio: (form.querySelector('input[name="inicio"]:checked') || {}).value,
      inversion: (form.querySelector('input[name="inversion"]:checked') || {}).value,
      reto: form.elements.reto.value.trim()
    };
    if (answers.reto.length < 3) return invalid(step);
    // Si falta una respuesta (no debería pasar), vuelve a esa pregunta.
    var missing = ['aplica', 'inicio', 'inversion'].findIndex(function (k) { return !answers[k]; });
    if (missing !== -1) return show(missing + 1);

    sending = true;
    var data = withContact(answers);
    data.step = 'calificacion'; data.event_id = newId('lead'); data.website = form.elements.website.value;
    steps.forEach(function (s) { s.classList.remove('is-current'); });
    back.hidden = true; wait.hidden = false;

    var qualified = qualify(answers);
    if (!data.website) {
      if (qualified) pixel('track', 'Lead', { content_name: 'aprende', lead_status: 'calificado' }, data.event_id);
      else pixel('trackCustom', 'LeadNoCalificado', { content_name: 'aprende', lead_status: 'no_calificado' }, data.event_id);
    }
    var finished = false;
    function finish(serverQualified) {
      if (finished) return; finished = true;
      if (typeof serverQualified === 'boolean') qualified = serverQualified;
      form.hidden = true;
      if (qualified) return openCalendar(priority(answers));
      var notFit = d.getElementById('lfNotFit');
      cal.hidden = true; book.classList.add('book--single');
      names(notFit); notFit.hidden = false;
      book.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Si el servidor tarda (arranque en frío de Sheets), la persona sigue con la regla local.
    setTimeout(finish, 9000);
    post('/api/aprende-lead', data)
      .then(function (r) { return r.json(); })
      .then(function (r) { finish(r && r.ok ? r.qualified : undefined); })
      .catch(function () { finish(); });
  });

  /* ---------- paso 3: calendario ---------- */
  var cal = d.getElementById('lfCal');
  var $ = function (sel) { return cal.querySelector(sel); };
  var slotsPromise = null, byDay = {}, monthCursor = null, firstMonth = null, lastMonth = null, selectedDay = '', selectedSlot = '', booking = false;
  var TZ = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'tu zona').replace(/_/g, ' ');
  var dayKey = function (date) { return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); };
  var upper = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var fmtDay = function (date) { return date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var fmtTime = function (date) { return date.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' }); };

  // prio: solo horarios del closer prioritario (admin@getforth.ai).
  var prioritySlots = false;
  function loadSlots(force) {
    if (slotsPromise && !force) return slotsPromise;
    var qs = [prioritySlots ? 'p=1' : '', force ? 't=' + Date.now() : ''].filter(Boolean).join('&');
    slotsPromise = fetch('/api/aprende-agenda' + (qs ? '?' + qs : ''))
      .then(function (r) { if (!r.ok) throw new Error('slots'); return r.json(); })
      .then(function (r) { return r.slots || []; });
    slotsPromise.catch(function () { slotsPromise = null; });
    return slotsPromise;
  }

  // El calendario se ve (bloqueado) desde que la sección se acerca a la pantalla.
  $('[data-tz]').textContent = TZ;
  monthCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  firstMonth = lastMonth = monthCursor;
  renderMonth();
  $('[data-cal-loading]').hidden = true;
  var preload = function () { loadSlots().then(function (s) { if (cal.classList.contains('is-locked')) renderSlots(s); }, function () {}); };
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); preload(); } }, { rootMargin: '600px 0px' });
    io.observe(book);
  } else preload();

  function openCalendar(prio) {
    names(cal); names(summary);
    $('[data-cal-closed]').hidden = true; $('[data-cal-open]').hidden = false;
    summary.querySelector('[data-summary-who]').textContent = contact.nombre + ' · ' + contact.email;
    summary.hidden = false; bookStep(2);
    cal.classList.remove('is-locked'); cal.classList.add('is-loading'); $('[data-cal-loading]').hidden = false;
    if (w.matchMedia('(max-width: 900px)').matches) cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var request = prio ? (prioritySlots = true, loadSlots(true)) : loadSlots();
    request.catch(function () { return loadSlots(true); }).then(renderSlots, function () {
      showError('No pudimos cargar los horarios. Recarga la página o escríbenos por WhatsApp para agendar.');
    });
  }

  function renderSlots(slots) {
    cal.classList.remove('is-loading'); $('[data-cal-loading]').hidden = true;
    byDay = {};
    slots.forEach(function (iso) { var t = new Date(iso); (byDay[dayKey(t)] = byDay[dayKey(t)] || []).push(t); });
    var days = Object.keys(byDay).sort();
    if (!days.length) {
      if (cal.classList.contains('is-locked')) return;
      cal.querySelector('.cal__grid').hidden = true;
      return showError('En este momento no hay horarios libres en los próximos días. Te escribiremos por WhatsApp para agendar tu llamada.');
    }
    var first = new Date(days[0] + 'T12:00:00'), last = new Date(days[days.length - 1] + 'T12:00:00');
    firstMonth = new Date(first.getFullYear(), first.getMonth(), 1);
    lastMonth = new Date(last.getFullYear(), last.getMonth(), 1);
    if (!monthCursor || monthCursor < firstMonth || monthCursor > lastMonth) monthCursor = firstMonth;
    if (!byDay[selectedDay]) { selectedDay = days[0]; selectedSlot = ''; }
    renderMonth(); renderTimes();
  }

  function renderMonth() {
    $('[data-month]').textContent = upper(monthCursor.toLocaleDateString('es', { month: 'long', year: 'numeric' }));
    $('[data-month-prev]').disabled = monthCursor <= firstMonth;
    $('[data-month-next]').disabled = monthCursor >= lastMonth;
    var y = monthCursor.getFullYear(), m = monthCursor.getMonth();
    var offset = (new Date(y, m, 1).getDay() + 6) % 7, total = new Date(y, m + 1, 0).getDate(), html = '';
    for (var i = 0; i < offset; i++) html += '<span></span>';
    for (var day = 1; day <= total; day++) {
      var key = dayKey(new Date(y, m, day)), open = !!byDay[key];
      html += '<button type="button" data-day="' + key + '" class="' + (open ? 'is-open' : '') + (key === selectedDay ? ' is-sel' : '') + '"' +
        (open ? '' : ' disabled') + ' aria-label="' + fmtDay(new Date(y, m, day)) + (open ? '' : ', sin horarios') + '">' + day + '</button>';
    }
    $('[data-days]').innerHTML = html;
  }

  function renderTimes() {
    var times = byDay[selectedDay] || [];
    $('[data-day-label]').textContent = times.length ? upper(fmtDay(times[0])) : 'Elige un día disponible';
    $('[data-times]').innerHTML = times.map(function (t) {
      var iso = t.toISOString();
      return '<button type="button" data-slot="' + iso + '" class="' + (iso === selectedSlot ? 'is-sel' : '') + '">' + fmtTime(t) + '</button>';
    }).join('');
    var confirm = $('[data-confirm]');
    confirm.hidden = !selectedSlot;
    if (selectedSlot) $('[data-pick]').textContent = fmtDay(new Date(selectedSlot)) + ' · ' + fmtTime(new Date(selectedSlot));
  }

  function showError(text) { var el = $('[data-cal-err]'); el.textContent = text; el.hidden = !text; cal.classList.remove('is-loading'); $('[data-cal-loading]').hidden = true; }

  $('[data-month-prev]').addEventListener('click', function () { monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1); renderMonth(); });
  $('[data-month-next]').addEventListener('click', function () { monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1); renderMonth(); });
  $('[data-days]').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-day]');
    if (!b || b.disabled) return;
    selectedDay = b.getAttribute('data-day'); selectedSlot = '';
    renderMonth(); renderTimes();
  });
  $('[data-times]').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-slot]');
    if (!b) return;
    selectedSlot = b.getAttribute('data-slot'); showError('');
    renderTimes();
    $('[data-book]').focus({ preventScroll: true });
  });

  $('[data-book]').addEventListener('click', function () {
    if (booking || !selectedSlot) return;
    booking = true;
    var button = $('[data-book]'), label = button.textContent, id = newId('schedule');
    button.disabled = true; button.textContent = 'Agendando…'; showError('');
    post('/api/aprende-agenda', withContact({ inicio: selectedSlot, event_id: id }))
      .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
      .then(function (r) {
        if (r.status === 409) {
          selectedSlot = '';
          showError('Ese horario se acaba de ocupar. Elige otro, por favor.');
          return loadSlots(true).then(renderSlots);
        }
        if (!r.body.ok) throw new Error('book');
        pixel('track', 'Schedule', { content_name: 'aprende' }, id);
        done(r.body.cita);
      })
      .catch(function () { showError('No pudimos confirmar tu llamada. Inténtalo de nuevo en unos segundos.'); })
      .then(function () { booking = false; button.disabled = false; button.textContent = label; });
  });

  function done(cita) {
    var start = new Date(cita.inicio);
    var panel = d.getElementById('lfDone');
    names(panel);
    panel.querySelector('[data-when]').textContent = fmtDay(start) + ' · ' + fmtTime(start) + ' (' + TZ + ')';
    panel.querySelector('[data-email]').textContent = contact.email;
    var meet = panel.querySelector('[data-meet]');
    if (cita.meet) { meet.href = cita.meet; meet.hidden = false; }
    summary.querySelector('[data-summary-who]').textContent = fmtDay(start) + ' · ' + fmtTime(start);
    cal.hidden = true; panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  show(0);
})();
