const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CATEGORY_ICONS = {
  "Python": "devicon-python-plain",
  "C++": "devicon-cplusplus-plain",
  "PostgreSQL": "devicon-postgresql-plain",
  "Java": "devicon-java-plain",
  "TypeScript": "devicon-typescript-plain",
  "HTML & CSS": "devicon-html5-plain",
  "ReactJS": "devicon-react-original",
};
const DEFAULT_ICON = "devicon-devicon-plain";

function formatPrice(price) {
  return price === 0 ? "Free" : `R${price}`;
}

function initial(str) {
  return str.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

async function loadCourses() {
  try {
    const res = await fetch("data/courses.json");
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (err) {
    console.warn("Could not load data/courses.json — serve this site over a local server (e.g. Live Server) rather than opening the file directly.", err);
    return null;
  }
}

function renderCategories(courses) {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  const counts = {};
  courses.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });

  grid.innerHTML = Object.entries(counts).map(([category, count]) => `
    <a class="cat-tile reveal" href="catalogue.html?category=${encodeURIComponent(category)}">
      <div class="cat-icon"><i class="${CATEGORY_ICONS[category] || DEFAULT_ICON}"></i></div>
      <h3>${category}</h3>
      <div class="cat-count">${count} course${count === 1 ? "" : "s"}</div>
    </a>
  `).join("");

  observeReveals(grid.querySelectorAll(".reveal"));
}

function renderCourseCards(courses) {
  const grid = document.getElementById("course-grid");
  if (!grid) return;

  grid.innerHTML = courses.map(c => `
    <article class="course-card reveal">
      <div class="course-thumb">
        <span class="thumb-tag">${c.category}</span>
        <span class="thumb-price">${formatPrice(c.price)}</span>
      </div>
      <div class="course-body">
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="course-meta">
          <span class="level">${c.level}</span>
          <span>${c.durationHours}h · ${c.instructor}</span>
        </div>
      </div>
    </article>
  `).join("");

  observeReveals(grid.querySelectorAll(".reveal"));
}

function animateStat(el, target) {
  if (REDUCED_MOTION) { el.textContent = target; return; }
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function setupStats(courses) {
  const totalCourses = courses.length;
  const tracks = new Set(courses.map(c => c.category)).size;
  const totalHours = courses.reduce((sum, c) => sum + c.durationHours, 0);
  const freeCourses = courses.filter(c => c.price === 0).length;

  const targets = {
    "stat-courses": totalCourses,
    "stat-tracks": tracks,
    "stat-hours": totalHours,
    "stat-free": freeCourses,
  };

  const strip = document.querySelector(".stats-strip");
  if (!strip) return;

  let animated = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        Object.entries(targets).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) animateStat(el, val);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(strip);
}

function setupRotator(courses) {
  const el = document.getElementById("hero-rotator");
  if (!el) return;

  const wordMap = {
    "Python": "Python.",
    "PostgreSQL": "PostgreSQL.",
    "Java": "Java.",
    "TypeScript": "TypeScript.",
    "HTML & CSS": "HTML.",
    "ReactJS": "React.",
  };
  const words = [...new Set(courses.map(c => wordMap[c.category] || null).filter(Boolean))];
  if (words.length < 2) return;

  if (REDUCED_MOTION) {
    el.innerHTML = `<span class="rotator-word">${words.join(", ").replace(/,([^,]*)$/, " and$1")}</span>`;
    return;
  }

  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    el.innerHTML = `<span class="rotator-word">${words[i]}</span>`;
  }, 2200);
}

/* ---------- generic scroll reveal ---------- */
function observeReveals(nodeList) {
  if (REDUCED_MOTION) {
    nodeList.forEach(el => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  nodeList.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", async () => {
  // Reveal any static .reveal elements already in the DOM (cards, steps, testimonials)
  observeReveals(document.querySelectorAll(".reveal"));

  const courses = await loadCourses();
  if (!courses) return; // data/courses.json unreachable (likely opened via file://)

  renderCategories(courses);
  renderCourseCards(courses.slice(0, 4));
  setupStats(courses);
  setupRotator(courses);
});
