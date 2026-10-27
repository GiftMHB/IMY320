let playerCourse = null;
let playerModules = [];
let playerLessons = []; // flat list: { key, title, duration, moduleTitle }
let currentLessonIndex = 0;
let openModules = new Set();
let courseIsCompleted = false;

async function loadJSONp(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

async function initPlayer() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let allCourses, allDetails;
  try {
    [allCourses, allDetails] = await Promise.all([
      loadJSONp("data/courses.json"),
      loadJSONp("data/course-details.json"),
    ]);
  } catch (err) {
    console.warn("Serve this site over a local server (e.g. Live Server) rather than opening the file directly.", err);
    return;
  }

  playerCourse = allCourses.find((c) => c.id === id);
  if (!playerCourse) {
    document.getElementById("player-course-title").textContent = "Course not found";
    return;
  }

  document.getElementById("guard-enroll-link").href = `course-detail.html?id=${encodeURIComponent(playerCourse.id)}`;
  document.getElementById("back-to-course").href = `course-detail.html?id=${encodeURIComponent(playerCourse.id)}`;

  if (!isEnrolled(playerCourse.id)) {
    document.getElementById("player-guard").hidden = false;
    return;
  }

  document.getElementById("player-app").hidden = false;
  document.title = `${playerCourse.title} — CodeCampus`;
  document.getElementById("player-course-title").textContent = playerCourse.title;

  const details = allDetails[playerCourse.id] || {};
  playerModules = details.curriculum || [];
  playerLessons = [];
  playerModules.forEach((mod, mi) => {
    (mod.lessons || []).forEach((lesson, li) => {
      playerLessons.push({
        key: `${mi}-${li}`,
        title: lesson.title,
        duration: lesson.duration,
        moduleTitle: mod.title,
      });
    });
  });

  renderOverview(details);

  const record = getProgress(playerCourse.id);
  courseIsCompleted = Boolean(record && record.completed);
  if (courseIsCompleted) setupCompletedBanner(record);

  // resume at the first lesson that is not done yet
  const progress = getProgress(playerCourse.id);
  const doneKeys = (progress && progress.completedLessons) || [];
  const firstTodo = playerLessons.findIndex((l) => !doneKeys.includes(l.key));
  currentLessonIndex = firstTodo === -1 ? 0 : firstTodo;
  openModules.add(Number(playerLessons[currentLessonIndex].key.split("-")[0]));

  renderCurriculumNav();
  selectLesson(currentLessonIndex);
  document.getElementById("mark-complete-btn").addEventListener("click", markCurrentLessonComplete);
  document.getElementById("prev-lesson-btn").addEventListener("click", () => selectLesson(currentLessonIndex - 1));
  document.getElementById("next-lesson-btn").addEventListener("click", () => selectLesson(currentLessonIndex + 1));
}

