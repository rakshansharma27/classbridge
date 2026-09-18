import React from "react";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  School,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Search,
  BookOpen,
} from "lucide-react";
import { DEMO_ANNOUNCEMENT_TEXT } from "../data/mockData";

interface LandingPageProps {
  onEnterStudentDemo: () => void;
  onEnterTeacherDemo: () => void;
  onOpenDemoGuide: () => void;
  onOpenLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudentDemo,
  onEnterTeacherDemo,
  onOpenDemoGuide,
  onOpenLogin,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Space_Grotesk']">
                Class<span className="text-blue-600">Bridge</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="landing-btn-guide"
              onClick={onOpenDemoGuide}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>90-Second Demo Guide</span>
            </button>
            <button
              id="landing-btn-teacher-top"
              onClick={onEnterTeacherDemo}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Teacher Demo
            </button>
            <button
              id="landing-btn-student-top"
              onClick={onEnterStudentDemo}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Student Demo
            </button>
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Product Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>The Missing Bridge in K-12 School Communication</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn noisy WhatsApp notices into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                  actionable school plans.
                </span>
              </h1>

              {/* One-sentence Concept with Impact Stat */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                <span className="font-semibold text-slate-900">82% of students</span> miss deadlines buried in chaotic class WhatsApp groups and paper notices. ClassBridge uses Multimodal Vision AI to convert circular photos into prioritized tasks, quizzes, and calendar reminders.
              </p>

              {/* Demo CTA Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  id="landing-btn-enter-student"
                  onClick={onEnterStudentDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GraduationCap className="w-5 h-5 text-blue-200" />
                  <span>Try Student Demo</span>
                  <span className="text-xs bg-blue-500/60 text-blue-100 px-2 py-0.5 rounded-full">
                    Maya (Grade 10)
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  id="landing-btn-enter-teacher"
                  onClick={onEnterTeacherDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 text-base font-semibold shadow-xs flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <School className="w-5 h-5 text-indigo-600" />
                  <span>Try Teacher Demo</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    Mr. Sharma
                  </span>
                </button>
              </div>

              {/* Demo Mode Notice */}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  No sign-up or real personal data needed
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Preloaded student & teacher demo state
                </span>
              </div>
            </div>

            {/* Interactive Preview Mockup Box */}
            <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">ClassBridge AI Extraction Engine</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                {/* Left: Raw announcement */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-rose-500" />
                      Before: Confusing Raw Announcement
                    </span>
                    <span className="text-rose-600 font-semibold">Messy WhatsApp / PDF</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-rose-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs italic font-serif">
                    “{DEMO_ANNOUNCEMENT_TEXT}”
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Notice: 2 separate locations, submission deadline, team rules, and physical copy requirement!
                  </div>
                </div>

                {/* Right: Extracted plan */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      After: ClassBridge Action Plan
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Structured & Clear
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-xs space-y-2.5 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        Science Exhibition Project Proposal
                      </span>
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        Due Soon
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-slate-400 block font-medium">Deadline</span>
                        <span className="font-semibold text-slate-800">Fri, Sept 25, 4:00 PM</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-slate-400 block font-medium">Location</span>
                        <span className="font-semibold text-slate-800">Portal & Lab 2</span>
                      </div>
                    </div>
                    <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-100 text-blue-900 text-[11px]">
                      <span className="font-bold">Required Action:</span> Submit online proposal & bring printed copy.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem vs The Solution Section */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* The Problem */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 font-['Space_Grotesk']">
                The Problem
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Google Classroom handles formal teacher-posted assignments, but fails to capture the chaotic <strong className="text-slate-900">80% of daily school communication</strong>: parent WhatsApp groups, photographed bulletin notices, sudden exam circulars, and verbal reminders.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>82% of students</strong> report missing crucial deadlines buried in 200+ unread WhatsApp messages.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Physical circular photos cannot be automatically searched, scheduled, or added to calendars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Zero deadline collision detection when 3+ subject projects overlap in the same exam week.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 font-['Space_Grotesk']">
                The Solution
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                ClassBridge provides one single action dashboard where students instantly understand notices,
                track deadlines, receive intelligent urgency alerts, and manage their academic schedule without stress.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Instant AI extraction of required action, deadlines, room numbers, and materials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Plain-language "Explain Simply" mode and instant multilingual translations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automatic friendly deadline conflict warnings to prevent last-minute panic.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3-Step Process: Paste -> Understand -> Plan */}
        <section className="py-14 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                How It Works
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white">
                From Confusing Notice to Action Plan in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-base">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Paste</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Paste the text or email from WhatsApp, Google Classroom, or school circulars into the analyzer.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-base">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Understand</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  ClassBridge extracts title, due dates, physical location, materials, urgency, and generates a simple breakdown.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-base">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">Plan</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Click "Add to My Plan". The task appears on your dashboard, calendar, and alerts you if deadlines clash.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Feature Cards */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Student Success
            </h2>
            <p className="text-slate-600 text-base mt-2">
              ClassBridge is not just a text summarizer; it is an action management system for school life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Understand Announcements</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Break complex multi-paragraph announcements into clean summaries, simplified student language, and multi-language translations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Organize Deadlines</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly visualize tasks and school events in monthly calendar and weekly agenda views with categorized color codes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Never Miss Important Actions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive proactive deadline conflict notifications with friendly recommendations on when to begin larger project proposals.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 font-['Space_Grotesk']">ClassBridge</span>
            <span>— School information, finally organized.</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onEnterStudentDemo} className="hover:text-blue-600 font-medium">
              Student Mode
            </button>
            <span>•</span>
            <button onClick={onEnterTeacherDemo} className="hover:text-blue-600 font-medium">
              Teacher Mode
            </button>
            <span>•</span>
            <button onClick={onOpenDemoGuide} className="hover:text-indigo-600 font-medium">
              90s Tour Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
