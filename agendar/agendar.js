/* /agendar/?t=<token>: el lead llega con su link personal (lo manda el agente de WhatsApp) y elige
   día y hora sin volver a llenar datos. El token lo verifica /api/aprende-agenda, que agenda igual
   que desde /aprende (mismos horarios, closer, correos y evento Schedule de Meta). El calendario
   es el de aprende/lead-form.js. */
(function () {
  var d = document, w = window;
  var token = new URLSearchParams(location.search).get('t') || '';
  var cal = d.getElementById('cal');
  var $ = function (sel) { return cal.querySelector(sel); };
  var byDay = {}, monthCursor = null, firstMonth = null, lastMonth = null, selectedDay = '', selectedSlot = '', booking = false;
  var TZ = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'tu zona').replace(/_/g, ' ');
  var dayKey = function (date) { return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); };
  var upper = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var fmtDay = function (date) { return date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var fmtTime = function (date) { return date.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' }); };

  function cookie(name) {
    var m = d.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function fbc() {
    var c = cookie('_fbc');
    if (c) return c;
    var id = new URLSearchParams(location.search).get('fbclid');
    return id ? 'fb.1.' + Date.now() + '.' + id : '';
  }
  function showBadLink() { cal.hidden = true; d.getElementById('badLink').hidden = false; }

  // Solo se revisa la forma aquí; la firma la valida el servidor al agendar.
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{22}$/.test(token)) return showBadLink();

  function loadSlots(force) {
    return fetch('/api/aprende-agenda' + (force ? '?t=' + Date.now() : ''))
      .then(function (r) { if (!r.ok) throw new Error('slots'); return r.json(); })
      .then(function (r) { return r.slots || []; });
  }

  $('[data-tz]').textContent = TZ;
  monthCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  firstMonth = lastMonth = monthCursor;
  renderMonth();
  loadSlots().catch(function () { return loadSlots(true); }).then(renderSlots, function () {
    showError('No pudimos cargar los horarios. Recarga la página o respóndenos por WhatsApp para agendar.');
  });

  function renderSlots(slots) {
    cal.classList.remove('is-loading'); $('[data-cal-loading]').hidden = true;
    byDay = {};
    slots.forEach(function (iso) { var t = new Date(iso); (byDay[dayKey(t)] = byDay[dayKey(t)] || []).push(t); });
    var days = Object.keys(byDay).sort();
    if (!days.length) {
      cal.querySelector('.cal__grid').hidden = true;
      return showError('En este momento no hay horarios libres en los próximos días. Respóndenos por WhatsApp y te ayudamos a agendar.');
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
    $('[data-confirm]').hidden = !selectedSlot;
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
    var button = $('[data-book]'), label = button.textContent;
    var id = 'schedule-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    button.disabled = true; button.textContent = 'Confirmando tu llamada…'; showError('');
    fetch('/api/aprende-agenda', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ t: token, inicio: selectedSlot, event_id: id, source_url: location.href.split('#')[0], fbp: cookie('_fbp'), fbc: fbc() })
    })
      .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
      .then(function (r) {
        if (r.status === 409) {
          selectedSlot = '';
          showError('Ese horario se acaba de ocupar. Elige otro, por favor.');
          return loadSlots(true).then(renderSlots);
        }
        if (r.body.error === 'link' || r.body.error === 'no_lead') return showBadLink();
        if (!r.body.ok) throw new Error('book');
        if (!r.body.ya_agendado && w.fbq) w.fbq('track', 'Schedule', { content_name: 'agendar' }, { eventID: id });
        done(r.body);
      })
      .catch(function () { showError('No pudimos confirmar tu llamada. Inténtalo de nuevo en unos segundos.'); })
      .then(function () { booking = false; button.disabled = false; button.textContent = label; });
  });

  function done(body) {
    var start = new Date(body.cita.inicio), panel = d.getElementById('done');
    var name = String(body.nombre || '').trim().split(/\s+/)[0];
    panel.querySelector('[data-done-title]').textContent = body.ya_agendado
      ? 'Ya tienes tu llamada agendada' + (name ? ', ' + name : '')
      : '¡Listo' + (name ? ', ' + name : '') + '! Tu llamada quedó agendada';
    panel.querySelector('[data-when]').textContent = fmtDay(start) + ' · ' + fmtTime(start) + ' (' + TZ + ')';
    var meet = panel.querySelector('[data-meet]');
    if (body.cita.meet) { meet.href = body.cita.meet; meet.hidden = false; }
    cal.hidden = true; panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
