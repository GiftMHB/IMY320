const USERS_KEY = "codecampus_users";
const SESSION_KEY = "codecampus_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add("active");
  document.getElementById("login-form").style.display = tab === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = tab === "register" ? "block" : "none";
  document.getElementById("auth-heading").textContent = tab === "login" ? "Welcome back" : "Start building";
  const side = document.querySelector(".auth-side");
  if (side) side.classList.toggle("is-register", tab === "register");
  const url = new URL(window.location);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url);
}

function fieldError(fieldEl, message) {
  fieldEl.classList.toggle("has-error", Boolean(message));
  const err = fieldEl.querySelector(".field-error");
  if (err) err.textContent = message || "";
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
/* ---------- password rules ---------- */
const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: v => v.length >= 8 },
  { id: "upper",  label: "One uppercase letter",  test: v => /[A-Z]/.test(v) },
  { id: "lower",  label: "One lowercase letter",  test: v => /[a-z]/.test(v) },
  { id: "number", label: "One number",            test: v => /\d/.test(v) },
];

function passwordMeetsRules(value) {
  return PASSWORD_RULES.every(r => r.test(value));
}

// Builds the checklist and ticks items off live as the user types
function setupPasswordRules(input, listEl) {
  if (!input || !listEl) return;
  listEl.innerHTML = PASSWORD_RULES
    .map(r => `<li data-rule="${r.id}">${r.label}</li>`)
    .join("");
  const update = () => {
    PASSWORD_RULES.forEach(r => {
      listEl.querySelector(`[data-rule="${r.id}"]`)
        .classList.toggle("met", r.test(input.value));
    });
  };
  input.addEventListener("input", update);
  update();
}

/* ---------- show / hide password ---------- */
const EYE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_OFF_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function addPasswordToggles() {
  document.querySelectorAll('input[type="password"]').forEach(input => {
    const wrap = document.createElement("div");
    wrap.className = "password-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "password-toggle";
    btn.setAttribute("aria-label", "Show password");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = EYE_ICON;

    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? EYE_OFF_ICON : EYE_ICON;
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.setAttribute("aria-pressed", String(show));
    });

    wrap.appendChild(btn);
  });
}

function withLoading(button, doWork) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Working…";
  setTimeout(() => {
    doWork();
    button.disabled = false;
    button.textContent = original;
  }, 650);
}

function initAuthPage() {
  addPasswordToggles();
  setupPasswordRules(
    document.getElementById("reg-password"),
    document.getElementById("pw-rules")
  );

  const params = new URLSearchParams(window.location.search);
  setTab(params.get("tab") === "register" ? "register" : "login");

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const emailField = document.getElementById("login-email-field");
    const passField = document.getElementById("login-password-field");
    const email = emailField.querySelector("input").value.trim();
    const password = passField.querySelector("input").value;

    fieldError(emailField, "");
    fieldError(passField, "");

    let hasError = false;
    if (!validEmail(email)) { fieldError(emailField, "Enter a valid email address."); hasError = true; }
    if (!password) { fieldError(passField, "Enter your password."); hasError = true; }
    if (hasError) return;

    const btn = loginForm.querySelector("button[type=submit]");
    withLoading(btn, () => {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      if (!user || user.password !== password) {
        fieldError(passField, "Incorrect email or password.");
        showToast("Login failed", "Check your details and try again.");
        return;
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
      showToast("Welcome back", `Signed in as ${user.name}.`, "success");
      setTimeout(() => (window.location.href = "index.html"), 700);
    });
  });

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    const nameField = document.getElementById("reg-name-field");
    const emailField = document.getElementById("reg-email-field");
    const passField = document.getElementById("reg-password-field");
    const name = nameField.querySelector("input").value.trim();
    const email = emailField.querySelector("input").value.trim();
    const password = passField.querySelector("input").value;

    [nameField, emailField, passField].forEach(f => fieldError(f, ""));

    let hasError = false;
    if (name.length < 2) { fieldError(nameField, "Enter your full name."); hasError = true; }
    if (!validEmail(email)) { fieldError(emailField, "Enter a valid email address."); hasError = true; }
    if (!passwordMeetsRules(password)) { fieldError(passField, "Password doesn't meet all the requirements."); hasError = true; }
    if (hasError) return;

    const btn = registerForm.querySelector("button[type=submit]");
    withLoading(btn, () => {
      const users = getUsers();
      if (users.some(u => u.email === email)) {
        fieldError(emailField, "An account with this email already exists.");
        showToast("Registration failed", "That email is already registered.");
        return;
      }
      users.push({ name, email, password });
      saveUsers(users);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
      showToast("Account created", `Welcome to CodeCampus, ${name}.`, "success");
      setTimeout(() => (window.location.href = "index.html"), 700);
    });
  });
}

document.addEventListener("DOMContentLoaded", initAuthPage);