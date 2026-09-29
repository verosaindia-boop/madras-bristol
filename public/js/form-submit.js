(function () {
  const form = document.getElementById('contact-form2');
  if (!form) return;

  const status = form.querySelector('.messages');
  const button = form.querySelector('[type="submit"]');
  if (status) status.setAttribute('role', 'status');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    if (status) status.textContent = 'Sending your request…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Your request could not be sent. Please call us instead.');
      if (status) status.textContent = result.message;
      form.reset();
    } catch (error) {
      if (status) status.textContent = error.message || 'Your request could not be sent. Please call us instead.';
    } finally {
      button.disabled = false;
    }
  });
}());
