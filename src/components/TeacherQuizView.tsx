import React, { useState } from "react";
import {
  HelpCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  Award,
  BookOpen,
  Send,
  X,
  Users,
  AlertCircle,
} from "lucide-react";
import { Quiz, QuizQuestion, QuizSubmission, User } from "../types";

interface TeacherQuizViewProps {
  currentUser: User;
  quizzes: Quiz[];
  quizSubmissions: QuizSubmission[];
  onCreateQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
}

export const TeacherQuizView: React.FC<TeacherQuizViewProps> = ({
  currentUser,
  quizzes,
  quizSubmissions,
  onCreateQuiz,
  onDeleteQuiz,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form State
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("Science");
  const [description, setDescription] = useState<string>("");
  const [quizMode, setQuizMode] = useState<"timed" | "practice">("timed");
  const [durationMinutes, setDurationMinutes] = useState<number>(20);

  // Questions Builder State
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "temp-q1",
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"],
      correctAnswerIndex: 2,
      explanation: "Mitochondria generate the majority of chemical energy ATP needed by the cell.",
    },
    {
      id: "temp-q2",
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Endoplasmic Reticulum", "Ribosome", "Golgi Apparatus", "Vacuole"],
      correctAnswerIndex: 1,
      explanation: "Ribosomes translate mRNA sequences into polypeptide amino acid chains.",
    },
  ]);

  // Temporary single question form in modal
  const [newQuestionText, setNewQuestionText] = useState<string>("");
  const [optA, setOptA] = useState<string>("");
  const [optB, setOptB] = useState<string>("");
  const [optC, setOptC] = useState<string>("");
  const [optD, setOptD] = useState<string>("");
  const [correctOptIndex, setCorrectOptIndex] = useState<number>(0);
  const [questionExplanation, setQuestionExplanation] = useState<string>("");

  const handleAddQuestionToQuiz = () => {
    if (!newQuestionText.trim() || !optA.trim() || !optB.trim()) {
      alert("Please fill in the question and at least options A and B.");
      return;
    }

    const q: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim() || "N/A", optD.trim() || "N/A"],
      correctAnswerIndex: correctOptIndex,
      explanation: questionExplanation.trim() || "Verified by course instructor.",
    };

    setQuestions((prev) => [...prev, q]);
    setNewQuestionText("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrectOptIndex(0);
    setQuestionExplanation("");
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOpenCreateModal = () => {
    setQuizTitle("");
    setDescription("");
    setQuizMode("timed");
    setDurationMinutes(20);
    setIsCreateModalOpen(true);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      alert("Please specify a quiz title.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question to the quiz.");
      return;
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle.trim(),
      subject,
      description: description.trim() || "Review test designed to measure classroom comprehension.",
      durationMinutes: quizMode === "timed" ? Number(durationMinutes) : 0,
      type: quizMode,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().substring(0, 10),
      questions,
    };

    onCreateQuiz(newQuiz);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100 mb-2 border border-white/20">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Assessment & Quiz Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Online Quizzes & Assessments
          </h1>
          <p className="text-purple-100 text-sm mt-1 leading-relaxed">
            Create custom-timed quizzes (10 min, 20 min, 30 min, etc.) or practice tests with instant auto-scoring for students.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="relative z-10 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => {
          const attempts = quizSubmissions.filter((s) => s.quizId === quiz.id);
          const avgScore =
            attempts.length > 0
              ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
              : 0;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
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
                      Practice Mode
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {quiz.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <span className="font-semibold text-slate-800">{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Student Attempts:</span>
                    <span className="font-semibold text-blue-700">{attempts.length} Students</span>
                  </div>
                  {attempts.length > 0 && (
                    <div className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Average Score:</span>
                      <span>{avgScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Created: {quiz.createdAt}</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete quiz "${quiz.title}"?`)) {
                      onDeleteQuiz(quiz.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Quiz Submissions Analytics */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Student Quiz Attempts & Results</h3>
          <p className="text-xs text-slate-500">Live submission records and automated scoring</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Quiz Title</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {quizSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No student submissions recorded yet.
                  </td>
                </tr>
              ) : (
                quizSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{sub.studentName}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{sub.quizTitle}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">
                      {sub.score} / {sub.totalQuestions}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.percentage >= 70
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{sub.submittedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quiz Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Create & Publish Online Quiz</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuiz} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Chapter 5: Acids, Bases & Salts"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
              </div>

              {/* Requirement 3.3: Customize Time (20 min, 30 min, practice, etc.) */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-purple-900">
                  Assessment Mode & Time Limit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizMode("timed")}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      quizMode === "timed"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white text-slate-700 border-purple-200"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Timed Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizMode("practice")}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      quizMode === "practice"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white text-slate-700 border-purple-200"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Practice Mode (Untimed)
                  </button>
                </div>

                {quizMode === "timed" && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs text-purple-800 font-medium">Select Duration:</span>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="p-1.5 text-xs rounded-lg border border-purple-300 bg-white font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={10}>10 Minutes Quiz</option>
                      <option value={15}>15 Minutes Quiz</option>
                      <option value={20}>20 Minutes Quiz</option>
                      <option value={30}>30 Minutes Quiz</option>
                      <option value={45}>45 Minutes Quiz</option>
                      <option value={60}>60 Minutes Comprehensive Exam</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quiz Description / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Instructions for students (e.g. answer all questions, no calculators)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Questions List & Add Question Box */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Questions ({questions.length})
                  </span>
                </div>

                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 relative"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-slate-800">
                        {idx + 1}. {q.question}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Correct: Option {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]})
                    </div>
                  </div>
                ))}

                {/* Add New Question Section */}
                <div className="p-3.5 border border-dashed border-purple-300 rounded-xl bg-purple-50/40 space-y-2.5">
                  <span className="text-xs font-bold text-purple-900 block">
                    + Add Question to Quiz
                  </span>
                  <input
                    type="text"
                    placeholder="Enter question prompt..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                  />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Option A"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      className="p-1.5 rounded border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option B"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      className="p-1.5 rounded border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option C"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      className="p-1.5 rounded border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option D"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      className="p-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Correct Option:
                      </label>
                      <select
                        value={correctOptIndex}
                        onChange={(e) => setCorrectOptIndex(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-300 bg-white font-bold text-slate-800"
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Answer Explanation:
                      </label>
                      <input
                        type="text"
                        placeholder="Why is this answer correct?"
                        value={questionExplanation}
                        onChange={(e) => setQuestionExplanation(e.target.value)}
                        className="w-full p-1.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionToQuiz}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    Append Question
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Quiz Online</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
