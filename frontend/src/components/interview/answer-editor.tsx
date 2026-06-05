"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";

interface AnswerEditorProps {
  onSubmit: (answer: string) => void;
  onFollowup?: (answer: string) => void;
  loading?: boolean;
  followupLoading?: boolean;
  followupSuggestion?: string | null;
  placeholder?: string;
  maxLength?: number;
}

export function AnswerEditor({
  onSubmit,
  onFollowup,
  loading,
  followupLoading,
  followupSuggestion,
  placeholder = "Type your answer here...",
  maxLength = 2000,
}: AnswerEditorProps) {
  const [answer, setAnswer] = useState("");
  const [interimText, setInterimText] = useState("");
  const charCount = answer.length;
  const isNearLimit = charCount > maxLength * 0.9;

  const handleSubmit = () => {
    if (answer.trim() && !loading) {
      onSubmit(answer.trim());
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <VoiceRecorder
            autoFill
            continuous
            onTranscript={(text, isFinal) => {
              if (isFinal) {
                // commit final transcript
                setAnswer((prev) => {
                  const sep = prev && !prev.endsWith(" ") ? " " : "";
                  const newVal = (prev || "") + sep + text;
                  return newVal.slice(0, maxLength);
                });
                setInterimText("");
              } else {
                // show interim
                setInterimText(text);
              }
            }}
          />

          <div className="relative">
            <Textarea
              value={answer + (interimText ? ` ${interimText}` : "")}
              onChange={(e) => {
                setInterimText("");
                setAnswer(e.target.value.slice(0, maxLength));
              }}
              placeholder={placeholder}
              className="min-h-[160px] text-base"
              disabled={loading}
            />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span
              className={cn(
                "text-xs",
                isNearLimit ? "text-warning" : "text-muted-foreground"
              )}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {onFollowup && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onFollowup(answer.trim())}
              disabled={!answer.trim() || followupLoading || loading}
            >
              <Sparkles className="h-4 w-4" />
              {followupLoading ? "Generating..." : "AI Suggestion"}
            </Button>
          )}
          <Button
            variant="gradient"
            onClick={handleSubmit}
            disabled={!answer.trim() || loading}
            className="ml-auto"
          >
            {loading ? (
              "Evaluating..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>

        {followupSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Wand2 className="h-4 w-4" />
              Gemini AI suggestion
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {followupSuggestion}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
