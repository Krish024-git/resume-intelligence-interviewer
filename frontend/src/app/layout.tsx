import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "InterviewAI — AI Interview Preparation Platform",
  description:
    "World-class AI interview preparation with resume analysis, personalized questions, real-time evaluation, and career insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
