function renderHeader() {
  const page = document.body.dataset.page || "";
  const link = (href, label, key) =>
    `<a href="${href}"${page === key ? ' aria-current="page" style="color: var(--up-gold-dark); opacity:1;"' : ""}>${label}</a>`;

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <div class="wrap">
      <a class="logo" href="index.html">
        <span class="logo-mark"></span> CodeCampus
      </a>
      <ul class="nav-links">
        <li>${link("index.html", "Home", "landing")}</li>
        <li>${link("catalogue.html", "Courses", "catalogue")}</li>
        <li>${link("about.html", "About", "about")}</li>
      </ul>
      <div class="nav-actions" id="nav-actions"></div>
    </div>
  `;

  renderAuthState();
}

function renderAuthState() {
  const slot = document.getElementById("nav-actions");
  if (!slot) return;
  const user = JSON.parse(localStorage.getItem("forge_current_user") || "null");

  if (user) {
    slot.innerHTML = `
      <span style="font-size:13px; opacity:0.7;">Hi, ${escapeHtml(user.name)}</span>
      <button class="btn btn-ghost" id="logout-btn">Log out</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("forge_current_user");
      showToast("Signed out", "You've been logged out.", "success");
      setTimeout(() => (window.location.href = "index.html"), 700);
    });
  } else {
    slot.innerHTML = `
      <a class="btn btn-ghost" href="login.html">Log in</a>
      <a class="btn btn-primary" href="login.html?tab=register">Sign up</a>
    `;
  }
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="wrap">
      <div>
        <div>© ${new Date().getFullYear()} Forge — an IMY 320 student project.</div>
        <div class="disclosure">Built with vanilla HTML/CSS/JS. Fonts: Space Grotesk, Inter, JetBrains Mono (Google Fonts). No other third-party frameworks used.</div>
      </div>
      <ul class="footer-links">
        <li><a href="about.html">About</a></li>
        <li><a href="catalogue.html">Courses</a></li>
        <li><a href="#" onclick="return false;">Privacy</a></li>
      </ul>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* Simple shared toast used across every page */
function showToast(title, message, variant) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.className = variant === "success" ? "success" : "";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong>${escapeHtml(message)}`;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
