function formatPriceR2(price) {
  return price === 0 ? "Free" : `R${price}`;
}

function fieldErr(fieldEl, message) {
  fieldEl.classList.toggle("has-error", Boolean(message));
  const err = fieldEl.querySelector(".field-error");
  if (err) err.textContent = message || "";
}

let checkoutCourses = [];

async function initCheckout() {
  let allCourses = [];
  try {
    const res = await fetch("data/courses.json");
    allCourses = await res.json();
  } catch (err) {
    console.warn("Could not load data/courses.json — serve this site over a local server.", err);
    return;
  }

  const cart = getCart();
  checkoutCourses = cart.map((id) => allCourses.find((c) => c.id === id)).filter(Boolean);

  if (checkoutCourses.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  renderSummary();
  prefillContact();
  bindForm();
}

function prefillContact() {
  const user = JSON.parse(localStorage.getItem("codecampus_current_user") || "null");
  if (!user) return;
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
}

function renderSummary() {
  const itemsEl = document.getElementById("order-items");
  itemsEl.innerHTML = checkoutCourses
    .map((c) => `<div class="order-line"><span>${c.title}</span><span>${formatPriceR2(c.price)}</span></div>`)
    .join("");
  const total = checkoutCourses.reduce((sum, c) => sum + c.price, 0);
  document.getElementById("order-total").textContent = formatPriceR2(total);
}

function bindForm() {
  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameField = document.getElementById("name-field");
    const emailField = document.getElementById("email-field");
    const cardField = document.getElementById("card-field");
    const expiryField = document.getElementById("expiry-field");
    const cvvField = document.getElementById("cvv-field");
    [nameField, emailField, cardField, expiryField, cvvField].forEach((f) => fieldErr(f, ""));

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const card = form.card.value.replace(/\s/g, "");
    const expiry = form.expiry.value.trim();
    const cvv = form.cvv.value.trim();

    let hasError = false;
    if (name.length < 2) { fieldErr(nameField, "Enter your full name."); hasError = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldErr(emailField, "Enter a valid email."); hasError = true; }
    if (!/^\d{13,19}$/.test(card)) { fieldErr(cardField, "Enter a valid card number."); hasError = true; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { fieldErr(expiryField, "MM/YY"); hasError = true; }
    if (!/^\d{3}$/.test(cvv)) { fieldErr(cvvField, "3 digits"); hasError = true; }
    if (hasError) return;

    const btn = document.getElementById("pay-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Processing payment…";

    setTimeout(() => {
      const order = {
        id: makeOrderId(),
        date: Date.now(),
        items: checkoutCourses.map((c) => ({ id: c.id, title: c.title, price: c.price, image: c.image, durationHours: c.durationHours, category: c.category })),
        total: checkoutCourses.reduce((sum, c) => sum + c.price, 0),
        name,
        email,
      };

      checkoutCourses.forEach((c) => enrollCourse(c.id));
      saveOrder(order);
      clearCart();

      btn.textContent = originalText;
      btn.disabled = false;
      window.location.href = `order-success.html?order=${encodeURIComponent(order.id)}`;
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", initCheckout);
