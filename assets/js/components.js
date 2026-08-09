function renderHeader() {
  const page = document.body.dataset.page || "";
  const link = (href, label, key) =>
    `<a href="${href}"${page === key ? ' aria-current="page" style="color: var(--up-gold-dark); opacity:1;"' : ""}>${label}</a>`;

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <div class="wrap">
      <a class="logo" href="index.html">
        <span class="logo-mark"></span> Forge
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
    <div class="wrap footer-wrap">
      <div class="footer-brand">
        <a class="logo footer-logo" href="index.html">
          <span class="logo-mark"></span> Forge
        </a>
        <p class="footer-summary">Build practical software skills with guided, hands-on courses that end in real projects.</p>
        <div class="social-links">
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
          <a href="#" aria-label="GitHub">GitHub</a>
          <a href="#" aria-label="Newsletter">Newsletter</a>
        </div>
      </div>

      <div class="footer-columns">
        <div class="footer-col">
          <h3>Platform</h3>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="catalogue.html">Courses</a></li>
            <li><a href="about.html">About</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Tracks</h3>
          <ul class="footer-links">
            <li><a href="catalogue.html">Python</a></li>
            <li><a href="catalogue.html">Java & C++</a></li>
            <li><a href="catalogue.html">React & TypeScript</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Resources</h3>
          <ul class="footer-links">
            <li><a href="#" onclick="return false;">Learning roadmap</a></li>
            <li><a href="#" onclick="return false;">Privacy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© ${new Date().getFullYear()} Forge — an IMY 320 student project.</div>
      </div>
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
