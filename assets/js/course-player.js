let playerCourse = null;
let playerModules = [];
let playerLessons = []; // flat list: { key, title, duration, moduleTitle }
let currentLessonIndex = 0;

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

  renderCurriculumNav();
  selectLesson(0);
  document.getElementById("mark-complete-btn").addEventListener("click", markCurrentLessonComplete);
}

function renderCurriculumNav() {
  const container = document.getElementById("curriculum-nav");
  const progress = getProgress(playerCourse.id);
  const done = new Set((progress && progress.completedLessons) || []);

  container.innerHTML = playerModules
    .map((mod, mi) => {
      const lessonsHtml = (mod.lessons || [])
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
        <div class="nav-module">
          <div class="nav-module-title">${mod.title}</div>
          ${lessonsHtml}
        </div>
      `;
    })
    .join("");

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

  document.getElementById("progress-label").textContent = `${doneCount} of ${total} lessons complete`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
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
