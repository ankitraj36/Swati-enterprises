/* ===========================================================
   VALIDATION — form validation, floating labels, password
   =========================================================== */

/* --- Field-level validation --- */
function validateField(input) {
  const group = input.closest(".form-group");
  if (!group) return true;
  let valid = true;
  const val = input.value.trim();

  if (input.hasAttribute("required") && !val) valid = false;
  if (input.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid = false;
  if (input.type === "tel" && val && !/^[0-9+\-\s]{7,15}$/.test(val)) valid = false;
  if (input.minLength > 0 && val.length < input.minLength) valid = false;

  /* Password confirm match */
  if (input.dataset.match) {
    const other = document.getElementById(input.dataset.match);
    if (other && val !== other.value) valid = false;
  }

  group.classList.toggle("error", !valid);
  return valid;
}

/* --- Bind live validation to a form --- */
function bindLiveValidation(form) {
  if (!form) return;
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".form-group")?.classList.contains("error")) {
        validateField(input);
      }
    });
  });
}

/* --- Validate entire form --- */
function validateForm(form) {
  let allValid = true;
  form.querySelectorAll("input, select, textarea").forEach(input => {
    if (!validateField(input)) allValid = false;
  });
  return allValid;
}

/* --- Password strength meter --- */
function initPasswordStrength(inputId, barSelector, labelSelector) {
  const pw = document.getElementById(inputId);
  if (!pw) return;

  const bar = document.querySelector(barSelector);
  const label = document.querySelector(labelSelector);

  pw.addEventListener("input", () => {
    let score = 0;
    if (pw.value.length >= 6) score++;
    if (pw.value.length >= 10) score++;
    if (/[A-Z]/.test(pw.value)) score++;
    if (/[0-9]/.test(pw.value)) score++;
    if (/[^A-Za-z0-9]/.test(pw.value)) score++;

    const pct = Math.min((score / 5) * 100, 100);
    const colors = ["var(--danger)", "var(--danger)", "#EF8A44", "var(--warning)", "var(--success)", "var(--success)"];
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

    if (bar) {
      bar.style.width = pct + "%";
      bar.style.background = colors[score];
    }
    if (label) {
      label.textContent = labels[score] || "";
      label.style.color = colors[score];
    }
  });
}

/* --- Password visibility toggle --- */
function initPasswordToggle(inputId, toggleSelector) {
  const input = document.getElementById(inputId);
  const toggle = document.querySelector(toggleSelector);
  if (!input || !toggle) return;

  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggle.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });
}

/* --- Generic demo form handler --- */
function bindDemoForm(formId, successMsg, redirect) {
  const form = document.getElementById(formId);
  if (!form) return;
  bindLiveValidation(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm(form)) {
      showToast("Please fix the highlighted fields", "error");
      return;
    }
    showToast(successMsg, "success");
    if (redirect) { setTimeout(() => window.location.href = redirect, 900); }
    else { form.reset(); }
  });
}
