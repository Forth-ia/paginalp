/* /aprende — agenda integrada en la sección "Cómo empezar" (estilo acquisition.com).
   1. Contacto: apenas está completo se despliegan las preguntas en el mismo panel, y queda
      guardado en el Sheets MAESTRO aunque abandone (FormularioIniciado).
   2. Preguntas: la regla de aprende-qualify.js decide en el navegador, así el calendario abre
      al instante; el servidor guarda y manda Lead / LeadNoCalificado en segundo plano.
      Prioritarios: solo horarios de admin@getforth.ai.
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
  var more = d.getElementById('lfMore'), errBox = d.getElementById('lfErr'), el = form.elements;

  // UTMs de la visita: se conservan si la persona navega antes de llenar el formulario.
  var utm = {};
  try {
    var qs = new URLSearchParams(location.search);
    UTM_KEYS.forEach(function (k) { if (qs.get(k)) utm[k] = qs.get(k); });
    if (Object.keys(utm).length) sessionStorage.setItem('ap_utm', JSON.stringify(utm));
    else utm = JSON.parse(sessionStorage.getItem('ap_utm') || '{}');
  } catch (e) {}

  // Preguntas como listas desplegables, generadas desde aprende-qualify.js.
  var holder = d.getElementById('lfQuestions');
  Object.keys(Q).forEach(function (name) {
    var html = '<div class="lf__field" data-field="' + name + '"><label class="lf__label" for="lf_' + name + '">' + Q[name].label + ' <i>*</i></label>' +
      '<select id="lf_' + name + '" name="' + name + '" class="is-empty"><option value="">Selecciona</option>';
    Object.keys(Q[name].options).forEach(function (value) { html += '<option value="' + value + '">' + Q[name].options[value] + '</option>'; });
    holder.insertAdjacentHTML('beforeend', html + '</select></div>');
  });

  el.pais.innerHTML = w.aprendeQualify.COUNTRIES.map(function (c) {
    return '<option value="' + c[0] + '">' + c[0] + ' +' + c[1] + '</option>';
  }).join('');

  var contact = null, sentKey = '', qualifyReq = null, retryQualify = null, sending = false;

  function bookStep(n) {
    book.querySelectorAll('[data-bstep]').forEach(function (x) { x.classList.toggle('is-on', Number(x.getAttribute('data-bstep')) <= n); });
  }
  function newId(prefix) { return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function firstName() { return contact.nombre.split(' ')[0]; }
  function names(root) { root.querySelectorAll('[data-name]').forEach(function (x) { x.textContent = firstName(); }); }
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
  // Campos de contacto que están mal (vacío = todo bien).
  function contactErrors() {
    var tel = el.telefono.value.trim(), digits = tel.replace(/\D/g, ''), email = el.email.value.trim(), bad = [];
    if (!/^[+\d\s().-]+$/.test(tel) || digits.length < 6 || digits.length > 15) bad.push('telefono');
    ['nombre', 'apellido'].forEach(function (k) {
      var v = el[k].value.trim();
      if (!v || /^[=+@-]/.test(v)) bad.push(k);
    });
    if (!EMAIL_RE.test(email) || /^[=+@-]/.test(email)) bad.push('email');
    return bad;
  }
  function readContact() {
    return { nombre: (el.nombre.value.trim() + ' ' + el.apellido.value.trim()).trim(), email: el.email.value.trim(),
      telefono: el.telefono.value.trim(), pais: el.pais.value };
  }
  function mark(fields) {
    form.querySelectorAll('[data-field]').forEach(function (f) { f.classList.toggle('is-invalid', fields.indexOf(f.getAttribute('data-field')) !== -1); });
  }
  function showErr(text) { errBox.textContent = text || ''; errBox.hidden = !text; }

  // Con el contacto completo se despliegan las preguntas, sin botón de por medio.
  function reveal() {
    if (!more.hidden || contactErrors().length) return;
    more.hidden = false;
    loadSlots();
  }
  // FormularioIniciado + guardado en MAESTRO, una vez por cada contacto distinto.
  function saveContact() {
    if (contactErrors().length || el.website.value) return;
    contact = readContact();
    var key = [contact.nombre, contact.email, contact.telefono, contact.pais].join('|');
    if (key === sentKey) return;
    sentKey = key;
    var id = newId('form');
    pixel('trackCustom', 'FormularioIniciado', { content_name: 'aprende' }, id);
    post('/api/aprende-lead', withContact({ step: 'contacto', event_id: id })).catch(function () {});
  }

  function answers() {
    return { aplica: el.aplica.value, inicio: el.inicio.value, inversion: el.inversion.value, reto: el.reto.value.trim() };
  }
  // Si las respuestas ya lo hacen prioritario, sus horarios se van cargando.
  function prefetchPriority() { if (priority(answers())) loadSlots(false, true); }

  form.addEventListener('input', function (e) {
    var f = e.target.closest('[data-field]');
    if (f) f.classList.remove('is-invalid');
    showErr('');
    reveal();
  });
  form.addEventListener('change', function (e) {
    if (e.target.tagName === 'SELECT') e.target.classList.toggle('is-empty', !e.target.value);
    reveal();
    if (more.contains(e.target)) prefetchPriority();
  });
  // Al pasar a las preguntas (o salir del contacto ya completo) queda guardado el contacto.
  form.addEventListener('focusout', function () {
    setTimeout(function () { if (!more.hidden) saveContact(); }, 0);
  });

  /* ---------- paso 2: calificación ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var bad = contactErrors();
    if (bad.length) { mark(bad); showErr('Revisa los campos marcados.'); return; }
    if (more.hidden) { more.hidden = false; loadSlots(); }
    var a = answers();
    bad = ['aplica', 'inicio', 'inversion'].filter(function (k) { return !a[k]; });
    if (a.reto.length < 3) bad.push('reto');
    if (bad.length) {
      mark(bad); showErr('Responde las preguntas marcadas para continuar.');
      var first = form.querySelector('[data-field="' + bad[0] + '"] select, [data-field="' + bad[0] + '"] textarea');
      if (first) first.focus();
      return;
    }
    mark([]); showErr('');
    saveContact();
    contact = readContact();
    sending = true;

    var data = withContact(a);
    data.step = 'calificacion'; data.event_id = newId('lead'); data.website = el.website.value;
    var qualified = qualify(a);
    if (!data.website) {
      if (qualified) pixel('track', 'Lead', { content_name: 'aprende', lead_status: 'calificado' }, data.event_id);
      else pixel('trackCustom', 'LeadNoCalificado', { content_name: 'aprende', lead_status: 'no_calificado' }, data.event_id);
    }
    // Se guarda en segundo plano (el Sheets acepta contacto y calificación en cualquier orden);
    // agendar espera a que termine.
    var sendQualify = function () {
      return post('/api/aprende-lead', data).then(function (r) { if (!r.ok) throw new Error('lead'); return r.json(); });
    };
    retryQualify = sendQualify;
    qualifyReq = sendQualify().catch(function () { return sendQualify(); });
    qualifyReq.catch(function () {});

    form.hidden = true;
    if (qualified) return openCalendar(priority(a));
    var notFit = d.getElementById('lfNotFit');
    cal.hidden = true; book.classList.add('book--single');
    names(notFit); notFit.hidden = false;
    book.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- paso 3: calendario ---------- */
  var cal = d.getElementById('lfCal');
  var $ = function (sel) { return cal.querySelector(sel); };
  var byDay = {}, monthCursor = null, firstMonth = null, lastMonth = null, selectedDay = '', selectedSlot = '', booking = false;
  var TZ = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'tu zona').replace(/_/g, ' ');
  var dayKey = function (date) { return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); };
  var upper = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var fmtDay = function (date) { return date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var fmtTime = function (date) { return date.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' }); };

  // Horarios generales y los del closer prioritario (admin@getforth.ai), cada uno se pide una
  // sola vez y antes de que la persona termine el formulario. force: saltar el caché (409).
  var slotsReq = {}, prioritySlots = false;
  function loadSlots(force, prio) {
    var key = prio ? 'p' : 'g';
    if (slotsReq[key] && !force) return slotsReq[key];
    var qs = [prio ? 'p=1' : '', force ? 't=' + Date.now() : ''].filter(Boolean).join('&');
    var req = fetch('/api/aprende-agenda' + (qs ? '?' + qs : ''))
      .then(function (r) { if (!r.ok) throw new Error('slots'); return r.json(); })
      .then(function (r) { return r.slots || []; });
    slotsReq[key] = req;
    req.catch(function () { if (slotsReq[key] === req) delete slotsReq[key]; });
    return req;
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
    prioritySlots = prio;
    cal.classList.remove('is-locked'); cal.classList.add('is-loading'); $('[data-cal-loading]').hidden = false;
    if (w.matchMedia('(max-width: 900px)').matches) cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    loadSlots(false, prio).catch(function () { return loadSlots(true, prio); }).then(renderSlots, function () {
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
    button.disabled = true; button.textContent = 'Confirmando tu llamada…'; showError('');
    // Primero tiene que quedar guardada la calificación (normalmente ya terminó).
    // Si no se pudo guardar (sin conexión), se reintenta aquí.
    qualifyReq = (qualifyReq || Promise.resolve()).catch(function () { return retryQualify(); });
    qualifyReq.catch(function () {})
      .then(function () { return post('/api/aprende-agenda', withContact({ inicio: selectedSlot, event_id: id })); })
      .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
      .then(function (r) {
        if (r.status === 409) {
          selectedSlot = '';
          showError('Ese horario se acaba de ocupar. Elige otro, por favor.');
          return loadSlots(true, prioritySlots).then(renderSlots);
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

})();
