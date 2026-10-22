/* /aprende — formulario de calificación del pop-up.
   Calificado: Lead (pixel + API de Conversiones, mismo event_id) -> Sheets -> calendario.
   No calificado: LeadNoCalificado -> mensaje con la comunidad. Sin calendario ni Sheets. */
(function () {
  'use strict';
  var d = document, w = window;
  var form = d.getElementById('leadForm');
  if (!form || !w.aprendeQualify) return;
  var Q = w.aprendeQualify.QUESTIONS, qualify = w.aprendeQualify.qualify;
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

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
  var current = 0, sending = false;

  function show(index) {
    current = index;
    steps.forEach(function (step, i) { step.classList.toggle('is-current', i === index); step.classList.remove('is-invalid'); });
    count.textContent = 'Paso ' + (index + 1) + ' de ' + steps.length;
    bar.style.width = ((index + 1) / steps.length * 100) + '%';
    back.hidden = index === 0;
    var field = steps[index].querySelector('input:checked, textarea, input:not([type="radio"]):not(.lf__hp), input');
    if (field && form.closest('.active')) field.focus({ preventScroll: true });
  }
  function invalid(step) { step.classList.add('is-invalid'); return false; }

  form.addEventListener('change', function (e) {
    if (e.target.type !== 'radio') return;
    setTimeout(function () { show(current + 1); }, 220);
  });
  form.querySelector('[data-next]').addEventListener('click', function () {
    var step = steps[current];
    if (form.elements.reto.value.trim().length < 3) return invalid(step);
    show(current + 1);
  });
  back.addEventListener('click', function () { if (current > 0 && !sending) show(current - 1); });
  form.addEventListener('input', function () { steps[current].classList.remove('is-invalid'); });
  d.querySelectorAll('[data-open-waitlist]').forEach(function (el) { el.addEventListener('click', function () { setTimeout(function () { show(current); }, 50); }); });

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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var step = steps[current];
    var el = form.elements;
    var data = {
      nombre: el.nombre.value.trim(), email: el.email.value.trim(), telefono: el.telefono.value.trim(), pais: el.pais.value,
      aplica: (form.querySelector('input[name="aplica"]:checked') || {}).value,
      inicio: (form.querySelector('input[name="inicio"]:checked') || {}).value,
      inversion: (form.querySelector('input[name="inversion"]:checked') || {}).value,
      reto: el.reto.value.trim(), website: el.website.value
    };
    var digits = data.telefono.replace(/\D/g, '');
    if (data.nombre.length < 2 || /^[=+@-]/.test(data.nombre) || !EMAIL_RE.test(data.email) ||
        !/^[+\d\s().-]+$/.test(data.telefono) || digits.length < 6 || digits.length > 15) return invalid(step);
    // Si falta una respuesta (no debería pasar), vuelve a esa pregunta.
    var missing = ['aplica', 'inicio', 'inversion'].findIndex(function (k) { return !data[k]; });
    if (missing !== -1) return show(missing);

    sending = true;
    data.event_id = 'lead-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    data.source_url = location.href.split('#')[0];
    data.fbp = cookie('_fbp'); data.fbc = fbc(); data.utm = utm;
    steps.forEach(function (s) { s.classList.remove('is-current'); });
    back.hidden = true; wait.hidden = false;

    var qualified = qualify(data);
    if (typeof w.fbq === 'function' && !data.website) {
      try {
        if (qualified) w.fbq('track', 'Lead', { content_name: 'aprende', lead_status: 'calificado' }, { eventID: data.event_id });
        else w.fbq('trackCustom', 'LeadNoCalificado', { content_name: 'aprende', lead_status: 'no_calificado' }, { eventID: data.event_id });
      } catch (err) {}
    }

    var finished = false;
    function finish(serverQualified) {
      if (finished) return; finished = true;
      if (typeof serverQualified === 'boolean') qualified = serverQualified;
      if (qualified) {
        try { sessionStorage.setItem('ap_lead', JSON.stringify({ nombre: data.nombre, email: data.email, telefono: data.telefono })); } catch (err) {}
        location.href = '/aprende/gracias.html';
        return;
      }
      wait.hidden = true; form.hidden = true;
      var notFit = d.getElementById('lfNotFit');
      notFit.querySelector('[data-name]').textContent = data.nombre.split(' ')[0];
      notFit.hidden = false;
    }
    // Si el servidor tarda (arranque en frío de Sheets), la persona sigue con la regla local.
    setTimeout(finish, 9000);
    fetch('/api/aprende-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), keepalive: true })
      .then(function (r) { return r.json(); })
      .then(function (r) { finish(r && r.ok ? r.qualified : undefined); })
      .catch(function () { finish(); });
  });

  show(0);
})();
