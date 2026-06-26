"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, Users } from "lucide-react";
import { socialProof } from "@/config/social-proof.config";

export function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const messages = socialProof.ticker.messages;
  const onlineCount = socialProof.ticker.onlineCount;

  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!socialProof.enabled || messages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {onlineCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
          <Users size={11} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-bold text-blue-400">{onlineCount} members online</span>
          <Circle size={5} className="text-green-400 fill-green-400 animate-pulse ml-auto shrink-0" />
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/10 rounded-lg overflow-hidden">
        <Circle size={5} className="text-green-400 fill-green-400 shrink-0 animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-[10px] font-bold text-green-400 uppercase tracking-widest whitespace-nowrap"
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
