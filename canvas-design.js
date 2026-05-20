const palette = {
  ink: "#f5f5f5",
  dark: "#0a0a0a",
  panel: "#111111",
  red: "#ef4444",
  crimson: "#b91c1c",
  orange: "#f97316",
  amber: "#f59e0b",
  gold: "#d4a017",
  yellow: "#eab308",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  gray: "#6b7280",
  muted: "#888888",
  warm: "#fbbf24",
};

function scaleCanvas(canvas, logicalWidth, logicalHeight) {
  const ratio = window.devicePixelRatio || 1;
  const w = Math.round(logicalWidth * ratio);
  const h = Math.round(logicalHeight * ratio);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawMojoLogo(ctx, x, y, size, variant) {
  const unit = size / 72;
  ctx.save();
  ctx.translate(x, y);

  const cx = 36 * unit;
  const cy = 36 * unit;
  const radius = 34 * unit;

  // Spotlight / glow background
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  glow.addColorStop(0, palette.amber);
  glow.addColorStop(0.3, palette.orange);
  glow.addColorStop(0.7, palette.dark);
  glow.addColorStop(1, palette.dark);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = palette.dark;
  ctx.fill();

  // Outer decorative ring
  const grad = ctx.createLinearGradient(0, 0, 72 * unit, 72 * unit);
  grad.addColorStop(0, palette.amber);
  grad.addColorStop(0.5, palette.gold);
  grad.addColorStop(1, palette.orange);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5 * unit;
  ctx.stroke();

  // Microphone silhouette (simplified)
  const micX = cx;
  const micY = cy - 2 * unit;

  // Mic head (circle)
  const headGrad = ctx.createRadialGradient(micX - 2 * unit, micY - 3 * unit, 0, micX, micY, 12 * unit);
  headGrad.addColorStop(0, palette.gold);
  headGrad.addColorStop(1, palette.orange);
  ctx.beginPath();
  ctx.arc(micX, micY - 5 * unit, 10 * unit, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.fill();

  // Mic grille lines
  ctx.strokeStyle = palette.dark;
  ctx.lineWidth = 0.8 * unit;
  ctx.globalAlpha = 0.3;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(micX, micY - 5 * unit, 7 * unit, Math.PI * 0.1 * i - 0.3, Math.PI * 0.1 * i + 0.3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Mic neck
  ctx.beginPath();
  ctx.moveTo(micX - 3 * unit, micY + 5 * unit);
  ctx.lineTo(micX + 3 * unit, micY + 5 * unit);
  ctx.lineTo(micX + 2 * unit, micY + 18 * unit);
  ctx.lineTo(micX - 2 * unit, micY + 18 * unit);
  ctx.closePath();
  ctx.fillStyle = palette.gray;
  ctx.fill();

  // Mic stand base
  ctx.beginPath();
  ctx.arc(micX, micY + 22 * unit, 6 * unit, 0, Math.PI * 2);
  ctx.fillStyle = palette.gray;
  ctx.fill();

  // "M" letter in mic body
  if (variant === "hero") {
    ctx.fillStyle = palette.ink;
    ctx.font = `bold ${9 * unit}px "Inter", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", micX, micY + 12 * unit);
  }

  // Stage light rays
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * 34 * unit, cy + Math.sin(angle) * 34 * unit);
    ctx.strokeStyle = i % 2 === 0 ? palette.amber : palette.gold;
    ctx.lineWidth = 1.5 * unit;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Small accent stars
  const starPositions = [
    { angle: 0.3, dist: 28, color: palette.amber },
    { angle: 2.5, dist: 30, color: palette.gold },
    { angle: 4.2, dist: 26, color: palette.warm },
    { angle: 5.8, dist: 29, color: palette.amber },
  ];
  starPositions.forEach(({ angle, dist, color }) => {
    const sx = cx + Math.cos(angle) * dist * unit;
    const sy = cy + Math.sin(angle) * dist * unit;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8 * unit, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sx, sy, 3.5 * unit, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 0.8 * unit;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  ctx.restore();
}

function drawBrandLogo() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 22, 22);
  ctx.clearRect(0, 0, 22, 22);
  drawMojoLogo(ctx, 0, 0, 22, "brand");
}

function drawBrandLogoFooter() {
  const canvas = document.getElementById("brand-canvas-footer");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 20, 20);
  ctx.clearRect(0, 0, 20, 20);
  drawMojoLogo(ctx, 0, 0, 20, "brand");
}

function drawHeroLogo() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 96, 96);
  ctx.clearRect(0, 0, 96, 96);
  drawMojoLogo(ctx, 0, 0, 96, "hero");
}

function installCanvasFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  drawMojoLogo(ctx, 0, 0, 72, "brand");

  const link = document.querySelector("link[rel='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = canvas.toDataURL("image/png");
  document.head.appendChild(link);
}

function drawAll() {
  drawBrandLogo();
  drawBrandLogoFooter();
  drawHeroLogo();
}

function initCanvas() {
  drawAll();
  installCanvasFavicon();
}

function safeInit() {
  const brandCanvas = document.getElementById("brand-canvas");
  if (brandCanvas && brandCanvas.getContext) {
    initCanvas();
  } else {
    requestAnimationFrame(safeInit);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInit);
} else {
  safeInit();
}
