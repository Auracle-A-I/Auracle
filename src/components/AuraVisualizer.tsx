import { useEffect, useRef } from "react";
import { AuraData } from "@/lib/aura-logic";

interface Props {
  data: AuraData | null;
  stage: number;
}

interface Particle {
  orbitRadius: number;
  angle: number;
  speed: number;
  size: number;
  hue: "inner" | "outer";
  tilt: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgba(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

export function AuraVisualizer({ data, stage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let time = 0;

    const resize = () => {
      const p = canvas.parentElement;
      if (p) { canvas.width = p.clientWidth; canvas.height = p.clientHeight; }
    };
    window.addEventListener("resize", resize);
    resize();

    const innerColor = data?.innerHueHex ?? "#ffffff";
    const outerColor = data?.outerHueHex ?? "#aabbff";

    // Build particle field — created once, animated continuously
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      const isInner = i < 40;
      particles.push({
        orbitRadius: isInner
          ? 0.55 + Math.random() * 0.25
          : 0.85 + Math.random() * 0.35,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.006 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 2.2 + 0.6,
        hue: isInner ? "inner" : "outer",
        tilt: Math.random() * 0.4 + 0.6,
      });
    }

    const drawRing = (
      radius: number,
      rot: number,
      thickness: number,
      color: string,
      alpha: number,
      dashes: number[] = []
    ) => {
      ctx.save();
      ctx.rotate(rot);
      if (dashes.length) ctx.setLineDash(dashes);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = thickness;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    const drawCloud = (
      offX: number,
      offY: number,
      radius: number,
      color: string,
      alpha: number
    ) => {
      const grad = ctx.createRadialGradient(offX, offY, 0, offX, offY, radius);
      grad.addColorStop(0, rgba(color, alpha));
      grad.addColorStop(0.45, rgba(color, alpha * 0.5));
      grad.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(offX, offY, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (stage === 0) {
        raf = requestAnimationFrame(render);
        return;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const base = Math.min(cx, cy) * 0.32;

      ctx.save();
      ctx.translate(cx, cy);

      const s = Math.min(stage, 16);

      // --------------------------------------------------
      // LAYER: outer nebula backdrop (stage 9+)
      // --------------------------------------------------
      if (s >= 9) {
        const t = Math.min(1, (s - 8) / 4);
        const rot = time * 0.12;
        ctx.save();
        ctx.rotate(rot);
        drawCloud(base * 0.6, base * 0.3, base * 2.2, outerColor, t * 0.18);
        drawCloud(-base * 0.5, -base * 0.4, base * 1.8, outerColor, t * 0.14);
        ctx.restore();
      }

      // --------------------------------------------------
      // LAYER: inner nebula cloud (stage 5+)
      // --------------------------------------------------
      if (s >= 5) {
        const t = Math.min(1, (s - 4) / 4);
        const rot = -time * 0.09;
        ctx.save();
        ctx.rotate(rot);
        drawCloud(0, 0, base * 1.4, innerColor, t * 0.3);
        drawCloud(base * 0.2, -base * 0.15, base * 0.9, innerColor, t * 0.2);
        ctx.restore();
      }

      // --------------------------------------------------
      // LAYER: outermost ring (stage 12+)
      // --------------------------------------------------
      if (s >= 12) {
        const t = Math.min(1, (s - 11) / 2);
        drawRing(base * 1.9, -time * 0.18, 1.2, outerColor, t * 0.55, [8, 12]);
        drawRing(base * 1.75, time * 0.22, 0.7, outerColor, t * 0.35, [4, 18]);
      }

      // --------------------------------------------------
      // LAYER: mid ring (stage 8+)
      // --------------------------------------------------
      if (s >= 8) {
        const t = Math.min(1, (s - 7) / 2);
        drawRing(base * 1.35, time * 0.28, 1.8, innerColor, t * 0.6);
        drawRing(base * 1.45, -time * 0.15, 0.8, outerColor, t * 0.3, [6, 10]);
      }

      // --------------------------------------------------
      // LAYER: inner ring (stage 6+)
      // --------------------------------------------------
      if (s >= 6) {
        const t = Math.min(1, (s - 5) / 2);
        drawRing(base * 0.95, -time * 0.35, 2.5, innerColor, t * 0.7);
      }

      // --------------------------------------------------
      // LAYER: orbital particles (stage 13+)
      // --------------------------------------------------
      if (s >= 13) {
        const t = Math.min(1, (s - 12) / 3);
        const activeCount = Math.floor(t * particles.length);
        for (let i = 0; i < activeCount; i++) {
          const p = particles[i];
          p.angle += p.speed;
          const r = p.orbitRadius * base * 1.5;
          const px = Math.cos(p.angle) * r;
          const py = Math.sin(p.angle) * r * p.tilt;
          const color = p.hue === "inner" ? innerColor : outerColor;
          const alpha = t * (0.5 + 0.5 * Math.sin(p.angle * 3 + time * 2));
          ctx.fillStyle = rgba(color, alpha);
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // --------------------------------------------------
      // LAYER: core sphere with inner hue glow (stage 1+)
      // --------------------------------------------------
      const coreT = Math.min(1, s / 4);
      const coreR = base * 0.28 * coreT;
      const pulse = 1 + 0.06 * Math.sin(time * 2.5);

      if (s >= 3) {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR * 3.5 * pulse);
        grad.addColorStop(0, rgba(innerColor, 0.9));
        grad.addColorStop(0.3, rgba(innerColor, 0.5));
        grad.addColorStop(0.7, rgba(innerColor, 0.1));
        grad.addColorStop(1, rgba(innerColor, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, coreR * 3.5 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // White hot center
      ctx.shadowColor = innerColor;
      ctx.shadowBlur = 40;
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR * pulse);
      coreGrad.addColorStop(0, "rgba(255,255,255,1)");
      coreGrad.addColorStop(0.4, rgba(innerColor, 0.9));
      coreGrad.addColorStop(1, rgba(innerColor, 0));
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coreR * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tiny star-bright center point
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, coreR * 0.25 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [data, stage]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
