import React, { useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Search,
  Wand2,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  Bell,
  MapPin,
  Package,
  Layers,
  Info,
  UploadCloud,
  CalendarCheck2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Announcement, CalendarEvent, Task, User } from "../types";
import { detectDeadlineConflicts, getDaysRemaining } from "../utils/conflictDetector";

interface StudentDashboardProps {
  user: User;
  tasks: Task[];
  events: CalendarEvent[];
  announcements: Announcement[];
  pendingProjectsCount?: number;
  attendancePercentage?: number;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  onNavigateToAnalyze: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToAnnouncements: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToQuizzes?: () => void;
  onNavigateToNotes?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  tasks,
  events,
  announcements,
  pendingProjectsCount = 0,
  attendancePercentage = 94,
  onToggleTaskComplete,
  onOpenTaskDetails,
  onNavigateToAnalyze,
  onNavigateToCalendar,
  onNavigateToAnnouncements,
  onNavigateToProjects,
  onNavigateToAttendance,
  onNavigateToQuizzes,
  onNavigateToNotes,
}) => {
  const [filter, setFilter] = useState<"all" | "urgent" | "this_week" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Conflict detection
  const conflictWarning = useMemo(() => detectDeadlineConflicts(tasks), [tasks]);

  // Completion stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingCount = totalTasks - completedTasks;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.requiredMaterials && task.requiredMaterials.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter tab
      if (filter === "completed") return task.status === "completed";
      if (task.status === "completed") return false; // Hide completed in active tabs

      if (filter === "urgent") {
        return task.urgency === "Urgent";
      }
      if (filter === "this_week") {
        return task.dueDate >= "2026-09-17" && task.dueDate <= "2026-09-26";
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  // Today's priorities: pending tasks that are Urgent or due soonest
  const todaysPriorities = useMemo(() => {
    return tasks
      .filter((t) => t.status === "pending" && (t.urgency === "Urgent" || t.dueDate <= "2026-09-20"))
      .slice(0, 2);
  }, [tasks]);

  // Sort upcoming deadlines (next 3)
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => t.status === "pending")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Greeting */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700/60 border border-blue-500/40 text-blue-200 text-xs font-semibold">
            <span>{user.grade}</span>
            <span>•</span>
            <span>Oakridge High</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk']">
            Hello, {user.name} 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            You have <strong className="text-white font-bold">{pendingCount} active assignments</strong> and{" "}
            <strong className="text-white font-bold">{events.length} calendar events</strong> scheduled this month.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            id="dash-btn-analyze"
            onClick={onNavigateToAnalyze}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 text-xs sm:text-sm font-bold shadow-md shadow-black/10 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4 text-blue-600" />
            <span>Analyze Announcement</span>
          </button>
          <button
            id="dash-btn-calendar"
            onClick={onNavigateToCalendar}
            className="px-4 py-2.5 rounded-xl bg-blue-700/80 hover:bg-blue-700 border border-blue-500/50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4 text-blue-200" />
            <span>View Calendar</span>
          </button>
        </div>

        {/* Decorative ambient ring */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Quick Academic Hub Navigation Cards (4 New Modules) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onNavigateToProjects}
          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-blue-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UploadCloud className="w-4 h-4" />
            </div>
            {pendingProjectsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                {pendingProjectsCount} Pending
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600">
              Online Projects
            </div>
            <div className="text-[10px] text-slate-400">Upload & track work</div>
          </div>
        </button>

        <button
          onClick={onNavigateToAttendance}
          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-emerald-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {attendancePercentage}% Present
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-600">
              My Attendance
            </div>
            <div className="text-[10px] text-slate-400">Check standing & logs</div>
          </div>
        </button>

        <button
          onClick={onNavigateToQuizzes}
          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-purple-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
              Timed & Practice
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-purple-600">
              Online Quizzes
            </div>
            <div className="text-[10px] text-slate-400">20m / 30m tests</div>
          </div>
        </button>

        <button
          onClick={onNavigateToNotes}
          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-indigo-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Downloadable
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-600">
              Class Notes
            </div>
            <div className="text-[10px] text-slate-400">Formulas & guides</div>
          </div>
        </button>
      </div>

      {/* Deadline Conflict Warning Banner */}
      {conflictWarning.hasConflict && (
        <div
          id="deadline-conflict-banner"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs space-y-2 animate-in fade-in duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Proactive Deadline Warning
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  {conflictWarning.countThisWeek} submissions this week
                </span>
              </div>
              <p className="text-sm font-bold text-amber-950 leading-snug">
                “{conflictWarning.message}”
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                {conflictWarning.suggestedAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats and Completion Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Completion Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion Progress
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              {completedTasks} of {totalTasks} <span className="text-xs text-slate-500 font-normal">tasks</span>
            </div>
            <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600 font-['Space_Grotesk']">
              {completionPercentage}%
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">On track</span>
          </div>
        </div>

        {/* Urgent Deadlines Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Due This Week
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              {conflictWarning.countThisWeek} <span className="text-xs text-slate-500 font-normal">items</span>
            </div>
            <p className="text-xs text-slate-500">
              {conflictWarning.countThisWeek >= 3 ? "High assignment volume" : "Manageable schedule"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Unread Announcements Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              School Circulars
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              {announcements.length} <span className="text-xs text-slate-500 font-normal">notices</span>
            </div>
            <button
              onClick={onNavigateToAnnouncements}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all circulars</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Today's Priorities Section */}
      {todaysPriorities.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 font-['Space_Grotesk']">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Today’s Priorities</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Focus items for immediate action</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todaysPriorities.map((item) => {
              const daysInfo = getDaysRemaining(item.dueDate);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {item.subject}
                      </span>
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {daysInfo.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.title}
                    </h3>
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onToggleTaskComplete(item.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700"
                    >
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Mark Complete</span>
                    </button>
                    <button
                      onClick={() => onOpenTaskDetails(item)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Content Layout: Tasks + Upcoming Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left 2 cols: Task Cards & Filter Bar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls bar: Search & Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks, materials, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "all" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("urgent")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "urgent" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => setFilter("this_week")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "this_week" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "completed" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Task Cards List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No tasks match this filter</h3>
                <p className="text-xs text-slate-500">
                  {filter === "completed"
                    ? "Completed tasks will show up here once checked off."
                    : "You're all caught up on assignments for this view!"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const daysRemaining = getDaysRemaining(task.dueDate);
                const isCompleted = task.status === "completed";

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 ${
                      isCompleted ? "opacity-75 bg-slate-50/50 border-slate-200" : "border-slate-200/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox and Title */}
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => onToggleTaskComplete(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                          title={isCompleted ? "Mark incomplete" : "Mark complete"}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Subject badge */}
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                              {task.subject}
                            </span>

                            {/* Urgency badge */}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                task.urgency === "Urgent"
                                  ? "bg-rose-100 text-rose-800"
                                  : task.urgency === "Soon"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {task.urgency}
                            </span>

                            {/* Days remaining badge */}
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                daysRemaining.isOverdue
                                  ? "bg-rose-50 text-rose-700 font-bold"
                                  : daysRemaining.isToday || daysRemaining.isTomorrow
                                  ? "bg-amber-50 text-amber-800 font-bold"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {daysRemaining.label}
                            </span>
                          </div>

                          <h3
                            className={`font-bold text-slate-900 text-base leading-snug ${
                              isCompleted ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {task.title}
                          </h3>

                          {/* Required Action */}
                          {task.description && (
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Extra metadata pills: Location & Materials */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>Due: {task.dueDate} {task.dueTime ? `@ ${task.dueTime}` : ""}</span>
                            </span>
                            {task.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{task.location}</span>
                              </span>
                            )}
                            {task.requiredMaterials && (
                              <span className="flex items-center gap-1 text-slate-600">
                                <Package className="w-3.5 h-3.5 text-amber-500" />
                                <span>{task.requiredMaterials}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => onOpenTaskDetails(task)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200/80 shrink-0"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 col: Upcoming Events & Recent Announcements */}
        <div className="space-y-6">
          {/* Upcoming Events Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk'] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Upcoming Events</span>
              </h2>
              <button
                onClick={onNavigateToCalendar}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-2.5">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  onClick={onNavigateToCalendar}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{ev.title}</span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                      {ev.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{ev.time}</span>
                    <span>•</span>
                    <span>{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk'] flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Recent Circulars</span>
              </h2>
              <button
                onClick={onNavigateToAnnouncements}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All ({announcements.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 line-clamp-1">{ann.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{ann.createdAt.slice(0, 10)}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.simplifiedText || ann.originalText}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">{ann.createdBy}</span>
                    <button
                      onClick={onNavigateToAnalyze}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Analyze</span>
                      <Wand2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
