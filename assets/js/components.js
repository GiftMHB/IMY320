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
      <div class="nav-actions">
        <a class="cart-link" href="cart.html" id="cart-link" aria-label="View cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-badge" id="cart-badge">0</span>
        </a>
        <span class="nav-actions-auth" id="nav-actions"></span>
      </div>
    </div>
  `;

  renderAuthState();
  if (typeof updateCartBadge === "function") updateCartBadge();
}

function renderAuthState() {
  const slot = document.getElementById("nav-actions");
  if (!slot) return;
  const user = JSON.parse(localStorage.getItem("codecampus_current_user") || "null");

  if (user) {
    slot.innerHTML = `
      <a class="btn btn-ghost" href="profile.html">My Learning</a>
      <span style="font-size:13px; opacity:0.7;">Hi, ${escapeHtml(user.name)}</span>
      <button class="btn btn-ghost" id="logout-btn">Log out</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("codecampus_current_user");
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
          <span class="logo-mark"></span> CodeCampus
        </a>
        <p class="footer-summary">Build practical software skills with guided, hands-on courses that end in real projects.</p>
        <div class="social-links">
          <span aria-label="LinkedIn">
            <i class="devicon-linkedin-plain" aria-hidden="true"></i>
          </span>
          <span aria-label="GitHub">
            <i class="devicon-github-original" aria-hidden="true"></i>
          </span>
          <span aria-label="Newsletter">
            <i class="social-icon-newsletter" aria-hidden="true">&#9993;</i>
          </span>
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
            <li><a href="catalogue.html?language=Python">Python</a></li>
            <li><a href="catalogue.html?language=C%2B%2B">C++</a></li>
            <li><a href="catalogue.html?language=ReactJS">React</a></li>
            <li><a href="catalogue.html?language=TypeScript">TypeScript</a></li>
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
        <div>© ${new Date().getFullYear()} CodeCampus - an IMY 320 student project.</div>
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

/* Briefly swap a button's contents to confirm an action happened (e.g. "Added ✓"),
   then restore it — used alongside the toast for the button itself. */
function flashButton(btn, tempLabel, tempClass) {
  if (!btn || btn._flashing) return;
  btn._flashing = true;
  const original = btn.innerHTML;
  const originalClass = btn.className;
  btn.innerHTML = tempLabel;
  if (tempClass) btn.classList.add(tempClass);
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.className = originalClass;
    btn.disabled = false;
    btn._flashing = false;
  }, 1100);
}

/* Site-wide click feedback: every .btn / .icon-btn gets a small radial
   ripple + press animation, no matter which page it's on. */
function initClickFeedback() {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".btn, .icon-btn, .quick-add-btn");
    if (!el || el.disabled) return;
    if (REDUCED) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--ripple-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--ripple-y", `${e.clientY - rect.top}px`);
    el.classList.remove("rippling");
    void el.offsetWidth; // restart animation
    el.classList.add("rippling");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initClickFeedback();
});
