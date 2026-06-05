"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface VoiceAssistantProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export function VoiceAssistant({ text, autoPlay = false, onStart, onEnd }: VoiceAssistantProps) {
  const { voices, speaking, speak, pause, resume, rate, setRate, voice, setVoice, cancel } = useTextToSpeech();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (voices.length && !selected) {
      setSelected(voices[0].name);
      setVoice(voices[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voices]);

  useEffect(() => {
    if (autoPlay && text) {
      speak(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, text]);

  function handlePlay() {
    speak(text, { rate, voice: voice ?? undefined });
    onStart && onStart();
  }

  function handlePause() {
    pause();
  }

  function handleResume() {
    resume();
  }

  function handleReplay() {
    cancel();
    speak(text, { rate, voice: voice ?? undefined });
  }

  return (
    <div className="glass p-4 rounded-xl flex items-center gap-4">
      <div>
        <div className="text-sm font-medium">AI Voice Assistant</div>
        <div className="text-xs text-muted-foreground">Reads questions aloud</div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            const v = voices.find((x) => x.name === e.target.value);
            if (v) setVoice(v);
          }}
          className="bg-transparent border rounded px-2 py-1 text-xs"
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />

        {!speaking ? (
          <button onClick={handlePlay} className="btn">
            <Play />
          </button>
        ) : (
          <button onClick={handlePause} className="btn">
            <Pause />
          </button>
        )}

        <button onClick={handleReplay} className="btn">
          <Repeat />
        </button>
      </div>
    </div>
  );
}
