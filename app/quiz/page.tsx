"use client";

import { useRouter } from "next/navigation";
import RootCauseQuiz from "@/components/root-cause-quiz";

export default function QuizPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/");
  };

  const handleSkip = () => {
    try {
      localStorage.setItem("dilisshious-quiz-seen", "1");
    } catch {}
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#fdf8f3] overflow-y-auto">
      <RootCauseQuiz onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  );
}
