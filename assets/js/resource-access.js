(function () {
  'use strict';
  var form = document.getElementById('resource-access-form');
  if (!form) return;
  var resource = form.elements.resource ? form.elements.resource.value : 'claude-productivity';
  if (['stanford-ai-index-2026', 'video-explicativo-hyperframes', 'alternativa-adobe-craft', 'roast-room', 'mods-claude-code', 'obscura-claude-code', 'chatgpt-dots', '5-trucos-ocultos-claude', 'claude-maquina-de-leads', 'sales-coach-assistant', 'everything-claude-code', 'skillspector', 'claude-productivity', 'claude-for-legal', 'google-skills-claude', 'linkedin-skills', 'claude-human-resources', 'higgsfield-codex-cli', 'claude-code-codex-plugin', 'fable-orquesta-codex-ejecuta', 'instagram-agent-skill-claude', 'la-maquina-de-uno'].indexOf(resource) === -1) return;
  // ManyChat puede marcar el link con ?utm_content=<reel> para saber qué contenido trajo al lead.
  function utmFromLink() {
    var utm = {};
    try {
      var q = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k); });
    } catch (_) {}
    return utm;
  }
  var button = form.querySelector('button[type="submit"]');
  var label = button.querySelector('.btn__t');
  var idleLabel = label.textContent;
  var status = document.getElementById('access-status');
  var pending = false;

  // Keep keyboard focus inside the required form. Background links are inert.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var fields = Array.prototype.slice.call(form.querySelectorAll('input:not([type="hidden"]), button:not(:disabled)'));
    var first = fields[0], last = fields[fields.length - 1];
    if (event.shiftKey && (document.activeElement === first || !form.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !form.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });

  form.addEventListener('input', function (event) {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    status.textContent = '';
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (pending) return;
    var nombre = form.elements.nombre.value.trim();
    var email = form.elements.email.value.trim();
    var telefono = form.elements.telefono.value.trim();
    var digits = telefono.replace(/\D/g, '');
    form.elements.nombre.setCustomValidity(nombre.length >= 2 && !/^[=+@-]/.test(nombre) ? '' : 'Escribe tu nombre.');
    form.elements.email.setCustomValidity(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !/^[=+@-]/.test(email) ? '' : 'Escribe un email válido.');
    form.elements.telefono.setCustomValidity(/^[+\d\s().-]+$/.test(telefono) && digits.length >= 7 && digits.length <= 15 ? '' : 'Escribe un celular válido con el indicativo de tu país.');
    if (!form.reportValidity()) return;
    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Guardando tus datos…';
    status.textContent = '';
    try {
      var response = await fetch('/api/resource-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, email: email, telefono: telefono, resource: resource, utm: utmFromLink() })
      });
      var result = await response.json();
      if (!response.ok || result.ok !== true) {
        var failure = new Error('Submission failed');
        failure.code = result.code;
        throw failure;
      }
      // This flag only suppresses the existing optional popup after registration.
      // It never skips the required form when opening the ManyChat link again.
      try { localStorage.setItem('lm_lead_captured', '1'); } catch (_) {}
      window.location.replace('/recursos/' + resource + '/');
    } catch (error) {
      status.textContent = error.code === 'collector_timeout'
        ? 'El registro está tardando más de lo esperado. Inténtalo de nuevo en unos segundos.'
        : 'No pudimos confirmar el registro. Inténtalo de nuevo en unos segundos.';
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = idleLabel;
    }
  });
})();
