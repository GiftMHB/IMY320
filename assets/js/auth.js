/* =========================================================
   auth.js — Group Design A component
   Simulates a real backend using localStorage so login/register
   actually persists across reloads without a server (per brief:
   "JSON files are easy ways of manipulating these interactions").
   ========================================================= */

const USERS_KEY = "forge_users";
const SESSION_KEY = "forge_current_user";

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

function withLoading(button, doWork) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Working…";
  // Simulate network latency so the flow feels real (per brief: loading states matter)
  setTimeout(() => {
    doWork();
    button.disabled = false;
    button.textContent = original;
  }, 650);
}

function initAuthPage() {
  const params = new URLSearchParams(window.location.search);
  setTab(params.get("tab") === "register" ? "register" : "login");

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });

  // ---- LOGIN ----
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

  // ---- REGISTER ----
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
    if (password.length < 8) { fieldError(passField, "Use at least 8 characters."); hasError = true; }
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
      showToast("Account created", `Welcome to Forge, ${name}.`, "success");
      setTimeout(() => (window.location.href = "index.html"), 700);
    });
  });
}

document.addEventListener("DOMContentLoaded", initAuthPage);
