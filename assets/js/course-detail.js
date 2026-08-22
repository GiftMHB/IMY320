function formatPrice(price) {
  return price === 0 ? "Free" : `R${price}`;
}

function initials(str) {
  return str.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function stars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

function renderBreadcrumb(course) {
  const el = document.getElementById("breadcrumb");
  el.innerHTML = `
    <a href="catalogue.html">All Courses</a>
    <span class="sep">/</span>
    <a href="catalogue.html?category=${encodeURIComponent(course.category)}">${course.category}</a>
    <span class="sep">/</span>
    <span>${course.title}</span>
  `;
}

function renderHero(course, details) {
  document.title = `${course.title} — CodeCampus`;

  document.getElementById("hero-tags").innerHTML = `
    <span class="tag">${course.category}</span>
    <span class="tag level">${course.level}</span>
  `;
  document.getElementById("course-title").textContent = course.title;
  document.getElementById("course-summary").textContent = course.description;

  document.getElementById("meta-row").innerHTML = `
    <span class="meta-item">⏱ ${course.durationHours}h length</span>
    <span class="meta-item">👤 ${course.instructor}</span>
    <span class="meta-item">${(details.studentsCount || 0).toLocaleString()} students</span>
    <span class="meta-item"><span class="stars">${stars(details.rating || 0)}</span> ${details.rating || "—"} (${details.reviewsCount || 0} reviews)</span>
  `;

  const thumb = document.getElementById("sidebar-thumb");
  thumb.style.backgroundImage = `url('${course.image}')`;

  document.getElementById("sidebar-price").textContent = formatPrice(course.price);
}

function renderAbout(details) {
  document.getElementById("about-text").textContent = details.longDescription || "";
}

function renderProjectFocus(details) {
  const pf = details.projectFocus;
  if (!pf) return;
  document.getElementById("project-focus").innerHTML = `
    <div class="pf-icon">★</div>
    <div>
      <h3>${pf.title}</h3>
      <p>${pf.description}</p>
    </div>
  `;
}

function renderLearnPoints(details) {
  const list = document.getElementById("learn-list");
  list.innerHTML = (details.learnPoints || []).map(point => `<li>${point}</li>`).join("");
}

function renderCurriculum(details) {
  const container = document.getElementById("curriculum-list");
  container.innerHTML = (details.curriculum || []).map((mod, i) => `
    <details class="curriculum-module" ${i === 0 ? "open" : ""}>
      <summary>
        <span class="chev">▸</span>&nbsp;&nbsp;${mod.title}
        <span class="mod-duration">${mod.duration}</span>
      </summary>
      <ul class="curriculum-lessons">
        ${mod.lessons.map(l => `<li><span>${l.title}</span><span>${l.duration}</span></li>`).join("")}
      </ul>
    </details>
  `).join("");
}

function renderRequirements(details) {
  const list = document.getElementById("requirements-list");
  list.innerHTML = (details.requirements || []).map(r => `<li>${r}</li>`).join("");
}

function renderInstructor(course, details) {
  const inst = details.instructor || {};
  document.getElementById("instructor-card").innerHTML = `
    <div class="avatar">${initials(course.instructor)}</div>
    <div>
      <h3>${course.instructor}</h3>
      <div class="instructor-role">Instructor</div>
      <div class="instructor-stats">
        <span>★ ${inst.rating || "—"} Rating</span>
        <span>${(inst.studentsCount || 0).toLocaleString()} Students</span>
        <span>${inst.coursesCount || 0} Courses</span>
      </div>
      <p class="bio">${inst.bio || ""}</p>
    </div>
  `;
}

function renderReviews(details) {
  const grid = document.getElementById("reviews-grid");
  grid.innerHTML = (details.reviews || []).map(r => `
    <div class="testi-card">
      <div class="stars" style="margin-bottom:10px;">${stars(r.rating)}</div>
      <blockquote>"${r.quote}"</blockquote>
      <div class="testi-who">
        <div class="testi-avatar">${r.initials}</div>
        <div>
          <div class="name">${r.name}</div>
        </div>
      </div>
    </div>
  `).join("");
}

function renderRelated(course, allCourses) {
  const grid = document.getElementById("related-grid");
  const related = allCourses
    .filter(c => c.id !== course.id && c.category === course.category)
    .concat(allCourses.filter(c => c.id !== course.id && c.category !== course.category))
    .slice(0, 3);

  grid.innerHTML = related.map(c => `
    <a class="course-card" href="course-detail.html?id=${encodeURIComponent(c.id)}" style="text-decoration:none;">
      <div class="course-thumb" style="background-image: url('${c.image}'); background-size:cover; background-position:center;">
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
    </a>
  `).join("");
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let allCourses, allDetails;
  try {
    [allCourses, allDetails] = await Promise.all([
      loadJSON("data/courses.json"),
      loadJSON("data/course-details.json"),
    ]);
  } catch (err) {
    document.getElementById("course-title").textContent = "Could not load course data.";
    console.warn("Serve this site over a local server (e.g. Live Server) rather than opening the file directly.", err);
    return;
  }

  const course = allCourses.find(c => c.id === id) || allCourses[0];
  const details = allDetails[course.id] || {};

  if (!course) {
    document.getElementById("course-title").textContent = "Course not found.";
    return;
  }

  renderBreadcrumb(course);
  renderHero(course, details);
  renderAbout(details);
  renderProjectFocus(details);
  renderLearnPoints(details);
  renderCurriculum(details);
  renderRequirements(details);
  renderInstructor(course, details);
  renderReviews(details);
  renderRelated(course, allCourses);
}

document.addEventListener("DOMContentLoaded", init);