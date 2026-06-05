import { useEffect, useRef, useState } from "react";

type ResultCallback = (transcript: string, isFinal: boolean) => void;

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec: SpeechRecognition = new SpeechRecognition();
    rec.interimResults = true;
    rec.continuous = false;
    rec.lang = navigator.language || "en-US";
    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {}
    };
  }, []);

  function start(onResult: ResultCallback, options?: { continuous?: boolean }) {
    setError(null);
    const rec = recognitionRef.current;
    if (!rec) return setError("SpeechRecognition not supported in this browser.");

    rec.continuous = !!options?.continuous;
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const res = ev.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interimTranscript += res[0].transcript;
        }
      }

      if (interimTranscript) setInterim(interimTranscript);
      else setInterim("");

      if (finalTranscript) onResult(finalTranscript.trim(), true);
      else if (interimTranscript) onResult(interimTranscript.trim(), false);
    };

    rec.onerror = (ev: any) => {
      setError(ev?.error || "Speech recognition error");
    };

    try {
      rec.start();
      setListening(true);
    } catch (e: any) {
      setError(e?.message || "Failed to start recognition");
    }
  }

  function stop() {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {}
    setListening(false);
    setInterim("");
  }

  function abort() {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.abort();
    } catch {}
    setListening(false);
    setInterim("");
  }

  return {
    supported,
    listening,
    interim,
    error,
    start,
    stop,
    abort,
  };
}
