"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "dragging" | "uploading" | "processing" | "success" | "error";

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  skills?: string[];
  fileName?: string;
}

export function ResumeUpload({ onUpload, skills = [], fileName }: ResumeUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file");
        setState("error");
        return;
      }

      setError(null);
      setState("uploading");

      try {
        setState("processing");
        await onUpload(file);
        setState("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setState("error");
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {state !== "success" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
              dragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border/30 bg-card/10 hover:border-border/60",
              (state === "uploading" || state === "processing") && "pointer-events-none"
            )}
          >
            {state === "uploading" || state === "processing" ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  {state === "uploading" ? "Uploading resume..." : "Extracting skills with AI..."}
                </p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-border/30">
                  <motion.div
                    className="h-full bg-gradient-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: state === "processing" ? "80%" : "40%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-2 text-lg font-semibold">Drop your resume here</p>
                <p className="mb-6 text-sm text-muted-foreground">
                  PDF format · Max 10MB
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <Button variant="gradient" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </label>
                {error && (
                  <p className="mt-4 text-sm text-destructive">{error}</p>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-success/20 bg-success/10 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Resume uploaded successfully</p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {fileName}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={reset}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground">
            Extracted Skills ({skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Badge variant="secondary">{skill}</Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
