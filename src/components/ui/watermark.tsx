import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/atoms/userAtom";

interface WatermarkProps {
  isGlobal?: boolean;
}

export function DynamicWatermark({ isGlobal = false }: WatermarkProps) {
  const { user } = useUser();
  const [positions, setPositions] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    // Move every 8 seconds
    const interval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 80) + 10;
      const randomY = Math.floor(Math.random() * 80) + 10;
      setPositions({ x: `${randomX}%`, y: `${randomY}%` });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const displayId = user.email || user.fullName || 'Protected Viewer';

  return (
    <div className={`pointer-events-none ${isGlobal ? 'fixed' : 'absolute'} inset-0 z-50 overflow-hidden`}>
      <motion.div
        animate={{ left: positions.x, top: positions.y }}
        transition={{ duration: 7.5, ease: "linear" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 opacity-[0.15] text-white font-mono text-xs sm:text-sm select-none flex flex-col items-center drop-shadow-md mix-blend-difference"
      >
        <p className="tracking-widest whitespace-nowrap">{displayId}</p>
        <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1 whitespace-nowrap">RuralSpark Protected</p>
      </motion.div>
    </div>
  );
}
