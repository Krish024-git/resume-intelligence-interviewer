"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
// Use a lightweight inline SVG for the microphone icon to avoid runtime
// issues if the icon package is missing or tree-shaken incorrectly.
import { motion } from "framer-motion";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceRecorderProps {
  onTranscript?: (text: string, isFinal?: boolean) => void;
  autoFill?: boolean; // if true, caller should accept interim/final texts
  continuous?: boolean;
}

export function VoiceRecorder({ onTranscript, autoFill = true, continuous = false }: VoiceRecorderProps) {
  const { supported, listening, interim, error, start, stop, abort } = useSpeechRecognition();
  const [recordingStart, setRecordingStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!listening) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingStart(null);
      setElapsed(0);
    } else {
      setRecordingStart(Date.now());
      timerRef.current = window.setInterval(() => {
        if (recordingStart) setElapsed(Math.floor((Date.now() - recordingStart) / 1000));
      }, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  useEffect(() => {
    if (interim && onTranscript && autoFill) onTranscript(interim, false);
  }, [interim, onTranscript, autoFill]);

  function handleStart() {
    start((text, isFinal) => {
      if (onTranscript) onTranscript(text, isFinal);
      if (isFinal && !continuous) stop();
    }, { continuous });
  }

  function handleStop() {
    stop();
  }

  function handleAbort() {
    abort();
  }

  const micVariants = useMemo(
    () => ({
      idle: { scale: 1 },
      active: { scale: 1.12, boxShadow: "0 0 24px rgba(79,140,255,0.18)" },
    }),
    []
  );

  return (
    <div className="glass p-3 rounded-xl flex items-center gap-4">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={listening ? handleStop : handleStart}
          className={`h-12 w-12 rounded-full flex items-center justify-center ${listening ? "bg-primary/90" : "bg-card/10"}`}
          aria-label={listening ? "Stop recording" : "Start recording"}
        >
          <motion.span animate={listening ? "active" : "idle"} variants={micVariants}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              aria-hidden="true"
            >
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
              <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 5 5 0 0 0 4 4.9V19a1 1 0 1 0 2 0v-3.1A5 5 0 0 0 19 11z" />
            </svg>
          </motion.span>
        </motion.button>
        <div className="flex flex-col">
          <div className="text-sm font-medium">Voice Typing</div>
          <div className="text-xs text-muted-foreground">{supported ? (listening ? "Recording" : "Idle") : "Not supported"}</div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="text-xs text-muted-foreground">{new Date(elapsed * 1000).toISOString().substr(14, 5)}</div>
        <div className="text-xs text-muted-foreground">{error ?? ""}</div>
        {listening && (
          <button onClick={handleAbort} className="text-sm text-warning">Abort</button>
        )}
      </div>
    </div>
  );
}
