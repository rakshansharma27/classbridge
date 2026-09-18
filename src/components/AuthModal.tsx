import React, { useState } from "react";
import {
  GraduationCap,
  School,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User as UserIcon,
  X,
  BookOpen,
} from "lucide-react";
import { Role, User } from "../types";
import { SAMPLE_STUDENT, SAMPLE_TEACHER } from "../data/mockData";

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: Role;
  allowClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = "student",
  allowClose = true,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [gradeOrDept, setGradeOrDept] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleQuickLogin = (role: Role) => {
    if (role === "student") {
      onLoginSuccess(SAMPLE_STUDENT);
    } else {
      onLoginSuccess(SAMPLE_TEACHER);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (activeTab === "login") {
      if (!email.trim() || !password.trim()) {
        setErrorMsg("Please enter both email and password.");
        return;
      }

      // Check against demo accounts or construct logged in user
      if (email.toLowerCase().includes("teacher") || email.toLowerCase().includes("sharma")) {
        onLoginSuccess(SAMPLE_TEACHER);
        return;
      }
      if (email.toLowerCase().includes("maya") || selectedRole === "student") {
        const user: User = {
          id: `student-${Date.now()}`,
          name: name.trim() || (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)),
          email: email.trim(),
          role: "student",
          grade: "Grade 10",
          avatar: SAMPLE_STUDENT.avatar,
        };
        onLoginSuccess(user);
        return;
      }

      const user: User = {
        id: `teacher-${Date.now()}`,
        name: name.trim() || "Teacher " + (email.split("@")[0]),
        email: email.trim(),
        role: "teacher",
        department: "General Faculty",
        avatar: SAMPLE_TEACHER.avatar,
      };
      onLoginSuccess(user);
    } else {
      // Sign Up Flow
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg("Please fill out all required fields.");
        return;
      }
      const newUser: User = {
        id: `${selectedRole}-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: selectedRole,
        grade: selectedRole === "student" ? (gradeOrDept.trim() || "Grade 10") : undefined,
        department: selectedRole === "teacher" ? (gradeOrDept.trim() || "Department") : undefined,
        avatar: selectedRole === "student" ? SAMPLE_STUDENT.avatar : SAMPLE_TEACHER.avatar,
      };
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-6 text-white relative">
          {allowClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-extrabold text-xl tracking-tight font-['Space_Grotesk']">
              Class<span className="text-blue-200">Bridge</span>
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {activeTab === "login" ? "Sign In to Access Dashboard" : "Create Your Account"}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Access your personalized student tasks or teacher management suite.
          </p>
        </div>

        {/* Quick Demo Access Bar (Crucial for Hackathon Judges) */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              1-Click Demo Logins
            </span>
            <span className="text-[11px] text-amber-700">Instant judge access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="quick-login-student"
              onClick={() => handleQuickLogin("student")}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-amber-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <div className="text-left leading-tight">
                <div>Student Portal</div>
                <div className="text-[10px] text-slate-500 font-normal">Maya (Gr. 10)</div>
              </div>
            </button>

            <button
              type="button"
              id="quick-login-teacher"
              onClick={() => handleQuickLogin("teacher")}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white border border-amber-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-800 text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
            >
              <School className="w-4 h-4 text-indigo-600" />
              <div className="text-left leading-tight">
                <div>Teacher Portal</div>
                <div className="text-[10px] text-slate-500 font-normal">Mr. Sharma</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setErrorMsg("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "signup"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Role Pill Selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedRole === "student"
                    ? "border-blue-600 bg-blue-50/70 text-blue-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("teacher")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedRole === "teacher"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <School className="w-4 h-4" />
                Teacher / Staff
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={selectedRole === "student" ? "e.g. Maya Sharma" : "e.g. Mr. Sharma"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {selectedRole === "student" ? "Grade / Class" : "Department"}
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={selectedRole === "student" ? "e.g. Grade 10-A" : "e.g. Science Department"}
                      value={gradeOrDept}
                      onChange={(e) => setGradeOrDept(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder={
                    selectedRole === "student"
                      ? "maya@classbridge.edu"
                      : "sharma@classbridge.edu"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{activeTab === "login" ? "Sign In to Portal" : "Create Account & Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
