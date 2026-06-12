import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Landing } from "@/components/Landing";
import { Pipeline } from "@/components/Pipeline";
import { FinalReveal } from "@/components/FinalReveal";
import { computeAura, AuraData } from "@/lib/aura-logic";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient();

type AppState = "landing" | "pipeline" | "reveal";

function AuraEngine() {
  const [state, setState] = useState<AppState>("landing");
  const [data, setData] = useState<AuraData | null>(null);

  const handleStart = (date: Date) => {
    const auraData = computeAura(date);
    setData(auraData);
    setState("pipeline");

    pendo.track("aura_reading_started", {
      birth_month: date.getMonth() + 1,
      birth_year: date.getFullYear(),
      zodiac_sign: auraData.zodiacSign,
      zodiac_element: auraData.zodiacElement,
      zodiac_modality: auraData.zodiacModality,
      birthstone: auraData.birthstone,
    });
  };

  const handleComplete = () => {
    setState("reveal");

    if (data) {
      pendo.track("aura_revealed", {
        zodiac_sign: data.zodiacSign,
        zodiac_element: data.zodiacElement,
        zodiac_modality: data.zodiacModality,
        birthstone: data.birthstone,
        inner_hue_name: data.innerHueName,
        inner_hue_hex: data.innerHueHex,
        outer_hue_name: data.outerHueName,
        outer_hue_hex: data.outerHueHex,
        temporal_signature: data.temporalSignature,
        permeability: data.permeability,
        minutes_alive: data.minutesAlive,
      });
    }
  };

  const handleReset = () => {
    if (data) {
      pendo.track("new_scan_initiated", {
        previous_zodiac_sign: data.zodiacSign,
        previous_zodiac_element: data.zodiacElement,
        previous_zodiac_modality: data.zodiacModality,
        previous_inner_hue_name: data.innerHueName,
        previous_outer_hue_name: data.outerHueName,
        previous_birthstone: data.birthstone,
      });
    }

    setState("landing");
    setData(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence mode="wait">
        {state === "landing" && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <Landing onStart={handleStart} />
          </motion.div>
        )}
        
        {state === "pipeline" && data && (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            <Pipeline data={data} onComplete={handleComplete} />
          </motion.div>
        )}

        {state === "reveal" && data && (
          <motion.div 
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <FinalReveal data={data} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuraEngine />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
