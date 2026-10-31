/* /admin — agenda de llamadas en vista de semana o día (estilo Google Calendar).
   Lee y marca leads vía /api/admin (sesión por cookie). Todo en hora Colombia. */
(function () {
  'use strict';
  var d = document;
  var $ = function (id) { return d.getElementById(id); };
  var HOUR = 3600000, DAY = 24 * HOUR, OFFSET = -5 * HOUR; // Colombia no tiene horario de verano
  var START = 7, END = 20; // horas visibles en el calendario
  var CALL_MIN = 30;
  var CLOSERS = { 'admin@getforth.ai': { nombre: 'Luciano', c: 'c1' }, 'info@getforth.ai': { nombre: 'Andrea', c: 'c2' } };
  var DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var FULL_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  var leads = [], busy = {}, hidden = {}, query = '', selected = '', sideTab = 'marcar';
  var view = matchMedia('(max-width: 700px)').matches ? 'day' : 'week';
  var anchor = dayKey(Date.now()), miniMonth = anchor.slice(0, 7);

  /* ---------- utilidades ---------- */
  function api(action, body) {
    return fetch('/api/admin?a=' + action, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {})
      .then(function (r) { return r.json().then(function (b) { b.status = r.status; return b; }); });
  }
  function esc(s) { var el = d.createElement('div'); el.textContent = s == null ? '' : String(s); return el.innerHTML; }
  function toast(text) { var t = $('toast'); t.textContent = text; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2600); }
  // Fecha "de pared" en Colombia: se leen los getters UTC de la hora corrida.
  function bog(ms) { return new Date(ms + OFFSET); }
  function dayKey(ms) { return bog(ms).toISOString().slice(0, 10); }
  function keyToMs(key) { return Date.parse(key + 'T00:00:00Z') - OFFSET; } // medianoche Colombia
  function addDays(key, n) { return new Date(Date.parse(key + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10); }
  function dow(key) { return new Date(key + 'T00:00:00Z').getUTCDay(); }
  function fmtTime(ms) { var t = bog(ms), h = t.getUTCHours(), m = t.getUTCMinutes(); return (h % 12 || 12) + ':' + ('0' + m).slice(-2) + (h < 12 ? ' a. m.' : ' p. m.'); }
  function fmtShort(ms) { var t = bog(ms), h = t.getUTCHours(), m = t.getUTCMinutes(); return (h % 12 || 12) + (m ? ':' + ('0' + m).slice(-2) : '') + (h < 12 ? 'am' : 'pm'); }
  function fmtDate(key) { var t = new Date(key + 'T00:00:00Z'); return DOW[t.getUTCDay()] + ' ' + t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()]; }
  function startMs(l) { return l.cita_inicio ? new Date(l.cita_inicio).getTime() : NaN; }
  function closerOf(l) { return CLOSERS[l.closer] || { nombre: l.closer || 'Sin closer', c: 'c0' }; }
  function needsMark(l) { return startMs(l) + CALL_MIN * 60000 <= Date.now() && (!l.asistencia || (l.asistencia === 'Show' && !l.venta)); }
  function matches(l) { return !query || [l.nombre, l.email, l.telefono].join(' ').toLowerCase().indexOf(query) !== -1; }
  function byEmail(email) { return leads.filter(function (l) { return l.email === email; })[0]; }
  // wa.me necesita el indicativo: el Sheets guarda el número sin él.
  var DIAL = { 'Colombia': '57', 'México': '52', 'Argentina': '54', 'Chile': '56', 'Perú': '51', 'Ecuador': '593', 'Venezuela': '58', 'Uruguay': '598',
    'Paraguay': '595', 'Bolivia': '591', 'Costa Rica': '506', 'Panamá': '507', 'Guatemala': '502', 'El Salvador': '503', 'Honduras': '504',
    'Nicaragua': '505', 'República Dominicana': '1', 'Puerto Rico': '1', 'España': '34', 'Estados Unidos': '1' };
  function waNumber(l) { return (DIAL[l.pais] || '') + String(l.telefono).replace(/\D/g, ''); }

  /* ---------- sesión ---------- */
  function showLogin() { $('app').hidden = true; $('overlay').hidden = true; $('login').hidden = false; }
  function showApp(user) {
    $('login').hidden = true; $('app').hidden = false;
    $('who').textContent = user.nombre;
    load(true);
  }
  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    $('loginErr').hidden = true;
    api('login', { email: f.email.value, password: f.password.value }).then(function (r) {
      if (!r.ok) { $('loginErr').hidden = false; return; }
      f.password.value = ''; showApp(r.user);
    });
  });
  $('logout').addEventListener('click', function () { api('logout', {}).then(showLogin); });

  function load(scrollToNow) {
    if (!leads.length) $('grid').innerHTML = '<div class="loading">Cargando agenda…</div>';
    api('list').then(function (r) {
      if (r.status === 401) return showLogin();
      if (!r.ok) { toast('No se pudo cargar la agenda. Intenta de nuevo.'); return; }
      leads = r.leads; render();
      if (scrollToNow) scrollNow();
    }, function () { toast('Sin conexión. Intenta de nuevo.'); });
  }
  // Se actualiza sola cada 5 minutos (citas nuevas, cancelaciones).
  setInterval(function () { if (!$('app').hidden && d.visibilityState === 'visible') load(); }, 5 * 60000);

  /* ---------- navegación ---------- */
  function visibleDays() {
    if (view === 'day') return [anchor];
    var monday = addDays(anchor, -((dow(anchor) + 6) % 7)), days = [];
    for (var i = 0; i < 7; i++) days.push(addDays(monday, i));
    // Fin de semana solo si ese fin de semana hay citas.
    return days.filter(function (k, i) {
      return i < 5 || leads.some(function (l) { return l.cita_inicio && dayKey(startMs(l)) === k; });
    });
  }
  $('today').addEventListener('click', function () { anchor = dayKey(Date.now()); miniMonth = anchor.slice(0, 7); render(); scrollNow(); });
  $('prev').addEventListener('click', function () { anchor = addDays(anchor, view === 'day' ? -1 : -7); if (view === 'day') anchor = skipWeekend(anchor, -1); miniMonth = anchor.slice(0, 7); render(); });
  $('next').addEventListener('click', function () { anchor = addDays(anchor, view === 'day' ? 1 : 7); if (view === 'day') anchor = skipWeekend(anchor, 1); miniMonth = anchor.slice(0, 7); render(); });
  function skipWeekend(key, step) {
    while ((dow(key) === 0 || dow(key) === 6) && !leads.some(function (l) { return l.cita_inicio && dayKey(startMs(l)) === key; })) key = addDays(key, step);
    return key;
  }
  $('views').addEventListener('click', function (e) {
    var b = e.target.closest('[data-view]');
    if (!b) return;
    view = b.getAttribute('data-view'); render();
  });
  $('search').addEventListener('input', function (e) { query = e.target.value.trim().toLowerCase(); render(); });
  $('reload').addEventListener('click', function () { load(); });
  $('openSide').addEventListener('click', function () { $('side').classList.toggle('is-open'); });
  function scrollNow() {
    var h = bog(Date.now()).getUTCHours();
    var slot = parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--slot')) || 44;
    $('scroll').scrollTop = Math.max(0, (Math.min(Math.max(h, START), END) - START - 1) * slot * 2);
  }

  /* ---------- render ---------- */
  function render() {
    renderTop(); renderMini(); renderCalendar(); renderSide();
    if (selected) renderDetail();
  }

  function renderTop() {
    var days = visibleDays(), a = days[0], b = days[days.length - 1];
    var ta = new Date(a + 'T00:00:00Z'), tb = new Date(b + 'T00:00:00Z');
    $('range').textContent = view === 'day' ? fmtDate(a) + ' ' + ta.getUTCFullYear()
      : ta.getUTCDate() + (ta.getUTCMonth() !== tb.getUTCMonth() ? ' ' + MONTHS[ta.getUTCMonth()] : '') + ' – ' + tb.getUTCDate() + ' ' + MONTHS[tb.getUTCMonth()] + ' ' + tb.getUTCFullYear();
    d.querySelectorAll('#views [data-view]').forEach(function (x) { x.classList.toggle('is-on', x.getAttribute('data-view') === view); });
    $('closers').innerHTML = Object.keys(CLOSERS).map(function (email) {
      var c = CLOSERS[email];
      return '<label style="--c:var(--' + c.c + ')"><input type="checkbox" data-closer="' + esc(email) + '"' + (hidden[email] ? '' : ' checked') + '>' + esc(c.nombre) + '</label>';
    }).join('');
  }

  // Mini calendario del mes (como el de Google Calendar): punto = días con llamadas.
  function renderMini() {
    var first = miniMonth + '-01', t = new Date(first + 'T00:00:00Z');
    var start = addDays(first, -((dow(first) + 6) % 7)), today = dayKey(Date.now()), week = visibleDays();
    var withCalls = {};
    leads.forEach(function (l) { if (l.cita_inicio && !hidden[l.closer]) withCalls[dayKey(startMs(l))] = true; });
    var html = '<div class="mini__head"><span>' + FULL_MONTHS[t.getUTCMonth()] + ' ' + t.getUTCFullYear() + '</span><span>' +
      '<button class="icon" type="button" data-mini="-1" aria-label="Mes anterior">&lsaquo;</button><button class="icon" type="button" data-mini="1" aria-label="Mes siguiente">&rsaquo;</button></span></div>' +
      '<div class="mini__grid">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (x) { return '<span>' + x + '</span>'; }).join('');
    for (var i = 0; i < 42; i++) {
      var k = addDays(start, i);
      var cls = (k.slice(0, 7) !== miniMonth ? ' is-out' : '') + (week.indexOf(k) !== -1 ? ' is-week' : '') + (k === today ? ' is-today' : '') + (withCalls[k] ? ' has' : '');
      html += '<button type="button" class="' + cls.trim() + '" data-go="' + k + '">' + Number(k.slice(8)) + '</button>';
    }
    $('mini').innerHTML = html + '</div>';
  }

  function renderCalendar() {
    var days = visibleDays(), today = dayKey(Date.now()), slot = 'var(--slot)';
    $('head').style.setProperty('--days', days.length);
    $('grid').style.setProperty('--days', days.length);
    $('head').innerHTML = '<div></div>' + days.map(function (k) {
      var t = new Date(k + 'T00:00:00Z');
      var n = leads.filter(function (l) { return l.cita_inicio && dayKey(startMs(l)) === k && !hidden[l.closer]; }).length;
      return '<div class="' + (k === today ? 'is-today' : '') + '"><small>' + DOW[t.getUTCDay()] + '</small><b>' + t.getUTCDate() + '</b><i>' + (n ? n + (n === 1 ? ' llamada' : ' llamadas') : '') + '</i></div>';
    }).join('');

    var hours = '<div class="hours">';
    for (var h = START; h < END; h++) hours += '<div>' + (h % 12 || 12) + (h < 12 ? ' am' : ' pm') + '</div>';
    hours += '</div>';
    var height = 'calc(' + slot + ' * ' + ((END - START) * 2) + ')';
    var cols = days.map(function (k) {
      var base = keyToMs(k) + START * HOUR;
      var evs = leads.filter(function (l) { return l.cita_inicio && dayKey(startMs(l)) === k && !hidden[l.closer]; })
        .sort(function (a, b) { return startMs(a) - startMs(b); });
      layout(evs);
      var html = '<div class="col' + (k === today ? ' is-today' : '') + '" style="height:' + height + '">';
      evs.forEach(function (l) {
        var top = Math.max(0, (startMs(l) - base) / (30 * 60000));
        var c = closerOf(l), pending = needsMark(l), past = startMs(l) + CALL_MIN * 60000 <= Date.now();
        var st = l.venta === 'Venta' ? '$' : l.asistencia === 'Show' ? '✓' : l.asistencia === 'No show' ? '✗' : pending ? '⚠' : '';
        var cls = 'ev ' + c.c + (past ? ' is-past' : '') + (pending ? ' is-pending' : '') + (l.asistencia === 'No show' ? ' is-noshow' : '') + (l.email === selected ? ' is-sel' : '');
        var dim = matches(l) ? '' : 'opacity:.25;';
        html += '<button type="button" class="' + cls + '" data-open="' + esc(l.email) + '" style="' + dim + 'top:calc(' + slot + ' * ' + top + ' + 1px);height:calc(' + slot + ' * ' + (CALL_MIN / 30) + ' - 3px);' +
          'left:calc(' + (l._lane / l._lanes * 100) + '% + 2px);width:calc(' + (100 / l._lanes) + '% - 5px)" title="' + esc(l.nombre + ' · ' + fmtTime(startMs(l)) + ' · ' + c.nombre) + '">' +
          (st ? '<span class="st">' + st + '</span>' : '') +
          '<b>' + (l.prioridad === 'Alta' ? '🔥 ' : '') + esc(l.nombre) + '</b><span>, ' + esc(fmtShort(startMs(l))) + '</span></button>';
      });
      if (k === today) {
        var now = (Date.now() - base) / (30 * 60000);
        if (now >= 0 && now <= (END - START) * 2) html += '<div class="now" style="top:calc(' + slot + ' * ' + now + ')"></div>';
      }
      return html + '</div>';
    }).join('');
    $('grid').innerHTML = hours + cols;
  }

  // Citas que se cruzan van lado a lado, como en Google Calendar.
  function layout(evs) {
    var group = [], lanesEnd = [];
    function flush() { group.forEach(function (l) { l._lanes = lanesEnd.length; }); group = []; lanesEnd = []; }
    evs.forEach(function (l) {
      var s = startMs(l), e = s + CALL_MIN * 60000;
      if (group.length && lanesEnd.every(function (end) { return end <= s; })) flush();
      var lane = lanesEnd.findIndex(function (end) { return end <= s; });
      if (lane === -1) { lane = lanesEnd.length; lanesEnd.push(e); } else lanesEnd[lane] = e;
      l._lane = lane; group.push(l);
    });
    flush();
  }

  function groups() {
    var now = Date.now(), withCita = leads.filter(function (l) { return l.cita_inicio; });
    return {
      marcar: withCita.filter(needsMark).sort(function (a, b) { return startMs(b) - startMs(a); }),
      proximas: withCita.filter(function (l) { return startMs(l) + CALL_MIN * 60000 > now; }).sort(function (a, b) { return startMs(a) - startMs(b); }),
      sinagendar: leads.filter(function (l) { return !l.cita_inicio && l.calificado === 'Sí'; })
        .sort(function (a, b) { return (b.prioridad === 'Alta') - (a.prioridad === 'Alta') || (a.creado < b.creado ? 1 : -1); })
    };
  }

  function renderSide() {
    var g = groups(), today = dayKey(Date.now()), days = visibleDays();
    var hoy = leads.filter(function (l) { return l.cita_inicio && dayKey(startMs(l)) === today; }).length;
    var semana = leads.filter(function (l) { return l.cita_inicio && days.indexOf(dayKey(startMs(l))) !== -1; }).length;
    var conCita = leads.filter(function (l) { return l.cita_inicio && startMs(l) + CALL_MIN * 60000 <= Date.now() && l.asistencia; });
    var shows = conCita.filter(function (l) { return l.asistencia === 'Show'; }).length;
    var ventas = leads.filter(function (l) { return l.venta === 'Venta'; });
    var porMoneda = {};
    ventas.forEach(function (l) { porMoneda[l.moneda || 'USD'] = (porMoneda[l.moneda || 'USD'] || 0) + Number(l.valor || 0); });
    var total = Object.keys(porMoneda).map(function (m) { return m + ' ' + porMoneda[m].toLocaleString('es'); }).join(' · ');
    $('stats').innerHTML = [
      [hoy, 'Llamadas hoy'], [semana, view === 'day' ? 'Este día' : 'Esta semana'],
      [conCita.length ? Math.round(shows / conCita.length * 100) + '%' : '—', 'Show rate'], [g.marcar.length, 'Por marcar'],
      [ventas.length + (total ? ' · ' + total : ''), 'Ventas', true]
    ].map(function (s) { return '<div class="stat' + (s[2] ? ' stat--wide' : '') + '"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('');
    $('pendingN').textContent = g.marcar.length ? '(' + g.marcar.length + ')' : '';

    var tabs = query ? [['buscar', 'Resultados']] : [['marcar', 'Marcar'], ['proximas', 'Próximas'], ['sinagendar', 'Sin cita']];
    var current = query ? 'buscar' : sideTab;
    var lists = { marcar: g.marcar, proximas: g.proximas, sinagendar: g.sinagendar, buscar: leads.filter(matches) };
    $('tabs').innerHTML = tabs.map(function (t) {
      return '<button type="button" data-side="' + t[0] + '" class="' + (t[0] === current ? 'is-on' : '') + '">' + t[1] + '<i data-n="' + lists[t[0]].length + '">' + lists[t[0]].length + '</i></button>';
    }).join('');
    var rows = lists[current];
    var empty = { marcar: 'Todo marcado. ¡Bien!', proximas: 'No hay llamadas próximas.', sinagendar: 'No hay calificados sin cita.', buscar: 'Sin resultados.' };
    $('items').innerHTML = rows.length ? rows.slice(0, 200).map(function (l) {
      var c = closerOf(l), when = l.cita_inicio ? fmtDate(dayKey(startMs(l))) + ' · ' + fmtTime(startMs(l)) + ' · ' + c.nombre : 'Sin cita · ' + (l.telefono || l.email);
      var quick = needsMark(l) && !l.asistencia ? '<span class="quick">' +
        '<button type="button" data-quick="Show" data-email="' + esc(l.email) + '" title="Show" aria-label="Show: ' + esc(l.nombre) + '"' + (busy[l.email] ? ' disabled' : '') + '>✓</button>' +
        '<button type="button" data-quick="No show" data-email="' + esc(l.email) + '" title="No show" aria-label="No show: ' + esc(l.nombre) + '"' + (busy[l.email] ? ' disabled' : '') + '>✗</button></span>' : '';
      return '<div class="item ' + c.c + '" data-open="' + esc(l.email) + '" role="button" tabindex="0"><span class="dot"></span><span class="item__txt"><b>' + (l.prioridad === 'Alta' ? '🔥 ' : '') + esc(l.nombre) + '</b><small>' + esc(when) + '</small></span>' + quick + '</div>';
    }).join('') : '<p class="empty">' + empty[current] + '</p>';
  }

  /* ---------- detalle ---------- */
  function chips(l) {
    var map = { 'Venta': 'ok', 'Show': 'ok', 'Agendado': 'accent', 'No show': 'bad', 'No venta': 'bad' };
    return '<span class="chip chip--' + (map[l.estado] || '') + '">' + esc(l.estado || '—') + '</span>' +
      (l.prioridad === 'Alta' ? '<span class="chip chip--accent">🔥 Prioritario</span>' : '') +
      (l.venta === 'Venta' ? '<span class="chip chip--ok">' + esc(l.moneda + ' ' + Number(l.valor).toLocaleString('es')) + '</span>' : '');
  }

  function renderDetail() {
    var l = byEmail(selected), box = $('detail');
    if (!l) { $('overlay').hidden = true; selected = ''; return; }
    var c = closerOf(l), pending = busy[l.email] ? ' disabled' : '';
    var when = l.cita_inicio ? fmtDate(dayKey(startMs(l))) + ' · ' + fmtTime(startMs(l)) + ' – ' + fmtTime(startMs(l) + CALL_MIN * 60000) + ' · ' + c.nombre : 'Calificado, sin cita';
    var result = l.cita_inicio ? (
      '<div class="box"><h3>Resultado de la llamada</h3>' +
        '<div class="seg" role="group" aria-label="Asistencia">' +
          '<button type="button" data-act="Show" class="' + (l.asistencia === 'Show' ? 'is-ok' : '') + '"' + pending + '>✓ Show</button>' +
          '<button type="button" data-act="No show" class="' + (l.asistencia === 'No show' ? 'is-bad' : '') + '"' + pending + '>✗ No show</button>' +
        '</div>' +
        (l.asistencia === 'Show' ? (
          '<div class="sale">' +
            '<input type="number" min="1" step="1" placeholder="Valor de la venta" value="' + esc(l.valor) + '" id="valor" aria-label="Valor de la venta">' +
            '<select id="moneda" aria-label="Moneda"><option' + (l.moneda !== 'COP' ? ' selected' : '') + '>USD</option><option' + (l.moneda === 'COP' ? ' selected' : '') + '>COP</option></select>' +
            '<div class="btns"><button type="button" class="btn" data-act="Venta"' + pending + '>$ Venta</button>' +
            '<button type="button" class="btn btn--ghost" data-act="No venta"' + pending + '>No venta</button></div>' +
          '</div>') : '<p class="hint">Marca Show para registrar la venta.</p>') +
        (l.eventos_meta ? '<p class="hint">Meta: ' + esc(l.eventos_meta) + '</p>' : '') +
      '</div>') : '<p class="hint">Este lead calificó pero no agendó: escríbele por WhatsApp.</p>';
    box.className = 'detail ' + c.c;
    box.innerHTML =
      '<div class="detail__bar"><button class="icon" type="button" data-close aria-label="Cerrar">&times;</button></div>' +
      '<div class="detail__body">' +
        '<h2><span class="dot"></span>' + esc(l.nombre) + '</h2>' +
        '<p class="when">' + esc(when) + '</p>' +
        '<div class="chips">' + chips(l) + '</div>' +
        '<div class="links">' +
          (l.telefono ? '<a class="wa" href="https://wa.me/' + esc(waNumber(l)) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
          (l.meet ? '<a href="' + esc(l.meet) + '" target="_blank" rel="noopener">Google Meet</a>' : '') +
        '</div>' +
        result +
        '<div class="cols"><div class="box"><h3>Respuestas</h3><dl>' +
          '<dt>Dónde aplicará IA</dt><dd>' + esc(l.aplica || '—') + '</dd>' +
          '<dt>Cuándo empieza</dt><dd>' + esc(l.inicio || '—') + '</dd>' +
          '<dt>Inversión</dt><dd>' + esc(l.inversion || '—') + '</dd>' +
          '<dt>Reto</dt><dd>' + esc(l.reto || '—') + '</dd>' +
        '</dl></div>' +
        '<div class="box"><h3>Contacto y origen</h3><dl>' +
          '<dt>Email</dt><dd>' + esc(l.email) + '</dd>' +
          '<dt>WhatsApp</dt><dd>' + esc(l.telefono || '—') + (l.pais ? ' (' + esc(l.pais) + ')' : '') + '</dd>' +
          '<dt>Campaña</dt><dd>' + esc([l.utm_source, l.utm_campaign, l.utm_content].filter(Boolean).join(' · ') || '—') + '</dd>' +
          (l.marcado_por ? '<dt>Marcado por</dt><dd>' + esc(l.marcado_por) + '</dd>' : '') +
        '</dl></div></div>' +
      '</div>';
    $('overlay').hidden = false;
  }

  function open(email) {
    selected = email;
    var l = byEmail(email);
    // Desde la lista lateral, el calendario salta a la semana de esa cita.
    if (l && l.cita_inicio) { anchor = dayKey(startMs(l)); miniMonth = anchor.slice(0, 7); }
    $('side').classList.remove('is-open');
    render();
  }
  function close() { selected = ''; $('overlay').hidden = true; renderCalendar(); }

  d.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quick]');
    if (q) { if (!q.disabled) mark(q.getAttribute('data-quick'), q.getAttribute('data-email')); return; }
    if (e.target === $('overlay')) { close(); return; }
    var g = e.target.closest('[data-go]');
    if (g) { anchor = g.getAttribute('data-go'); miniMonth = anchor.slice(0, 7); render(); return; }
    var m = e.target.closest('[data-mini]');
    if (m) {
      var t = new Date(miniMonth + '-01T00:00:00Z');
      t.setUTCMonth(t.getUTCMonth() + Number(m.getAttribute('data-mini')));
      miniMonth = t.toISOString().slice(0, 7); renderMini(); return;
    }
    var o = e.target.closest('[data-open]');
    if (o) { open(o.getAttribute('data-open')); return; }
    var s = e.target.closest('[data-side]');
    if (s) { sideTab = s.getAttribute('data-side'); renderSide(); return; }
    if (e.target.closest('[data-close]')) { close(); return; }
    var b = e.target.closest('[data-act]');
    if (b && !b.disabled) mark(b.getAttribute('data-act'));
  });
  d.addEventListener('change', function (e) {
    var c = e.target.closest('[data-closer]');
    if (!c) return;
    if (c.checked) delete hidden[c.getAttribute('data-closer')]; else hidden[c.getAttribute('data-closer')] = true;
    renderCalendar(); renderSide();
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selected) close();
    var item = e.target.closest && e.target.closest('.item');
    if (item && (e.key === 'Enter' || e.key === ' ') && e.target === item) { e.preventDefault(); open(item.getAttribute('data-open')); return; }
    if (e.target.matches('input, select, textarea') || !$('login').hidden) return;
    if (e.key === 'ArrowLeft') $('prev').click();
    if (e.key === 'ArrowRight') $('next').click();
    if (e.key === 't') $('today').click();
  });

  function mark(act, email) {
    email = email || selected;
    var body = { email: email };
    if (act === 'Show' || act === 'No show') body.asistencia = act;
    else {
      body.venta = act;
      if (act === 'Venta') {
        body.valor = Number($('valor').value);
        body.moneda = $('moneda').value;
        if (!(body.valor > 0)) { toast('Escribe el valor de la venta.'); $('valor').focus(); return; }
        if (!confirm('¿Registrar venta de ' + body.moneda + ' ' + body.valor.toLocaleString('es') + '? Se enviará a Meta como compra.')) return;
      }
    }
    busy[email] = true; render();
    api('mark', body).then(function (r) {
      delete busy[email];
      if (r.status === 401) return showLogin();
      if (!r.ok) { toast('No se pudo guardar. Intenta de nuevo.'); render(); return; }
      leads = leads.map(function (l) { return l.email === email ? r.lead : l; });
      toast(r.meta === false ? 'Guardado, pero Meta no respondió. Se puede volver a marcar.' : 'Guardado' + (r.meta ? ' y enviado a Meta' : '') + '.');
      render();
    }, function () { delete busy[email]; toast('Sin conexión. Intenta de nuevo.'); render(); });
  }

  api('me').then(function (r) { if (r.ok) showApp(r.user); else showLogin(); }, showLogin);
})();
