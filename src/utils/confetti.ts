// Lightweight, high-performance, zero-dependency HTML5 Canvas Confetti Engine

interface ConfettiOptions {
  durationMs?: number;
  particleCount?: number;
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

export function triggerConfetti(options: ConfettiOptions = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const durationMs = options.durationMs || 3000;
  const particleCount = options.particleCount || 120;
  const colors = options.colors || [
    "#3B82F6", // blue
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EC4899", // pink
    "#8B5CF6", // purple
    "#EF4444", // red
    "#06B6D4", // cyan
    "#FBBF24", // gold
  ];

  // Create canvas element
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  // Generate particles
  const particles: Particle[] = [];
  for (let i = 0; i < particleCount; i++) {
    // Launch from top-middle or burst across screen
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height * 0.35 + (Math.random() - 0.5) * 80,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    });
  }

  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    const progress = elapsed / durationMs;

    if (progress >= 1) {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress * 1.1);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