function setupCompletedBanner(record) {
  document.getElementById("completed-banner").hidden = false;
  document.getElementById("mark-complete-btn").hidden = true;
  if (record.completedAt) {
    document.getElementById("completed-date").textContent =
      "on " + new Date(record.completedAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  }
  document.getElementById("banner-certificate").href = `course-complete.html?id=${encodeURIComponent(playerCourse.id)}`;

  const reviewBtn = document.getElementById("banner-review");
  const label = () => {
    reviewBtn.textContent = getReview(playerCourse.id) ? "Edit Your Review" : "Add Your Review";
  };
  label();
  reviewBtn.addEventListener("click", () => openReviewModal(playerCourse.id, label));
}

function renderOverview(details) {
  document.getElementById("overview-text").textContent = details.longDescription || playerCourse.description || "";
  document.getElementById("overview-learn").innerHTML = (details.learnPoints || [])
    .map((p) => `<li>${p}</li>`)
    .join("");
  document.getElementById("overview-instructor").textContent = playerCourse.instructor
    ? `Instructor: ${playerCourse.instructor}`
    : "";
}

function renderCurriculumNav() {
  const container = document.getElementById("curriculum-nav");
  const progress = getProgress(playerCourse.id);
  const done = new Set((progress && progress.completedLessons) || []);

  container.innerHTML = playerModules
    .map((mod, mi) => {
      const lessons = mod.lessons || [];
      const doneInModule = lessons.filter((_, li) => done.has(`${mi}-${li}`)).length;
      const isOpen = openModules.has(mi);
      const lessonsHtml = lessons
        .map((lesson, li) => {
          const key = `${mi}-${li}`;
          const flatIndex = playerLessons.findIndex((l) => l.key === key);
          const isDone = done.has(key);
          return `
          <button class="nav-lesson ${isDone ? "done" : ""}" type="button" data-index="${flatIndex}">
            <span class="nav-lesson-check">${isDone ? "✓" : ""}</span>
            <span class="nav-lesson-title">${lesson.title}</span>
            <span class="nav-lesson-duration">${lesson.duration}</span>
          </button>
        `;
        })
        .join("");
      return `
        <div class="nav-module ${isOpen ? "open" : ""}">
          <button class="nav-module-head" type="button" data-module="${mi}" aria-expanded="${isOpen}">
            <span class="nav-module-title">${mod.title}</span>
            <span class="nav-module-count">${doneInModule}/${lessons.length}</span>
            <span class="nav-module-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="nav-module-body">${lessonsHtml}</div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".nav-module-head").forEach((head) => {
    head.addEventListener("click", () => {
      const mi = Number(head.dataset.module);
      if (openModules.has(mi)) openModules.delete(mi);
      else openModules.add(mi);
      head.parentElement.classList.toggle("open", openModules.has(mi));
      head.setAttribute("aria-expanded", openModules.has(mi));
    });
  });

  container.querySelectorAll(".nav-lesson").forEach((btn) => {
    btn.addEventListener("click", () => selectLesson(Number(btn.dataset.index)));
  });

  updateProgressBar();
}

function selectLesson(index) {
  if (index < 0 || index >= playerLessons.length) return;
  currentLessonIndex = index;
  const lesson = playerLessons[index];

  document.getElementById("now-playing-title").textContent = lesson.title;
  document.getElementById("lesson-heading").textContent = lesson.title;
  document.getElementById("lesson-module-label").textContent = `${lesson.moduleTitle} · ${lesson.duration}`;

  const moduleIndex = Number(lesson.key.split("-")[0]);
  if (!openModules.has(moduleIndex)) {
    openModules.add(moduleIndex);
    const mod = document.querySelectorAll(".nav-module")[moduleIndex];
    if (mod) {
      mod.classList.add("open");
      mod.querySelector(".nav-module-head").setAttribute("aria-expanded", "true");
    }
  }
  document.getElementById("prev-lesson-btn").disabled = index === 0;
  document.getElementById("next-lesson-btn").disabled = index === playerLessons.length - 1;

  document.querySelectorAll(".nav-lesson").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.index) === index);
  });

  const progress = getProgress(playerCourse.id);
  const done = progress && progress.completedLessons.includes(lesson.key);
  const btn = document.getElementById("mark-complete-btn");
  btn.textContent = done ? "✓ Lesson complete" : "Mark lesson complete";
  btn.classList.toggle("btn-ghost", Boolean(done));
  btn.classList.toggle("btn-primary", !done);
}

function updateProgressBar() {
  const progress = getProgress(playerCourse.id);
  const doneCount = progress ? progress.completedLessons.length : 0;
  const total = playerLessons.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("progress-label").textContent =
    pct === 100 ? "Course complete" : `${doneCount} of ${total} lessons complete`;
  document.getElementById("progress-percent").textContent = `${pct}%`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.getElementById("progress-track").setAttribute("aria-valuenow", pct);
}

function markCurrentLessonComplete() {
  const lesson = playerLessons[currentLessonIndex];
  if (!lesson) return;

  const { justCompleted } = toggleLessonComplete(playerCourse.id, lesson.key, playerLessons.length);
  renderCurriculumNav();
  selectLesson(currentLessonIndex);

  const progress = getProgress(playerCourse.id);
  const nowDone = progress.completedLessons.includes(lesson.key);

  if (nowDone) {
    showToast("Nice work", `"${lesson.title}" marked complete.`, "success");
  }

  if (justCompleted) {
    showToast("Course complete! 🎉", "Taking you to your certificate…", "success");
    setTimeout(() => {
      window.location.href = `course-complete.html?id=${encodeURIComponent(playerCourse.id)}`;
    }, 1100);
    return;
  }

  if (nowDone && currentLessonIndex < playerLessons.length - 1) {
    setTimeout(() => selectLesson(currentLessonIndex + 1), 500);
  }
}

document.addEventListener("DOMContentLoaded", initPlayer);
