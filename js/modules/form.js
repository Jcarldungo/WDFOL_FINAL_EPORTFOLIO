/**
 * @module form
 * Handles contact form validation, submission simulation, and UI feedback.
 */

const FIELDS = [
  { id: 'cf-name', errId: 'cf-name-err', test: v => v.trim().length > 1 },
  { id: 'cf-email', errId: 'cf-email-err', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { id: 'cf-subject', errId: 'cf-subject-err', test: v => v.trim().length > 2 },
  { id: 'cf-message', errId: 'cf-message-err', test: v => v.trim().length >= 20 },
];

function validateField({ id, errId, test }) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el || !err) return true;

  const valid = test(el.value);
  el.classList.toggle('error', !valid);
  err.classList.toggle('visible', !valid);

  if (!valid) {
    el.setAttribute('aria-invalid', 'true');
  } else {
    el.removeAttribute('aria-invalid');
  }

  return valid;
}

function setLoading(btn) {
  const spinner = btn.querySelector('.spinner');
  const text    = btn.querySelector('.btn-text');
  if (spinner) spinner.style.display = 'block';
  if (text)    text.textContent = 'Sending…';
  btn.disabled = true;
  btn.classList.add('loading');
}

function showSuccess() {
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'none';
  if (success) success.style.display = 'block';
}

export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = FIELDS.map(validateField).every(Boolean);
    if (!allValid) return;

    const submitBtn = document.getElementById('submit-btn');
    setLoading(submitBtn);

    // 1. Manually package the values
    const templateParams = {
      from_name: document.getElementById('cf-name').value,
      from_email: document.getElementById('cf-email').value,
      subject: document.getElementById('cf-subject').value,
      message: document.getElementById('cf-message').value
    };

    // 2. Send via EmailJS SDK (It will automatically use the key from index.html)
    window.emailjs.send('service_6vyl1sy', 'template_6enn7yh', templateParams)
      .then(() => {
        showSuccess();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        const text = submitBtn.querySelector('.btn-text');
        if (text) text.textContent = 'Failed — please try again';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      });
  });

  FIELDS.forEach(({ id, errId }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      el.classList.remove('error');
      const err = document.getElementById(errId);
      if (err) err.classList.remove('visible');
      el.removeAttribute('aria-invalid');
    });
  });
}dasdas