function formatPriceR4(price) {
  return price === 0 ? "Free" : `R${price}`;
}

async function initProfile() {
  const user = JSON.parse(localStorage.getItem("codecampus_current_user") || "null");
  const greeting = document.getElementById("profile-greeting");
  if (user && greeting) greeting.textContent = `Welcome back, ${user.name} — here's where you left off.`;

  let allCourses = [];
  try {
    const res = await fetch("data/courses.json");
    allCourses = await res.json();
  } catch (err) {
    console.warn("Could not load data/courses.json — serve this site over a local server.", err);
    return;
  }

  const enrollments = getEnrollments();
  const courseIds = Object.keys(enrollments);
  const orders = getOrders().slice().reverse();

  if (courseIds.length === 0 && orders.length === 0) {
    document.getElementById("profile-empty").hidden = false;
    return;
  }
  document.getElementById("profile-content").hidden = false;

  const inProgressIds = courseIds.filter((id) => !enrollments[id].completed);
  const completedIds = courseIds.filter((id) => enrollments[id].completed);

  renderProgressGrid("in-progress-grid", inProgressIds, allCourses, enrollments, false);
  renderProgressGrid("completed-grid", completedIds, allCourses, enrollments, true);
  renderOrderHistory(orders);
}

function lessonTotalEstimate() {
  return 6; // fallback if curriculum count isn't available on this view
}

function renderProgressGrid(containerId, ids, allCourses, enrollments, isCompleted) {
  const container = document.getElementById(containerId);
  const courses = ids.map((id) => allCourses.find((c) => c.id === id)).filter(Boolean);

  if (courses.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = courses
    .map((c) => {
      const record = enrollments[c.id];
      const doneCount = record.completedLessons.length;
      const total = Math.max(doneCount, isCompleted ? doneCount : doneCount + 1);
      const pct = isCompleted ? 100 : total ? Math.round((doneCount / total) * 100) : 0;

      return `
      <div class="p-card">
        <div class="p-card-thumb" style="background-image:url('${c.image}')">
          ${isCompleted ? `<span class="p-card-badge">🏆 Certified</span>` : ""}
        </div>
        <div class="p-card-body">
          <h3>${c.title}</h3>
          <div class="p-progress-track"><div class="p-progress-fill" style="width:${pct}%"></div></div>
          <div class="p-progress-label">${isCompleted ? "Completed" : `${doneCount} lesson${doneCount === 1 ? "" : "s"} done`}</div>
          <div class="p-card-actions">
            ${isCompleted
                ? `<a class="btn btn-ghost" href="course-complete.html?id=${encodeURIComponent(c.id)}">View certificate</a>
                   <button class="btn btn-primary" data-download="${c.id}" type="button">Download</button>`
                : `<a class="btn btn-primary" href="course-player.html?id=${encodeURIComponent(c.id)}">Continue</a>`
              }
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll("[data-download]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const course = courses.find((c) => c.id === btn.dataset.download);
      const record = enrollments[course.id];
      downloadCertificate(course, record.completedAt);
    });
  });
}

function renderOrderHistory(orders) {
  const el = document.getElementById("order-history-list");
  if (orders.length === 0) {
    el.innerHTML = `<p style="color:var(--ink-soft);font-size:13.5px;">No orders yet.</p>`;
    return;
  }
  el.innerHTML = orders
    .map(
      (o) => `
    <div class="order-history-row">
      <div>
        <div class="oh-id">${o.id}</div>
        <div class="oh-meta">${new Date(o.date).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })} · ${o.items.length} course${o.items.length === 1 ? "" : "s"}</div>
      </div>
      <div class="oh-total">${formatPriceR4(o.total)}</div>
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", initProfile);
