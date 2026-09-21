(function () {
  'use strict';
  var form = document.getElementById('resource-access-form');
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var label = button.querySelector('.btn__t');
  var status = document.getElementById('access-status');
  var pending = false;

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
        body: JSON.stringify({ nombre: nombre, email: email, telefono: telefono })
      });
      var result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Submission failed');
      // This flag only suppresses the existing optional popup after registration.
      // It never skips the required form when opening the ManyChat link again.
      try { localStorage.setItem('lm_lead_captured', '1'); } catch (_) {}
      window.location.replace('/recursos/claude-productivity/');
    } catch (_) {
      status.textContent = 'No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo.';
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = 'Ver la guía gratis';
    }
  });
})();
