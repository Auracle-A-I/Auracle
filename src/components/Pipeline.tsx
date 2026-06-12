import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuraData } from "@/lib/aura-logic";
import { AuraVisualizer } from "./AuraVisualizer";
import { format } from "date-fns";

interface PipelineProps {
  data: AuraData;
  onComplete: () => void;
}

const STAGES = [
  "Birth Date Acquired",
  "Zodiac Detected",
  "Zodiac Element Identified",
  "Zodiac Modality Identified",
  "Birthstone Detected",
  "Birthstone Properties Loaded",
  "Trait Matrix Generated",
  "Spectrum Coordinates Calculated",
  "Inner Hue Generated",
  "Minutes Alive Calculated",
  "Temporal Signature Generated",
  "Outer Hue Generated",
  "Aura Permeability Calculated",
  "Aura Collision Engine Activated",
  "Final Aura Generated",
  "Aurascope Complete",
];

const PROCESSING_MSGS = [
  "SCANNING...",
  "COMPUTING...",
  "RESOLVING...",
  "CALIBRATING...",
  "ENCODING...",
  "VERIFYING...",
  "ANALYZING...",
  "CONVERGING...",
];

const STAGE_DURATIONS = [700,900,800,850,750,1000,950,900,1100,1050,800,900,850,1100,900,600];

function getNodeInfo(idx: number, data: AuraData) {
  switch (idx) {
    case 0:  return { desc: "Initial temporal seed established from the subject's point of entry into the material plane.", input: "Raw Date Input", output: format(data.birthDate, "MMMM d, yyyy") };
    case 1:  return { desc: "Astrological placement resolved by cross-referencing the celestial calendar at time of birth.", input: "Date → Celestial Map", output: data.zodiacSign };
    case 2:  return { desc: "Elemental resonance frequency determined from the sign's classical correspondence.", input: data.zodiacSign, output: `${data.zodiacElement} (${data.zodiacElement === 'Fire' ? '0–30°' : data.zodiacElement === 'Earth' ? '80–140°' : data.zodiacElement === 'Air' ? '180–220°' : '250–290°'} hue band)` };
    case 3:  return { desc: "Energy modality locked — describes how the subject initiates, sustains, or transforms energetic patterns.", input: data.zodiacSign, output: data.zodiacModality };
    case 4:  return { desc: "Crystalline affinity detected from the month of birth via gemstone resonance table.", input: `Month ${data.birthDate.getMonth() + 1}`, output: data.birthstone };
    case 5:  return { desc: "Optical and vibrational properties of the birthstone loaded into the refractive matrix.", input: data.birthstone, output: "Resonance matrix active" };
    case 6:  return { desc: "Core character vectors assembled by intersecting element and modality axes.", input: `${data.zodiacElement} × ${data.zodiacModality}`, output: "12-dimensional trait vector" };
    case 7:  return { desc: "Vector coordinates projected onto the visible light spectrum for chromatic encoding.", input: "Trait vector", output: "Spectrum coordinates (H,S,L)" };
    case 8:  return { desc: "Primary aura core energy manifested as a specific hue from the elemental band.", input: "Spectrum coordinates", output: `${data.innerHueName} — ${data.innerHueHex}` };
    case 9:  return { desc: "Temporal magnitude calculated as total minutes elapsed since the moment of birth.", input: `Birth → ${format(new Date(), "yyyy-MM-dd")}`, output: `${data.minutesAlive} minutes` };
    case 10: return { desc: "Unique existence string forged by combining temporal magnitude with astrological anchors.", input: `${data.minutesAlive} × birth constants`, output: data.temporalSignature };
    case 11: return { desc: "Secondary boundary energy derived from modality-shifted hue on the chromatic wheel.", input: `${data.zodiacModality} shift from ${data.innerHueName}`, output: `${data.outerHueName} — ${data.outerHueHex}` };
    case 12: return { desc: "Boundary permeability defines how openly the aura field interacts with external energies.", input: `Day ${data.birthDate.getDate()} × Month ${data.birthDate.getMonth() + 1}`, output: data.permeability };
    case 13: return { desc: "Particle physics layer activated — the aura field begins manifesting as orbital energy bodies.", input: "Inner + Outer hues", output: "Orbital particle field active" };
    case 14: return { desc: "All computed variables synthesized into a final coherent aura signature pattern.", input: "All 13 prior variables", output: "Aura pattern locked" };
    case 15: return { desc: "The Aurascope synthesis is complete. The subject's full aura field has been successfully rendered.", input: "Complete aura pattern", output: "READY FOR DISPLAY" };
    default: return { desc: "", input: "", output: "" };
  }
}

