import React, { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Play,
  HelpCircle,
  Trophy,
  UploadCloud,
  Wand2,
  School,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Role } from "../types";
import { NavTab } from "./Sidebar";

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  activeTab: NavTab;
  isLandingActive: boolean;
  onJumpToStep: (stepNumber: number) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToStep,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const demoSteps = [
    {
      num: 1,
      icon: MessageSquare,
      title: "Lead With The Real Problem (82% Stat)",
      desc: "Open on Landing Page. Tell judges: 'Google Classroom is for formal assignments, but 80% of school life happens in noisy WhatsApp groups and paper notices where 82% of students miss deadlines.'",
      actionLabel: "View Landing & Stat",
    },
    {
      num: 2,
      icon: GraduationCap,
      title: "Student Portal & Dynamic Conflict Alert",
      desc: "Enter Maya Sharma's portal. Point out the dynamic 7-day deadline collision alert that prevents exam-week submission panic.",
      actionLabel: "Open Student Portal",
    },
    {
      num: 3,
      icon: HelpCircle,
      title: "Online Quiz Runner & Confetti Shower",
      desc: "Open 'Online Quizzes'. Start a practice quiz, select answers, and score 80%+ to trigger the real-time Canvas Confetti celebration!",
      actionLabel: "Launch Quiz & Confetti",
    },
    {
      num: 4,
      icon: Wand2,
      title: "Multimodal WhatsApp Notice Scanner",
      desc: "Open AI Analyzer. Click 'Load Sample Circular Photo' (or drag & drop a notice screenshot) and run Gemini 2.5 Flash structured extraction.",
      actionLabel: "Run Vision AI Parser",
    },
    {
      num: 5,
      icon: Trophy,
      title: "Academic Leaderboard & Honor Roll",
      desc: "Open the Leaderboard. Showcase the 🥇🥈🥉 Podium, class-wise filter (Grade 10-A / 10-B), and 4 category rankings (Attendance, Quizzes, Projects).",
      actionLabel: "View Honor Roll Podium",
    },
    {
      num: 6,
      icon: School,
      title: "Teacher Command Suite (Mr. Sharma)",
      desc: "Switch to Mr. Sharma. Showcase 1-click batch attendance marking, custom 20/30-min quiz creator, and class notes uploader.",
      actionLabel: "Open Faculty Suite",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hackathon Judge Pitch Script (2 Minutes)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
              The Winning Demo Path
            </h3>
            <p className="text-xs text-slate-500">
              Follow these 6 linear steps to showcase all key criteria (Impact, Creativity, Functionality, Design, Learning) with zero stage friction.
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {demoSteps.map((step) => {
            const isDone = !!completedSteps[step.num];
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? "bg-slate-50/70 border-slate-200 opacity-80"
                    : "bg-white border-slate-200 shadow-2xs hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.num)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none"
                    title={isDone ? "Mark uncompleted" : "Mark step completed"}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${isDone ? "text-emerald-600" : "text-slate-300"}`}
                    />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-900 font-mono">
                        Step {step.num}:
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isDone ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onJumpToStep(step.num);
                    toggleStep(step.num);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0 transition-colors flex items-center gap-1"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {Object.values(completedSteps).filter(Boolean).length} of {demoSteps.length} steps rehearsed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Start Presentation
          </button>
        </div>
      </div>
    </div>
  );
};
