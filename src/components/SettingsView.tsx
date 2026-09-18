import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Globe,
  Shield,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
  BookOpen,
} from "lucide-react";
import { Role, User } from "../types";

interface SettingsViewProps {
  currentUser: User;
  onResetDemoData: () => void;
  onSwitchRole: (role: Role) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onResetDemoData,
  onSwitchRole,
}) => {
  const [defaultLang, setDefaultLang] = useState<string>("English");
  const [conflictSensitivity, setConflictSensitivity] = useState<string>("Balanced");
  const [autoAddMaterials, setAutoAddMaterials] = useState<boolean>(true);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleReset = () => {
    onResetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
            Settings & Preferences
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Manage your ClassBridge notifications, AI parsing preferences, and demo environment state.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo state reset to initial values successfully!</span>
        </div>
      )}

      {/* Active Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full border-2 border-slate-200 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 capitalize">
                {currentUser.role} Demo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.role === "student" ? `${currentUser.grade} • Oakridge High` : `${currentUser.department} • Lead`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchRole(currentUser.role === "student" ? "teacher" : "student")}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Switch to {currentUser.role === "student" ? "Teacher Mode" : "Student Mode"}
          </button>
        </div>
      </div>

      {/* Preferences Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {/* Multilingual Translation */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Default Circular Language</span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose the preferred language for announcement explanations.
              </p>
            </div>
            <select
              value={defaultLang}
              onChange={(e) => setDefaultLang(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Spanish">Español (Spanish)</option>
            </select>
          </div>
        </div>

        {/* Conflict Detection Settings */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Deadline Conflict Warnings</span>
              </h3>
              <p className="text-xs text-slate-500">
                Automatically alerts you when 3 or more assignments land within the same school week.
              </p>
            </div>
            <select
              value={conflictSensitivity}
              onChange={(e) => setConflictSensitivity(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Balanced">Balanced (3+ tasks)</option>
              <option value="Sensitive">Sensitive (2+ tasks)</option>
              <option value="Relaxed">Relaxed (4+ tasks)</option>
            </select>
          </div>
        </div>

        {/* Materials Checklist */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Auto-Extract Required Materials</span>
              </h3>
              <p className="text-xs text-slate-500">
                Identify physical printed copies, lab equipment, or liability slips and append them to task cards.
              </p>
            </div>
            <button
              onClick={() => setAutoAddMaterials(!autoAddMaterials)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoAddMaterials ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoAddMaterials ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Reset Demo Session Data</span>
              </h3>
              <p className="text-xs text-slate-500">
                Restore the sample student (Maya) and teacher (Mr. Sharma) tasks, announcements, and events.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Project Positioning Statement */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <BookOpen className="w-4 h-4" />
          <span>Product Positioning & Value Proposition</span>
        </div>
        <h3 className="text-xl font-bold font-['Space_Grotesk'] leading-snug">
          “ClassBridge helps students move from <span className="text-amber-300">‘What does this announcement mean?’</span> to <span className="text-emerald-300">‘I know exactly what to do next.’</span>”
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
          ClassBridge is not just an AI summarizer. It is an action-management system for school communication, turning unformatted noise into structured student agency.
        </p>
      </div>
    </div>
  );
};
