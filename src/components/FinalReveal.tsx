import { motion } from "framer-motion";
import { AuraData } from "@/lib/aura-logic";
import { AuraVisualizer } from "./AuraVisualizer";

interface FinalRevealProps {
  data: AuraData;
  onReset: () => void;
}

export function FinalReveal({ data, onReset }: FinalRevealProps) {
  const cards = [
    { label: "Inner Hue",           value: data.innerHueName,       hex: data.innerHueHex,  mono: true  },
    { label: "Temporal Signature",  value: data.temporalSignature,  hex: null,               mono: true  },
    { label: "Outer Hue",           value: data.outerHueName,       hex: data.outerHueHex,  mono: true  },
    { label: "Aura Permeability",   value: data.permeability,       hex: null,               mono: true  },
    { label: "Element · Modality",  value: `${data.zodiacElement} · ${data.zodiacModality}`, hex: null, mono: true },
    { label: "Final Aura",          value: data.description,        hex: null,               mono: false },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-6 pt-12 pb-16 overflow-x-hidden relative">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-center mb-10 z-10"
      >
        <p className="font-mono text-[10px] tracking-[0.35em] text-white/25 uppercase mb-3">
          Reading Complete
        </p>
        <h1
          className="font-serif text-4xl md:text-6xl tracking-[0.18em] uppercase"
          style={{ textShadow: "0 0 50px rgba(255,255,255,0.3)" }}
        >
          Aurascope Complete
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-4 mx-auto h-px w-48 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>

      {/* Main layout */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-10">

        {/* Aura sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="w-72 h-72 md:w-96 md:h-96 relative"
        >
          <AuraVisualizer data={data} stage={16} />
        </motion.div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {cards.map((card, i) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              hex={card.hex}
              mono={card.mono}
              delay={1.2 + i * 0.12}
              accentColor={card.hex ?? data.innerHueHex}
            />
          ))}
        </div>

        {/* Sign + birthstone ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex flex-wrap justify-center gap-6 font-mono text-xs text-white/25"
        >
          <span className="uppercase tracking-widest">{data.zodiacSign}</span>
          <span className="text-white/10">·</span>
          <span className="uppercase tracking-widest">{data.birthstone}</span>
          <span className="text-white/10">·</span>
          <span className="uppercase tracking-widest">{data.minutesAlive} min alive</span>
        </motion.div>

        {/* Reset */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6 }}
          onClick={onReset}
          className="font-mono text-xs uppercase tracking-[0.25em] text-white/20 hover:text-white/60 transition-colors border-b border-transparent hover:border-white/30 pb-0.5 mt-2"
        >
          Initiate New Scan
        </motion.button>
      </div>
    </div>
  );
}

function StatCard({
  label, value, hex, mono, delay, accentColor,
}: {
  label: string;
  value: string;
  hex: string | null;
  mono: boolean;
  delay: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background: "rgba(10,10,18,0.55)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${accentColor}25`,
        boxShadow: `0 4px 30px ${accentColor}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: accentColor, opacity: 0.12 }}
      />

      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2">
        {label}
      </div>

      <div className={`${mono ? "font-mono text-sm" : "font-serif text-sm leading-relaxed"} text-white/80`}>
        {value}
      </div>

      {hex && (
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }}
          />
          <span className="font-mono text-[10px] text-white/30">{hex.toUpperCase()}</span>
        </div>
      )}
    </motion.div>
  );
}
