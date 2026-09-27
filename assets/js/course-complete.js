let completedCourse = null;
let completedAt = null;

async function initCourseComplete() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let allCourses;
  try {
    const res = await fetch("data/courses.json");
    allCourses = await res.json();
  } catch (err) {
    console.warn("Could not load data/courses.json — serve this site over a local server.", err);
    return;
  }

  completedCourse = allCourses.find((c) => c.id === id);
  if (!completedCourse) {
    document.getElementById("end-heading").textContent = "Course not found";
    document.getElementById("cert-wrap").style.display = "none";
    document.getElementById("end-stats").style.display = "none";
    return;
  }

  const progress = getProgress(completedCourse.id);
  completedAt = (progress && progress.completedAt) || Date.now();
  const lessonsDone = progress ? progress.completedLessons.length : 0;

  document.title = `Completed: ${completedCourse.title} — CodeCampus`;
  document.getElementById("end-heading").textContent = `You finished ${completedCourse.title}!`;
  document.getElementById("end-sub").textContent =
    "Every lesson is checked off. Your certificate is ready below.";

  const dateStr = new Date(completedAt).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("cert-wrap").innerHTML = `
    <div class="certificate">
      <div class="cert-brand">CodeCampus · Certificate of Completion</div>
      <div class="cert-title">🎓</div>
      <div class="cert-name">${studentDisplayName()}</div>
      <p class="cert-course">has successfully completed<br><strong>${completedCourse.title}</strong></p>
      <div class="cert-date">${dateStr}</div>
    </div>
  `;

  document.getElementById("end-stats").innerHTML = `
    <div class="end-stat"><strong>${lessonsDone}</strong><span>Lessons done</span></div>
    <div class="end-stat"><strong>${completedCourse.durationHours}h</strong><span>Course length</span></div>
    <div class="end-stat"><strong>${completedCourse.category}</strong><span>Track</span></div>
  `;

  document.getElementById("download-cert-btn").addEventListener("click", () => {
    downloadCertificate(completedCourse, completedAt);
  });

  launchConfetti(document.getElementById("confetti-canvas"));
}

document.addEventListener("DOMContentLoaded", initCourseComplete);
