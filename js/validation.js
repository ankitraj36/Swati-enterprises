/* ===========================
   VALIDATION.JS – Form Validation
   =========================== */

const Validation = (() => {
  const rules = {
    required: (val) => val.trim() !== '' || 'This field is required',
    email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
    phone:    (val) => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')) || 'Enter a valid 10-digit mobile number',
    minLen:   (n) => (val) => val.length >= n || `Minimum ${n} characters required`,
    maxLen:   (n) => (val) => val.length <= n || `Maximum ${n} characters allowed`,
    pincode:  (val) => /^\d{6}$/.test(val) || 'Enter a valid 6-digit PIN code',
    cardNum:  (val) => /^\d{16}$/.test(val.replace(/\s/g, '')) || 'Enter a valid 16-digit card number',
    cvv:      (val) => /^\d{3,4}$/.test(val) || 'Enter a valid CVV',
    expiry:   (val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val) || 'Enter expiry as MM/YY',
    password: (val) => {
      if (val.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(val)) return 'Include at least one uppercase letter';
      if (!/\d/.test(val)) return 'Include at least one number';
      return true;
    },
    match:    (otherId) => (val) => val === document.getElementById(otherId)?.value || 'Passwords do not match',
  };

  const validate = (input, fieldRules) => {
    for (const rule of fieldRules) {
      const result = typeof rule === 'function' ? rule(input.value) : rules[rule](input.value);
      if (result !== true) return result;
    }
    return null;
  };

  const showError = (input, msg) => {
    input.classList.add('input-error');
    input.classList.remove('input-success');
    let errEl = input.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'field-error';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  };

  const clearError = (input) => {
    input.classList.remove('input-error');
    input.classList.add('input-success');
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
  };

  const bindField = (input, fieldRules) => {
    const check = () => {
      const err = validate(input, fieldRules);
      if (err) showError(input, err);
      else clearError(input);
      return !err;
    };
    input.addEventListener('blur', check);
    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) check();
    });
    return check;
  };

  const initPasswordStrength = (inputId) => {
    const input = document.getElementById(inputId);
    const bars = document.querySelectorAll('.strength-bar');
    const label = document.querySelector('.strength-label');
    if (!input || !bars.length) return;

    input.addEventListener('input', () => {
      const val = input.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/\d/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = ['', 'weak', 'fair', 'good', 'strong'];
      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < score) bar.classList.add('active', levels[score]);
      });
      if (label) label.textContent = val ? labels[score] : '';
    });
  };

  const initTogglePassword = () => {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.innerHTML = isText
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
      });
    });
  };

  /* ── Contact Form ── */
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const validators = [
      bindField(form.querySelector('#contact-name'), [rules.required, rules.minLen(2)]),
      bindField(form.querySelector('#contact-email'), [rules.required, rules.email]),
      bindField(form.querySelector('#contact-phone'), [rules.phone]),
      bindField(form.querySelector('#contact-message'), [rules.required, rules.minLen(10)]),
    ].filter(Boolean);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const valid = validators.every(v => v());
      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        btn.classList.add('btn-loading');
        setTimeout(() => {
          btn.classList.remove('btn-loading');
          form.reset();
          form.querySelectorAll('.input-success').forEach(el => el.classList.remove('input-success'));
          window.App?.showToast('success', '✅ Message Sent!', 'We will get back to you within 24 hours');
        }, 1500);
      }
    });
  };

  /* ── Checkout Form ── */
  const initCheckoutForm = () => {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    // Format card number input
    const cardInput = document.getElementById('card-number');
    cardInput?.addEventListener('input', () => {
      cardInput.value = cardInput.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    });

    // Format expiry
    const expiryInput = document.getElementById('card-expiry');
    expiryInput?.addEventListener('input', () => {
      let val = expiryInput.value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
      expiryInput.value = val;
    });
  };

  /* ── Login/Register Form ── */
  const initAuthForm = () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      const vEmail = bindField(loginForm.querySelector('#login-email'), [rules.required, rules.email]);
      const vPass  = bindField(loginForm.querySelector('#login-password'), [rules.required]);
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (vEmail() && vPass()) {
          const btn = loginForm.querySelector('[type="submit"]');
          btn.classList.add('btn-loading');
          setTimeout(() => {
            btn.classList.remove('btn-loading');
            window.App?.showToast('success', '👋 Welcome back!', 'Login successful');
            setTimeout(() => window.location.href = 'index.html', 1000);
          }, 1500);
        }
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      const vName  = bindField(registerForm.querySelector('#reg-name'), [rules.required, rules.minLen(2)]);
      const vEmail = bindField(registerForm.querySelector('#reg-email'), [rules.required, rules.email]);
      const vPhone = bindField(registerForm.querySelector('#reg-phone'), [rules.phone]);
      const vPass  = bindField(registerForm.querySelector('#reg-password'), [rules.required, rules.password]);
      const vConf  = bindField(registerForm.querySelector('#reg-confirm'), [rules.required, rules.match('reg-password')]);

      initPasswordStrength('reg-password');

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if ([vName(), vEmail(), vPhone(), vPass(), vConf()].every(Boolean)) {
          const btn = registerForm.querySelector('[type="submit"]');
          btn.classList.add('btn-loading');
          setTimeout(() => {
            btn.classList.remove('btn-loading');
            window.App?.showToast('success', '🎉 Account Created!', 'Welcome to Swati Enterprises');
            setTimeout(() => window.location.href = 'index.html', 1000);
          }, 1500);
        }
      });
    }
  };

  const init = () => {
    initContactForm();
    initCheckoutForm();
    initAuthForm();
    initTogglePassword();
  };

  return { init, bindField, rules, showError, clearError };
})();

export default Validation;
