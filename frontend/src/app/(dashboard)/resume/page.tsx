"use client";

import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeUpload } from "@/components/resume/resume-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumeStore } from "@/stores/resume-store";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResumePage() {
  const { resume, skills, setResume } = useResumeStore();

  const handleUpload = async (file: File) => {
    try {
      const result = await api.uploadResume(file);
      setResume(result.resume, result.skills);
      toast.success("Resume uploaded and skills extracted!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Resume upload failed");
      throw error;
    }
  };

  return (
    <>
      <Header title="Resume" description="Upload and analyze your resume" />
      <div className="space-y-8 p-6">
        <PageHeader
          title="Resume Upload"
          description="Upload your PDF resume for AI-powered skill extraction and personalized interview questions"
          action={
            resume && (
              <Link href="/interview/configure">
                <Button variant="gradient">Start Interview</Button>
              </Link>
            )
          }
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ResumeUpload
              onUpload={handleUpload}
              skills={skills}
              fileName={resume?.fileName}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
                <p>Upload your PDF resume using drag & drop or file browser</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
                <p>AI extracts your skills, experience, and key qualifications</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">3</span>
                <p>Generate personalized interview questions based on your profile</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
