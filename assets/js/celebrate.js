/*
  Small dependency-free confetti burst for the site's two "moment" screens:
  order-success.html (Peak) and course-complete.html (End).
  Respects prefers-reduced-motion, same convention as app.js.
*/

function launchConfetti(targetCanvas, opts) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = targetCanvas || document.getElementById("confetti-canvas");
  if (!canvas) return;

  const colors = (opts && opts.colors) || ["#C9A227", "#0033A0", "#A6192E", "#041E42", "#FFFFFF"];
  const count = reduced ? 0 : (opts && opts.count) || 140;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  if (reduced || count === 0) return;

  const ctx = canvas.getContext("2d");
  const pieces = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vRot: (Math.random() - 0.5) * 0.3,
    vy: 2.5 + Math.random() * 3.5,
    vx: (Math.random() - 0.5) * 2.2,
    life: 0,
    maxLife: 170 + Math.random() * 90,
  }));

  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((p) => {
      if (p.life > p.maxLife) return;
      alive = true;
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;
      const fade = p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1;
      ctx.save();
      ctx.globalAlpha = Math.max(fade, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive && frame < 400) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(tick);
}
