function formatPriceR3(price) {
  return price === 0 ? "Free" : `R${price}`;
}

function initOrderSuccess() {
  const params = new URLSearchParams(window.location.search);
  let orderId = params.get("order") || localStorage.getItem("codecampus_last_order_id");
  const order = orderId ? getOrder(orderId) : null;

  if (!order) {
    document.getElementById("order-number").textContent = "Order confirmed";
    document.getElementById("order-recap").innerHTML = `<p style="margin:0;color:var(--ink-soft);font-size:13px;">Your course access is ready in your dashboard.</p>`;
    document.getElementById("order-recap-total").style.display = "none";
  } else {
    document.getElementById("order-number").textContent = `Order ${order.id}`;
    document.getElementById("order-recap").innerHTML = order.items
      .map(
        (it) => `
      <div class="order-recap-line">
        <div class="order-recap-thumb" style="background-image:url('${it.image}')"></div>
        <div class="order-recap-line-info">
          <h4>${it.title}</h4>
          <span>${it.category} · ${it.durationHours}h</span>
        </div>
        <div>${formatPriceR3(it.price)}</div>
      </div>
    `
      )
      .join("");
    document.getElementById("order-recap-total").innerHTML = `
      <span>Paid</span><span>${formatPriceR3(order.total)}</span>
    `;

    const firstCourseId = order.items[0] && order.items[0].id;
    if (firstCourseId) {
      document.getElementById("start-learning-btn").href = `course-player.html?id=${encodeURIComponent(firstCourseId)}`;
      document.getElementById("start-learning-btn").textContent =
        order.items.length > 1 ? "Start your first course" : "Start learning";
    }
  }

  launchConfetti(document.getElementById("confetti-canvas"));
}

document.addEventListener("DOMContentLoaded", initOrderSuccess);
