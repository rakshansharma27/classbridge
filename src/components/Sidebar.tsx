import React from "react";
import {
  LayoutDashboard,
  Wand2,
  Calendar,
  Bell,
  Settings,
  PlusCircle,
  UploadCloud,
  CalendarCheck2,
  HelpCircle,
  BookOpen,
  LogOut,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Role } from "../types";

export type NavTab =
  | "dashboard"
  | "projects"
  | "attendance"
  | "quizzes"
  | "notes"
  | "leaderboard"
  | "analyze"
  | "calendar"
  | "announcements"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount: number;
  pendingProjectsCount?: number;
  announcementsCount: number;
  role: Role;
  onQuickCreateAnnouncement?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
  pendingProjectsCount = 0,
  announcementsCount,
  role,
  onQuickCreateAnnouncement,
  onLogout,
}) => {
  // Role-Specific Navigation Menu Items
  const studentNavItems = [
    {
      id: "dashboard" as NavTab,
      label: "My Tasks & Overview",
      icon: LayoutDashboard,
      badge: pendingTasksCount,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "projects" as NavTab,
      label: "Upload Projects",
      icon: UploadCloud,
      badge: pendingProjectsCount > 0 ? pendingProjectsCount : undefined,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "attendance" as NavTab,
      label: "My Attendance",
      icon: CalendarCheck2,
    },
    {
      id: "quizzes" as NavTab,
      label: "Online Quizzes",
      icon: HelpCircle,
    },
    {
      id: "notes" as NavTab,
      label: "Class Notes",
      icon: BookOpen,
    },
    {
      id: "leaderboard" as NavTab,
      label: "Leaderboard",
      icon: Trophy,
      badge: "Top 3",
      badgeColor: "bg-amber-100 text-amber-900 font-bold",
    },
    {
      id: "analyze" as NavTab,
      label: "AI Analyzer",
      icon: Wand2,
      sparkle: true,
    },
    {
      id: "calendar" as NavTab,
      label: "Calendar",
      icon: Calendar,
    },
    {
      id: "settings" as NavTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  const teacherNavItems = [
    {
      id: "dashboard" as NavTab,
      label: "Teacher Overview",
      icon: LayoutDashboard,
    },
    {
      id: "projects" as NavTab,
      label: "Projects & Uploads",
      icon: UploadCloud,
      badge: pendingProjectsCount > 0 ? pendingProjectsCount : undefined,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "attendance" as NavTab,
      label: "Mark Attendance",
      icon: CalendarCheck2,
    },
    {
      id: "quizzes" as NavTab,
      label: "Quiz Creator",
      icon: HelpCircle,
    },
    {
      id: "notes" as NavTab,
      label: "Upload Class Notes",
      icon: BookOpen,
    },
    {
      id: "leaderboard" as NavTab,
      label: "Honor Roll",
      icon: Trophy,
    },
    {
      id: "announcements" as NavTab,
      label: "Announcements",
      icon: Bell,
      badge: announcementsCount,
      badgeColor: "bg-slate-100 text-slate-700",
    },
    {
      id: "analyze" as NavTab,
      label: "AI Circular Parser",
      icon: Wand2,
      sparkle: true,
    },
    {
      id: "calendar" as NavTab,
      label: "Master Calendar",
      icon: Calendar,
    },
    {
      id: "settings" as NavTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  const navItems = role === "student" ? studentNavItems : teacherNavItems;

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-61px)] p-4 shrink-0 justify-between">
        <div className="space-y-5">
          {/* Quick Action Button */}
          {role === "student" ? (
            <button
              id="sidebar-btn-analyze-quick"
              onClick={() => onSelectTab("analyze")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Analyze Notice with AI</span>
            </button>
          ) : (
            <button
              id="sidebar-btn-create-announcement-quick"
              onClick={() => {
                if (onQuickCreateAnnouncement) onQuickCreateAnnouncement();
                else onSelectTab("announcements");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Broadcast Notice</span>
            </button>
          )}

          {/* Navigation links */}
          <nav className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role === "student" ? "Student Navigation" : "Teacher Navigation"}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-50/80 text-blue-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.sparkle && !isActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-tight">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom card: Role info & Logout */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{role === "student" ? "Student Portal" : "Faculty Command"}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              {role === "student"
                ? "Manage your homework, submit assignments online, and practice with timed quizzes."
                : "Create online submission assignments, record roll call, and upload class notes."}
            </p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[9px] font-medium transition-colors relative ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span className="truncate max-w-[55px]">{item.label.split(" ")[0]}</span>
              {item.badge !== undefined && (typeof item.badge === "number" ? item.badge > 0 : Boolean(item.badge)) && (
                <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                  {typeof item.badge === "number" ? item.badge : "•"}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
