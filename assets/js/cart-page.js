function formatPriceR(price) {
  return price === 0 ? "Free" : `R${price}`;
}

async function initCartPage() {
  let allCourses = [];
  try {
    const res = await fetch("data/courses.json");
    allCourses = await res.json();
  } catch (err) {
    console.warn("Could not load data/courses.json — serve this site over a local server.", err);
    return;
  }

  render(allCourses);
}

function render(allCourses) {
  const cart = getCart();
  const items = cart
    .map((id) => allCourses.find((c) => c.id === id))
    .filter(Boolean);

  const itemsEl = document.getElementById("cart-items");
  const emptyEl = document.getElementById("empty-cart");
  const summaryEl = document.getElementById("cart-summary");

  if (items.length === 0) {
    itemsEl.innerHTML = "";
    emptyEl.hidden = false;
    summaryEl.style.display = "none";
    return;
  }

  emptyEl.hidden = true;
  summaryEl.style.display = "block";

  itemsEl.innerHTML = items
    .map(
      (c) => `
    <div class="cart-item" data-id="${c.id}">
      <div class="cart-item-thumb" style="background-image:url('${c.image}')"></div>
      <div class="cart-item-info">
        <h3>${c.title}</h3>
        <div class="meta">${c.category} · ${c.level} · ${c.durationHours}h · ${c.instructor}</div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">${formatPriceR(c.price)}</div>
        <button class="remove-item-btn" data-id="${c.id}" type="button">Remove</button>
      </div>
    </div>
  `
    )
    .join("");

  const subtotal = items.reduce((sum, c) => sum + c.price, 0);
  document.getElementById("summary-count").textContent =
    items.length === 1 ? "1 course" : `${items.length} courses`;
  document.getElementById("summary-subtotal").textContent = formatPriceR(subtotal);
  document.getElementById("summary-total").textContent = formatPriceR(subtotal);

  itemsEl.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".cart-item");
      row.style.transition = "opacity .25s ease, transform .25s ease";
      row.style.opacity = "0";
      row.style.transform = "translateX(12px)";
      setTimeout(() => {
        removeFromCart(btn.dataset.id);
        showToast("Removed from cart", "The course was removed.", "success");
        render(allCourses);
      }, 200);
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => (window.location.href = "checkout.html");
  }
}

document.addEventListener("DOMContentLoaded", initCartPage);
