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
    setData(computeAura(date));
    setState("pipeline");
  };

  const handleComplete = () => {
    setState("reveal");
  };

  const handleReset = () => {
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
