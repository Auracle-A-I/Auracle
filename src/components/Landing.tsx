import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LandingProps {
  onStart: (date: Date) => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

// ── Starfield canvas ──────────────────────────────────────────────────
interface Star { x: number; y: number; r: number; o: number; v: number }

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const stars: Star[] = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      o: Math.random(),
      v: Math.random() * 0.008 + 0.003,
    }));

    let t = 0;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.o = 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.v * 60 + s.x * 100));
        ctx.fillStyle = `rgba(255,255,255,${s.o.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ── Select helper ─────────────────────────────────────────────────────
const selectBase =
  "w-full bg-white/4 border border-white/8 text-white/90 font-mono text-sm rounded-xl px-3 py-3 appearance-none cursor-pointer focus:outline-none focus:border-white/20 hover:border-white/14 hover:bg-white/6 transition-all";

function Select({
  value, onChange, placeholder, testId, children,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder: string;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1">
      <select
        data-testid={testId}
        className={selectBase}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-3 h-3 text-white/25" fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────────────
export function Landing({ onStart }: LandingProps) {
  const [month, setMonth] = useState<number | "">("");
  const [day,   setDay]   = useState<number | "">("");
  const [year,  setYear]  = useState<number | "">("");

  const daysInMonth = month !== "" && year !== "" ? getDaysInMonth(month as number, year as number) : 31;

  const isValid =
    month !== "" && day !== "" && year !== "" &&
    (day as number) >= 1 && (day as number) <= daysInMonth;

  function handleStart() {
    if (!isValid) return;
    onStart(new Date(year as number, month as number, day as number));
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <StarfieldCanvas />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-900/10 blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-lg w-full text-center">

        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 mb-5"
        >
          First Real-Time Aura Reading Engine
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="font-serif text-6xl md:text-8xl tracking-[0.12em] uppercase mb-3"
          style={{
            color: "white",
            textShadow: "0 0 40px rgba(255,255,255,0.35), 0 0 80px rgba(200,180,255,0.15)",
          }}
        >
          Auracle
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-mono text-xs text-white/35 tracking-widest mb-14"
        >
          Discover Your Aura Signature
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="w-full rounded-2xl p-8 flex flex-col gap-7"
          style={{
            background: "rgba(10,10,18,0.55)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30 text-left">
              Temporal Anchor — Birth Date
            </label>

            <div className="flex gap-2">
              <Select
                testId="select-month"
                value={month}
                onChange={v => { setMonth(v === "" ? "" : +v); setDay(""); }}
                placeholder="Month"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </Select>

              <Select
                testId="select-day"
                value={day}
                onChange={v => setDay(v === "" ? "" : +v)}
                placeholder="Day"
              >
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>

              <Select
                testId="select-year"
                value={year}
                onChange={v => { setYear(v === "" ? "" : +v); setDay(""); }}
                placeholder="Year"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          </div>

          <motion.button
            data-testid="button-begin-reading"
            disabled={!isValid}
            onClick={handleStart}
            whileHover={isValid ? { scale: 1.015 } : {}}
            whileTap={isValid ? { scale: 0.985 } : {}}
            className="w-full h-13 rounded-xl font-serif uppercase tracking-[0.18em] text-sm transition-all duration-300"
            style={
              isValid
                ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.92)",
                    boxShadow: "0 0 24px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }
                : {
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.22)",
                    cursor: "not-allowed",
                  }
            }
          >
            Begin Reading
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 font-mono text-[10px] text-white/15 tracking-widest"
        >
          NO DATA STORED · RUNS LOCALLY · UNIQUE TO YOU
        </motion.p>
      </div>
    </div>
  );
}
