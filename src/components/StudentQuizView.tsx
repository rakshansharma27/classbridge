import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Send,
  X,
  History,
} from "lucide-react";
import { Quiz, QuizQuestion, QuizSubmission, User } from "../types";
import { triggerConfetti } from "../utils/confetti";

interface StudentQuizViewProps {
  currentUser: User;
  quizzes: Quiz[];
  quizSubmissions: QuizSubmission[];
  onSubmitQuiz: (submission: QuizSubmission) => void;
}

export const StudentQuizView: React.FC<StudentQuizViewProps> = ({
  currentUser,
  quizzes,
  quizSubmissions,
  onSubmitQuiz,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<QuizSubmission | null>(null);
  const [filterType, setFilterType] = useState<"all" | "timed" | "practice">("all");

  // Timer Effect
  useEffect(() => {
    if (!activeQuiz || isQuizCompleted || activeQuiz.durationMinutes === 0) return;

    if (timeLeftSeconds <= 0) {
      // Auto submit on time-out
      handleFinalSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz, timeLeftSeconds, isQuizCompleted]);

  // Start Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsQuizCompleted(false);
    setLastSubmission(null);
    if (quiz.durationMinutes > 0) {
      setTimeLeftSeconds(quiz.durationMinutes * 60);
    } else {
      setTimeLeftSeconds(0);
    }
  };

  // Select Option
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  // Submit Quiz Action
  const handleFinalSubmit = () => {
    if (!activeQuiz) return;

    // Calculate score
    let score = 0;
    const answerArr: number[] = [];

    activeQuiz.questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      answerArr.push(selected !== undefined ? selected : -1);
      if (selected === q.correctAnswerIndex) {
        score += 1;
      }
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const submission: QuizSubmission = {
      id: `qsub-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      score,
      totalQuestions: total,
      percentage,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      answers: answerArr,
    };

    onSubmitQuiz(submission);
    setLastSubmission(submission);
    setIsQuizCompleted(true);

    if (percentage >= 80) {
      triggerConfetti({ durationMs: 3500, particleCount: 160 });
    }
  };

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Filtered Quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (filterType === "timed") return q.type === "timed";
    if (filterType === "practice") return q.type === "practice";
    return true;
  });

  // Student Past Submissions
  const mySubmissions = quizSubmissions.filter((s) => s.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Quiz Playing View */}
      {activeQuiz && !isQuizCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-150">
          {/* Quiz Active Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 p-4 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                {activeQuiz.subject} • {activeQuiz.type === "timed" ? `${activeQuiz.durationMinutes} Min Timed Assessment` : "Untimed Practice Mode"}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>

            {/* Countdown Timer Badge */}
            {activeQuiz.durationMinutes > 0 ? (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold shadow-xs border ${
                  timeLeftSeconds < 120
                    ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                    : timeLeftSeconds < 300
                    ? "bg-amber-500 text-white border-amber-400"
                    : "bg-white/20 text-white border-white/30 backdrop-blur-md"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Time Left: {formatTime(timeLeftSeconds)}</span>
              </div>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
                Practice Mode (Self-Paced)
              </span>
            )}
          </div>

          {/* Progress Tracker Bar */}
          <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-600">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </span>

            <div className="flex items-center gap-1.5">
              {activeQuiz.questions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
                  setActiveQuiz(null);
                }
              }}
              className="text-xs text-slate-500 hover:text-rose-600 font-medium"
            >
              Cancel Quiz
            </button>
          </div>

          {/* Question Card Content */}
          <div className="p-6 sm:p-8">
            {activeQuiz.questions[currentQuestionIndex] && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {activeQuiz.questions[currentQuestionIndex].question}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500"
                            : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    >
                      Next Question
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow"
                    >
                      <Send className="w-4 h-4" />
                      Submit Final Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeQuiz && isQuizCompleted && lastSubmission ? (
        /* Quiz Completed & Review Breakdown View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in">
          {/* Result Score Card */}
          <div className="text-center max-w-md mx-auto space-y-3 pb-6 border-b border-slate-100">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white ${
                lastSubmission.percentage >= 70
                  ? "bg-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-amber-600 shadow-lg shadow-amber-500/20"
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {lastSubmission.percentage >= 70 ? "Great Job! Quiz Passed" : "Quiz Finished"}
            </h2>
            <p className="text-xs text-slate-500">
              Submitted for {activeQuiz.title} on {lastSubmission.submittedAt}
            </p>

            <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200">
              <div className="text-left">
                <div className="text-xs text-slate-500 font-medium">Your Score</div>
                <div className="text-2xl font-black text-blue-600">
                  {lastSubmission.score} / {lastSubmission.totalQuestions}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-left">
                <div className="text-xs text-slate-500 font-medium">Percentage</div>
                <div className="text-2xl font-black text-slate-900">
                  {lastSubmission.percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-slate-900">Detailed Answer Review:</h3>
            {activeQuiz.questions.map((q, idx) => {
              const selectedOpt = userAnswers[idx];
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                    isCorrect
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-rose-50/50 border-rose-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold shrink-0">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div>
                      <span className="font-semibold">Your Answer: </span>
                      {selectedOpt !== undefined
                        ? `${String.fromCharCode(65 + selectedOpt)}) ${q.options[selectedOpt]}`
                        : "No answer selected"}
                    </div>
                    {!isCorrect && (
                      <div className="text-emerald-700 font-medium">
                        <span className="font-semibold">Correct Answer: </span>
                        {String.fromCharCode(65 + q.correctAnswerIndex)}) {q.options[q.correctAnswerIndex]}
                      </div>
                    )}
                  </div>

                  <div className="text-slate-500 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 italic">
                    <span className="font-semibold not-italic text-slate-700">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 text-center">
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setIsQuizCompleted(false);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Back to Quizzes Catalog
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Quizzes Catalog View */
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-3 border border-white/20">
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Assessment Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Online Quizzes & Practice Tests
              </h1>
              <p className="text-indigo-100 text-sm mt-1.5 leading-relaxed">
                Test your understanding with teacher-curated timed quizzes (20 min, 30 min) or practice self-paced tests with step-by-step solutions.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-700">Filter By Mode:</span>
            <div className="flex items-center gap-1.5">
              {(["all", "timed", "practice"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterType(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    filterType === mode
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {mode === "all" ? "All Quizzes" : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Quizzes List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => {
              const prevAttempt = mySubmissions.find((s) => s.quizId === quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                        {quiz.subject}
                      </span>
                      {quiz.type === "timed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {quiz.durationMinutes} Min Timed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          Practice (Untimed)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {quiz.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                      <span>{quiz.questions.length} Questions</span>
                      <span>By: {quiz.createdBy.split(" ")[0]}</span>
                    </div>

                    {prevAttempt && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                        <span>Last Score:</span>
                        <span className="font-bold">
                          {prevAttempt.score}/{prevAttempt.totalQuestions} ({prevAttempt.percentage}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{prevAttempt ? "Retake Quiz" : "Start Online Quiz"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Past Quiz Attempt Records */}
          {mySubmissions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                My Quiz Submission History
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800">{sub.quizTitle}</div>
                      <div className="text-slate-400 text-[11px]">Submitted: {sub.submittedAt}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Award className="w-3.5 h-3.5" />
                        {sub.score}/{sub.totalQuestions} ({sub.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
