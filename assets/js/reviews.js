function getReview(courseId) {
  const record = getProgress(courseId);
  return (record && record.review) || null;
}

function saveReview(courseId, rating, comment) {
  const enrollments = getEnrollments();
  if (!enrollments[courseId]) return false;
  enrollments[courseId].review = {
    rating: rating,
    comment: comment,
    createdAt: Date.now(),
  };
  saveEnrollments(enrollments);
  return true;
}

function openReviewModal(courseId, onSaved) {
  const existing = getReview(courseId);
  let rating = existing ? existing.rating : 0;

  const overlay = document.createElement("div");
  overlay.className = "review-overlay";
  overlay.innerHTML = `
    <div class="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <h2 id="review-title">Add your review</h2>
      <div class="review-stars" role="radiogroup" aria-label="Rating">
        ${[1, 2, 3, 4, 5]
          .map((n) => `<button type="button" class="review-star" data-value="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`)
          .join("")}
      </div>
      <textarea id="review-comment" rows="4" placeholder="What did you think of the course?"></textarea>
      <p class="review-error" id="review-error" hidden>Please pick a star rating.</p>
      <div class="review-actions">
        <button type="button" class="btn btn-ghost" id="review-cancel">Cancel</button>
        <button type="button" class="btn btn-primary" id="review-submit">Submit review</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stars = overlay.querySelectorAll(".review-star");
  const comment = overlay.querySelector("#review-comment");
  comment.value = existing ? existing.comment : "";

  function paint() {
    stars.forEach((s) => s.classList.toggle("on", Number(s.dataset.value) <= rating));
  }
  paint();

  stars.forEach((s) =>
    s.addEventListener("click", () => {
      rating = Number(s.dataset.value);
      overlay.querySelector("#review-error").hidden = true;
      paint();
    })
  );

  function close() {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  document.addEventListener("keydown", onKey);

  overlay.querySelector("#review-cancel").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("#review-submit").addEventListener("click", () => {
    if (!rating) {
      overlay.querySelector("#review-error").hidden = false;
      return;
    }
    saveReview(courseId, rating, comment.value.trim());
    close();
    if (onSaved) onSaved();
  });
}