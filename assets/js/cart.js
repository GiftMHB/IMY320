

const CART_KEY = "codecampus_cart";
const ENROLL_KEY = "codecampus_enrollments";
const ORDERS_KEY = "codecampus_orders";
const LAST_ORDER_KEY = "codecampus_last_order_id";

/* ---------------- per-user keys ---------------- */


function currentUserEmail() {
  try {
    const user = JSON.parse(localStorage.getItem("codecampus_current_user"));
    return user && user.email ? user.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

function userKey(base) {
  return `${base}:${currentUserEmail() || "guest"}`;
}

/* ---------------- cart ---------------- */

function getCart() {
  return JSON.parse(localStorage.getItem(userKey(CART_KEY)) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(userKey(CART_KEY), JSON.stringify(cart));
  updateCartBadge();
}

function isInCart(courseId) {
  return getCart().includes(courseId);
}

function addToCart(courseId) {
  const cart = getCart();
  if (cart.includes(courseId)) return false;
  cart.push(courseId);
  saveCart(cart);
  return true;
}

function removeFromCart(courseId) {
  saveCart(getCart().filter((id) => id !== courseId));
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().length;
}

/* ---------------- enrollments / progress ---------------- */

function getEnrollments() {
  return JSON.parse(localStorage.getItem(userKey(ENROLL_KEY)) || "{}");
}

function saveEnrollments(enrollments) {
  localStorage.setItem(userKey(ENROLL_KEY), JSON.stringify(enrollments));
}

function isEnrolled(courseId) {
  return Boolean(getEnrollments()[courseId]);
}

function enrollCourse(courseId) {
  const enrollments = getEnrollments();
  if (!enrollments[courseId]) {
    enrollments[courseId] = {
      enrolledAt: Date.now(),
      completedLessons: [],
      completed: false,
      completedAt: null,
      review: null, // Person 3: { rating: 1-5, comment: "...", reviewedAt: Date.now() }
    };
    saveEnrollments(enrollments);
  }
  return enrollments[courseId];
}

function getProgress(courseId) {
  return getEnrollments()[courseId] || null;
}

function toggleLessonComplete(courseId, lessonKey, totalLessons) {
  const enrollments = getEnrollments();
  const record = enrollments[courseId];
  if (!record) return null;

  const idx = record.completedLessons.indexOf(lessonKey);
  if (idx === -1) {
    record.completedLessons.push(lessonKey);
  } else {
    record.completedLessons.splice(idx, 1);
  }

  const justCompleted =
    !record.completed && record.completedLessons.length >= totalLessons;

  if (justCompleted) {
    record.completed = true;
    record.completedAt = Date.now();
  } else if (record.completedLessons.length < totalLessons) {
    record.completed = false;
    record.completedAt = null;
  }

  saveEnrollments(enrollments);
  return { record, justCompleted };
}

/* ---------------- orders ---------------- */

function getOrders() {
  return JSON.parse(localStorage.getItem(userKey(ORDERS_KEY)) || "[]");
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(userKey(ORDERS_KEY), JSON.stringify(orders));
  localStorage.setItem(userKey(LAST_ORDER_KEY), order.id);
  return order;
}

function getLastOrderId() {
  return localStorage.getItem(userKey(LAST_ORDER_KEY));
}

function getOrder(orderId) {
  return getOrders().find((o) => o.id === orderId) || null;
}

function makeOrderId() {
  return (
    "CC-" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    Math.floor(Math.random() * 900 + 100)
  );
}

/* ---------------- header badge ---------------- */

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = String(n);
  badge.style.display = n > 0 ? "flex" : "none";
}