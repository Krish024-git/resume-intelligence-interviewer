import { useEffect, useRef, useState } from "react";

export function useTextToSpeech() {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!synth) return;
    const update = () => setVoices(synth.getVoices());
    update();
    synth.onvoiceschanged = update;
    return () => {
      try {
        synth.onvoiceschanged = null;
      } catch {}
    };
  }, [synth]);

  function speak(text: string, opts?: { rate?: number; voice?: SpeechSynthesisVoice }) {
    if (!synth) return;
    cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.rate = opts?.rate ?? rate;
    if (opts?.voice) ut.voice = opts.voice;
    else if (voice) ut.voice = voice;

    ut.onstart = () => setSpeaking(true);
    ut.onend = () => setSpeaking(false);
    ut.onerror = () => setSpeaking(false);

    utterRef.current = ut;
    synth.speak(ut);
  }

  function pause() {
    if (!synth) return;
    if (synth.speaking) synth.pause();
  }

  function resume() {
    if (!synth) return;
    if (synth.paused) synth.resume();
  }

  function cancel() {
    if (!synth) return;
    try {
      synth.cancel();
    } catch {}
    setSpeaking(false);
    utterRef.current = null;
  }

  return {
    speaking,
    rate,
    setRate,
    voice,
    setVoice,
    voices,
    speak,
    pause,
    resume,
    cancel,
  };
}
