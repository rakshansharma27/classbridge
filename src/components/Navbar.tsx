import React from "react";
import {
  Sparkles,
  GraduationCap,
  School,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  UserCheck,
} from "lucide-react";
import { Role, User } from "../types";

interface NavbarProps {
  currentUser: User | null;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  onExitDemo: () => void;
  onOpenDemoGuide: () => void;
  conflictActive: boolean;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  onLogout,
  onOpenLogin,
  onExitDemo,
  onOpenDemoGuide,
  conflictActive,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitDemo}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            title="Return to ClassBridge Overview"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-['Space_Grotesk']">
                  Class<span className="text-blue-600">Bridge</span>
                </span>
                {currentUser && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    currentUser.role === "student"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>
                    {currentUser.role === "student" ? "Student Portal" : "Teacher Portal"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                School information, finally organized.
              </p>
            </div>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Conflict indicator tag */}
          {conflictActive && currentUser?.role === "student" && (
            <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-full animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold">Conflict Detected</span>
            </div>
          )}

          {/* 90-Second Demo Guide Button */}
          <button
            id="btn-demo-guide"
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">90s Demo</span> Guide
          </button>

          {currentUser ? (
            <>
              {/* Quick Role Switcher for Hackathon Judges */}
              <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
                <button
                  id="role-btn-student"
                  onClick={() => onSwitchRole("student")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    currentUser.role === "student"
                      ? "bg-white text-blue-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Switch to Student View"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Maya (Student)</span>
                </button>
                <button
                  id="role-btn-teacher"
                  onClick={() => onSwitchRole("teacher")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    currentUser.role === "teacher"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Switch to Teacher View"
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Mr. Sharma (Teacher)</span>
                </button>
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-xs object-cover"
                />
                <div className="hidden md:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-800 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.grade || currentUser.department || currentUser.role}
                  </div>
                </div>

                {/* Logout Button (Mandatory Auth requirement) */}
                <button
                  id="navbar-btn-logout"
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  title="Log Out of Portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* If unauthenticated */
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Sign In to Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