export function Pipeline({ data, onComplete }: PipelineProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [procMsg, setProcMsg] = useState(PROCESSING_MSGS[0]);
  const procRef = useRef(0);

  useEffect(() => {
    if (currentStage >= STAGES.length) {
      pendo.track("aura_processing_completed", {
        zodiac_sign: data.zodiacSign,
        zodiac_element: data.zodiacElement,
        zodiac_modality: data.zodiacModality,
        inner_hue_name: data.innerHueName,
        inner_hue_hex: data.innerHueHex,
        outer_hue_name: data.outerHueName,
        outer_hue_hex: data.outerHueHex,
        total_stages_completed: STAGES.length,
      });
      setTimeout(onComplete, 1800);
      return;
    }
    const dur = STAGE_DURATIONS[currentStage] ?? 900;
    const timer = setTimeout(() => setCurrentStage(s => s + 1), dur);
    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  useEffect(() => {
    const iv = setInterval(() => {
      procRef.current = (procRef.current + 1) % PROCESSING_MSGS.length;
      setProcMsg(PROCESSING_MSGS[procRef.current]);
    }, 320);
    return () => clearInterval(iv);
  }, []);

  const info = selectedNode !== null ? getNodeInfo(selectedNode, data) : null;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-background">

      {/* ── LEFT: Pipeline ── */}
      <div className="w-full md:w-[340px] shrink-0 border-b md:border-b-0 md:border-r border-white/5 flex flex-col overflow-y-auto h-[52vh] md:h-screen">
        <div className="sticky top-0 z-10 px-6 pt-6 pb-3 bg-background/90 backdrop-blur-sm border-b border-white/5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">Engine Status</p>
          <div className="mt-1 font-mono text-xs text-white/50">
            {currentStage < STAGES.length
              ? <span className="text-white/70">{procMsg}</span>
              : <span className="text-emerald-400/80">SYNTHESIS COMPLETE</span>}
          </div>
        </div>

        <div className="flex-1 px-6 py-4 relative">
          {/* Connector track */}
          <div className="absolute left-[29px] top-6 bottom-6 w-px bg-white/5" />

          {/* Progress fill */}
          <motion.div
            className="absolute left-[29px] w-px bg-white/40"
            style={{ top: 24, originY: 0 }}
            initial={{ height: 0 }}
            animate={{ height: `${(Math.min(currentStage, STAGES.length - 1) / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <div className="space-y-0">
            {STAGES.map((name, idx) => {
              const isComplete = idx < currentStage;
              const isActive   = idx === currentStage && currentStage < STAGES.length;
              const isPending  = idx > currentStage;

              return (
                <div key={idx} className="flex items-start gap-4 py-3 relative">
                  {/* Node dot */}
                  <div className="relative shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white/60"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    {isActive && (
                      <svg className="absolute inset-0 w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                        <motion.circle
                          cx="10" cy="10" r="8"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeDasharray="50.27"
                          animate={{ strokeDashoffset: [50, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        />
                      </svg>
                    )}
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                        isComplete
                          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                          : isActive
                          ? "bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                          : "bg-white/10 border border-white/10"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <button
                    onClick={() => {
                      if (isComplete) {
                        const nodeInfo = getNodeInfo(idx, data);
                        pendo.track("pipeline_node_inspected", {
                          node_index: idx,
                          node_name: STAGES[idx],
                          node_input: String(nodeInfo.input).substring(0, 64),
                          node_output: String(nodeInfo.output).substring(0, 64),
                        });
                        setSelectedNode(idx);
                      }
                    }}
                    disabled={!isComplete}
                    className={`text-left transition-all duration-400 group ${
                      isComplete
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    <div className={`font-mono text-[9px] uppercase tracking-[0.2em] mb-0.5 transition-colors ${
                      isComplete ? "text-white/35 group-hover:text-white/55" : isPending ? "text-white/15" : "text-white/40"
                    }`}>
                      {`SYS-${(idx + 1).toString().padStart(2, "0")}`}
                    </div>
                    <div className={`font-serif text-sm leading-snug transition-colors ${
                      isComplete
                        ? "text-white/85 group-hover:text-white"
                        : isActive
                        ? "text-white/70"
                        : "text-white/20"
                    }`}>
                      {name}
                    </div>
                    {isComplete && (
                      <div className="mt-0.5 font-mono text-[9px] text-white/25 group-hover:text-white/40 transition-colors">
                        TAP TO INSPECT →
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Visualizer ── */}
      <div className="flex-1 h-[48vh] md:h-screen relative overflow-hidden">
        <AuraVisualizer data={data} stage={currentStage} />

        {/* Stage progress overlay */}
        <div className="absolute top-6 right-6 font-mono text-xs text-white/20 tabular-nums">
          {Math.min(currentStage, 16).toString().padStart(2, "0")}&nbsp;/&nbsp;16
        </div>

        {/* Processing label bottom */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="px-5 py-2 rounded-full font-mono text-xs tracking-widest text-white/60"
              style={{
                background: "rgba(10,10,15,0.6)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
              }}
            >
              {currentStage < STAGES.length
                ? `[ ${STAGES[currentStage].toUpperCase()} ]`
                : "[ SYNTHESIS COMPLETE ]"}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Node Inspector Panel ── */}
      <AnimatePresence>
        {selectedNode !== null && info && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,10,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="max-w-md w-full rounded-2xl p-7 relative"
              style={{
                background: "rgba(12,12,20,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 hover:bg-white/5 transition-all font-mono text-sm"
              >
                ✕
              </button>

              <div className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase mb-1">
                SYS-{(selectedNode + 1).toString().padStart(2, "0")} · Memory Dump
              </div>
              <h3 className="font-serif text-xl text-white mb-4 leading-snug">
                {STAGES[selectedNode]}
              </h3>
              <p className="font-mono text-xs text-white/50 leading-relaxed mb-6">
                {info.desc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-2">Input</div>
                  <div className="font-mono text-xs text-white/80 leading-relaxed">{info.input}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-2">Output</div>
                  <div className="font-mono text-xs text-white/80 leading-relaxed">{info.output}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
