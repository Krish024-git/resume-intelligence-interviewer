"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingEffect({
  text,
  speed = 30,
  className,
  onComplete,
}: TypingEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-0.5 inline-block h-4 w-0.5 bg-primary align-middle"
        />
      )}
    </motion.span>
  );
}
