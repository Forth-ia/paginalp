/* /admin — agenda de llamadas. Lee y marca leads vía /api/admin (sesión por cookie). */
(function () {
  'use strict';
  var d = document;
  var $ = function (id) { return d.getElementById(id); };
  var TZ = 'America/Bogota';
  var leads = [], tab = 'proximas', query = '', busy = {};

  var TABS = [
    ['proximas', 'Próximas'], ['marcar', 'Por marcar'], ['sinagendar', 'Sin agendar'], ['historial', 'Todas las citas']
  ];

  function api(action, body) {
    return fetch('/api/admin?a=' + action, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {})
      .then(function (r) { return r.json().then(function (b) { b.status = r.status; return b; }); });
  }
  function esc(s) { var el = d.createElement('div'); el.textContent = s == null ? '' : String(s); return el.innerHTML; }
  function toast(text) { var t = $('toast'); t.textContent = text; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2600); }
  var fmtDay = function (iso) { return new Date(iso).toLocaleDateString('es', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }); };
  var fmtTime = function (iso) { return new Date(iso).toLocaleTimeString('es', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }); };
  var dayOf = function (iso) { return new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ }); };

  function showLogin() { $('app').hidden = true; $('login').hidden = false; }
  function showApp(user) {
    $('login').hidden = true; $('app').hidden = false;
    $('who').innerHTML = esc(user.nombre) + '<span class="who__email"> · ' + esc(user.email) + '</span>';
    load();
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
  $('reload').addEventListener('click', load);
  $('search').addEventListener('input', function (e) { query = e.target.value.trim().toLowerCase(); render(); });

  function load() {
    $('list').innerHTML = '<p class="empty">Cargando…</p>';
    api('list').then(function (r) {
      if (r.status === 401) return showLogin();
      if (!r.ok) { $('list').innerHTML = '<p class="empty">No se pudo cargar la agenda. Intenta de nuevo.</p>'; return; }
      leads = r.leads; render();
    });
  }

  function groups() {
    var now = Date.now();
    var withCita = leads.filter(function (l) { return l.cita_inicio; });
    return {
      proximas: withCita.filter(function (l) { return new Date(l.cita_inicio).getTime() + 30 * 60000 > now; })
        .sort(function (a, b) { return a.cita_inicio < b.cita_inicio ? -1 : 1; }),
      marcar: withCita.filter(function (l) {
        return new Date(l.cita_inicio).getTime() + 30 * 60000 <= now && (!l.asistencia || (l.asistencia === 'Show' && !l.venta));
      }).sort(function (a, b) { return a.cita_inicio > b.cita_inicio ? -1 : 1; }),
      sinagendar: leads.filter(function (l) { return !l.cita_inicio && l.calificado === 'Sí'; }),
      historial: withCita.slice().sort(function (a, b) { return a.cita_inicio > b.cita_inicio ? -1 : 1; })
    };
  }

  function render() {
    var g = groups();
    var shows = leads.filter(function (l) { return l.asistencia === 'Show'; }).length;
    var ventas = leads.filter(function (l) { return l.venta === 'Venta'; });
    var porMoneda = {};
    ventas.forEach(function (l) { porMoneda[l.moneda || 'USD'] = (porMoneda[l.moneda || 'USD'] || 0) + Number(l.valor || 0); });
    var total = Object.keys(porMoneda).map(function (m) { return m + ' ' + porMoneda[m].toLocaleString('es'); }).join(' · ') || '—';
    $('stats').innerHTML = [
      [g.proximas.length, 'Próximas llamadas'], [g.marcar.length, 'Por marcar'], [shows, 'Shows'], [ventas.length + ' · ' + total, 'Ventas']
    ].map(function (s) { return '<div class="stat"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('');
    $('tabs').innerHTML = TABS.map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t[0] + '" class="' + (t[0] === tab ? 'is-on' : '') + '" aria-selected="' + (t[0] === tab) + '">' + t[1] + '<i>' + g[t[0]].length + '</i></button>';
    }).join('');

    var rows = g[tab].filter(function (l) {
      return !query || [l.nombre, l.email, l.telefono].join(' ').toLowerCase().indexOf(query) !== -1;
    });
    if (!rows.length) { $('list').innerHTML = '<p class="empty">No hay leads aquí.</p>'; return; }
    var html = '', lastDay = '';
    rows.forEach(function (l) {
      if (tab === 'proximas' && dayOf(l.cita_inicio) !== lastDay) {
        lastDay = dayOf(l.cita_inicio);
        var label = fmtDay(l.cita_inicio);
        html += '<p class="day">' + esc(label.charAt(0).toUpperCase() + label.slice(1)) + '</p>';
      }
      html += card(l);
    });
    $('list').innerHTML = html;
  }

  function chip(l) {
    var map = { 'Venta': 'ok', 'Show': 'ok', 'Agendado': 'accent', 'No show': 'bad', 'No venta': 'bad' };
    return '<span class="chip chip--' + (map[l.estado] || '') + '">' + esc(l.estado || '—') + '</span>';
  }

  function card(l) {
    var wa = String(l.telefono || '').replace(/\D/g, '');
    var time = l.cita_inicio
      ? '<b>' + esc(fmtTime(l.cita_inicio)) + '</b><small>' + esc(tab === 'proximas' ? '' : new Date(l.cita_inicio).toLocaleDateString('es', { timeZone: TZ, day: 'numeric', month: 'short' })) + '</small>'
      : '<small>Sin cita</small>';
    var pending = busy[l.email] ? ' disabled' : '';
    var actions = l.cita_inicio ? (
      '<div class="seg" role="group" aria-label="Asistencia">' +
        '<button type="button" data-act="Show" data-email="' + esc(l.email) + '" class="' + (l.asistencia === 'Show' ? 'is-ok' : '') + '"' + pending + '>Show</button>' +
        '<button type="button" data-act="No show" data-email="' + esc(l.email) + '" class="' + (l.asistencia === 'No show' ? 'is-bad' : '') + '"' + pending + '>No show</button>' +
      '</div>' +
      (l.asistencia === 'Show' ? (
        '<div class="sale">' +
          '<input type="number" min="1" step="1" placeholder="Valor" value="' + esc(l.valor) + '" data-valor="' + esc(l.email) + '" aria-label="Valor de la venta">' +
          '<select data-moneda="' + esc(l.email) + '" aria-label="Moneda"><option' + (l.moneda !== 'COP' ? ' selected' : '') + '>USD</option><option' + (l.moneda === 'COP' ? ' selected' : '') + '>COP</option></select>' +
          '<button type="button" class="btn" data-act="Venta" data-email="' + esc(l.email) + '"' + pending + '>Venta</button>' +
          '<button type="button" class="btn btn--ghost" data-act="No venta" data-email="' + esc(l.email) + '"' + pending + '>No venta</button>' +
        '</div>') : '') +
      (l.eventos_meta ? '<span class="meta">Meta: ' + esc(l.eventos_meta) + '</span>' : '')
    ) : '<span class="meta">Calificado sin agendar' + (l.eventos_meta ? ' · Meta: ' + esc(l.eventos_meta) : '') + '</span>';
    return '<article class="card">' +
      '<div class="card__time">' + time + '</div>' +
      '<div><div class="card__name">' + esc(l.nombre) + chip(l) + '</div>' +
        '<div class="card__meta"><span>' + esc(l.email) + '</span>' +
          (wa ? '<a href="https://wa.me/' + esc(waNumber(l)) + '" target="_blank" rel="noopener">WhatsApp ' + esc(l.telefono) + '</a>' : '') +
          (l.closer ? '<span>Closer: ' + esc(l.closer) + '</span>' : '') +
          (l.meet ? '<a href="' + esc(l.meet) + '" target="_blank" rel="noopener">Google Meet</a>' : '') +
          (l.venta === 'Venta' ? '<span><b>' + esc(l.moneda + ' ' + Number(l.valor).toLocaleString('es')) + '</b></span>' : '') +
        '</div>' +
        '<details><summary>Respuestas</summary><dl>' +
          '<dt>Dónde aplicará IA</dt><dd>' + esc(l.aplica) + '</dd>' +
          '<dt>Cuándo empieza</dt><dd>' + esc(l.inicio) + '</dd>' +
          '<dt>Inversión</dt><dd>' + esc(l.inversion) + '</dd>' +
          '<dt>Reto</dt><dd>' + esc(l.reto) + '</dd>' +
          '<dt>Campaña</dt><dd>' + esc([l.utm_source, l.utm_campaign, l.utm_content].filter(Boolean).join(' · ') || '—') + '</dd>' +
          (l.marcado_por ? '<dt>Marcado por</dt><dd>' + esc(l.marcado_por) + '</dd>' : '') +
        '</dl></details></div>' +
      '<div class="actions">' + actions + '</div>' +
    '</article>';
  }

  // wa.me necesita el indicativo: el Sheets guarda el número sin él.
  var DIAL = { 'Colombia': '57', 'México': '52', 'Argentina': '54', 'Chile': '56', 'Perú': '51', 'Ecuador': '593', 'Venezuela': '58', 'Uruguay': '598',
    'Paraguay': '595', 'Bolivia': '591', 'Costa Rica': '506', 'Panamá': '507', 'Guatemala': '502', 'El Salvador': '503', 'Honduras': '504',
    'Nicaragua': '505', 'República Dominicana': '1', 'Puerto Rico': '1', 'España': '34', 'Estados Unidos': '1' };
  function waNumber(l) { return (DIAL[l.pais] || '') + String(l.telefono).replace(/\D/g, ''); }

  d.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]');
    if (t) { tab = t.getAttribute('data-tab'); render(); return; }
    var b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var email = b.getAttribute('data-email'), act = b.getAttribute('data-act'), body = { email: email };
    if (act === 'Show' || act === 'No show') body.asistencia = act;
    else {
      body.venta = act;
      if (act === 'Venta') {
        body.valor = Number(d.querySelector('[data-valor="' + CSS.escape(email) + '"]').value);
        body.moneda = d.querySelector('[data-moneda="' + CSS.escape(email) + '"]').value;
        if (!(body.valor > 0)) { toast('Escribe el valor de la venta.'); return; }
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
  });

  api('me').then(function (r) { if (r.ok) showApp(r.user); else showLogin(); }, showLogin);
})();
