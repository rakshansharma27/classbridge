import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  CheckCircle2,
  Package,
  Layers,
  X,
} from "lucide-react";
import { CalendarEvent, Task } from "../types";
import { getDaysRemaining } from "../utils/conflictDetector";

interface CalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenTaskDetails: (task: Task) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  events,
  onOpenTaskDetails,
  onToggleTaskComplete,
}) => {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<{
    type: "task" | "event";
    task?: Task;
    event?: CalendarEvent;
  } | null>(null);

  // Demo active month is September 2026
  const [activeMonthYear, setActiveMonthYear] = useState({ year: 2026, month: 8 }); // 0-indexed: 8 is September

  // Unique subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.subject));
    events.forEach((e) => set.add(e.category));
    return ["All", ...Array.from(set)];
  }, [tasks, events]);

  // Color mapper
  const getSubjectColor = (subj: string) => {
    switch (subj.toLowerCase()) {
      case "science":
        return { bg: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-600" };
      case "mathematics":
        return { bg: "bg-amber-100 text-amber-900 border-amber-200", dot: "bg-amber-600" };
      case "english":
        return { bg: "bg-purple-100 text-purple-800 border-purple-200", dot: "bg-purple-600" };
      case "student council":
        return { bg: "bg-teal-100 text-teal-800 border-teal-200", dot: "bg-teal-600" };
      case "administrative":
      case "field trip / admin":
        return { bg: "bg-rose-100 text-rose-800 border-rose-200", dot: "bg-rose-600" };
      default:
        return { bg: "bg-slate-100 text-slate-800 border-slate-200", dot: "bg-slate-600" };
    }
  };

  // Calendar math for September 2026
  // Sept 1, 2026 was a Tuesday (day 2 of week starting Sunday 0)
  const monthDays = useMemo(() => {
    const year = activeMonthYear.year;
    const month = activeMonthYear.month;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Leading empty days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: "" });
    }
    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, dateStr });
    }
    return days;
  }, [activeMonthYear]);

  // Filter items for a specific date
  const getItemsForDate = (dateStr: string) => {
    if (!dateStr) return { tasks: [], events: [] };

    const matchingTasks = tasks.filter((t) => {
      const matchDate = t.dueDate === dateStr;
      const matchSubject = selectedSubject === "All" || t.subject === selectedSubject;
      return matchDate && matchSubject;
    });

    const matchingEvents = events.filter((e) => {
      const matchDate = e.date === dateStr;
      const matchSubject = selectedSubject === "All" || e.category === selectedSubject;
      return matchDate && matchSubject;
    });

    return { tasks: matchingTasks, events: matchingEvents };
  };

  // Weekly agenda days (Sept 20 to Sept 26, 2026)
  const weekAgendaDays = useMemo(() => {
    return [
      { dateStr: "2026-09-20", dayName: "Sun", dayNum: 20 },
      { dateStr: "2026-09-21", dayName: "Mon", dayNum: 21 },
      { dateStr: "2026-09-22", dayName: "Tue", dayNum: 22 },
      { dateStr: "2026-09-23", dayName: "Wed", dayNum: 23 },
      { dateStr: "2026-09-24", dayName: "Thu", dayNum: 24 },
      { dateStr: "2026-09-25", dayName: "Fri", dayNum: 25 },
      { dateStr: "2026-09-26", dayName: "Sat", dayNum: 26 },
    ];
  }, []);

  // Upcoming deadlines sorted
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => selectedSubject === "All" || t.subject === selectedSubject)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, selectedSubject]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
              Academic Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track all assignment due dates, school events, and deadlines in one synchronized view.
          </p>
        </div>

        {/* View mode toggle and Subject filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="calendar-select-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent border-none text-slate-700 focus:outline-none cursor-pointer"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Month / Week switcher */}
          <div className="p-1 bg-slate-100 rounded-xl flex items-center text-xs font-semibold">
            <button
              id="calendar-btn-month-view"
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "month"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly View
            </button>
            <button
              id="calendar-btn-week-view"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "week"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Weekly Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar (Left 2 cols) + Upcoming Deadlines (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Month / Week */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                  {viewMode === "month"
                    ? activeMonthYear.month === 8
                      ? "September 2026"
                      : "October 2026"
                    : "Week of Sept 20 – 26, 2026"}
                </h2>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Active Term
                </span>
              </div>

              {viewMode === "month" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveMonthYear({ year: 2026, month: 8 })}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                      activeMonthYear.month === 8 ? "text-blue-600 font-bold" : "text-slate-500"
                    }`}
                    title="September 2026"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveMonthYear({ year: 2026, month: 9 })}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                      activeMonthYear.month === 9 ? "text-blue-600 font-bold" : "text-slate-500"
                    }`}
                    title="October 2026"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* View Mode: Month View */}
            {viewMode === "month" ? (
              <div className="space-y-2">
                {/* Days of week header */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-1 uppercase tracking-wider">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {monthDays.map((d, idx) => {
                    if (!d.dayNumber) {
                      return (
                        <div
                          key={`empty-${idx}`}
                          className="min-h-[78px] sm:min-h-[92px] rounded-xl bg-slate-50/40 border border-transparent p-1"
                        />
                      );
                    }

                    const { tasks: dayTasks, events: dayEvents } = getItemsForDate(d.dateStr);
                    const isToday = d.dateStr === "2026-09-17";

                    return (
                      <div
                        key={d.dateStr}
                        className={`min-h-[78px] sm:min-h-[92px] rounded-xl border p-1 sm:p-1.5 flex flex-col justify-between transition-all ${
                          isToday
                            ? "bg-blue-50/30 border-blue-400 shadow-2xs"
                            : "bg-white border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                              isToday
                                ? "bg-blue-600 text-white"
                                : "text-slate-700"
                            }`}
                          >
                            {d.dayNumber}
                          </span>
                          {isToday && (
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight hidden sm:inline">
                              Today
                            </span>
                          )}
                        </div>

                        {/* Badges / Items */}
                        <div className="space-y-1 mt-1 overflow-hidden">
                          {dayTasks.map((t) => {
                            const colors = getSubjectColor(t.subject);
                            return (
                              <button
                                key={t.id}
                                onClick={() => setSelectedItem({ type: "task", task: t })}
                                className={`w-full text-left text-[10px] font-semibold px-1.5 py-0.5 rounded truncate border block transition-transform hover:scale-[1.02] ${colors.bg}`}
                                title={`${t.subject}: ${t.title}`}
                              >
                                {t.title}
                              </button>
                            );
                          })}

                          {dayEvents.map((e) => {
                            const colors = getSubjectColor(e.category);
                            return (
                              <button
                                key={e.id}
                                onClick={() => setSelectedItem({ type: "event", event: e })}
                                className={`w-full text-left text-[10px] font-semibold px-1.5 py-0.5 rounded truncate border block transition-transform hover:scale-[1.02] ${colors.bg}`}
                                title={`${e.category}: ${e.title}`}
                              >
                                {e.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* View Mode: Weekly Agenda View */
              <div className="space-y-3">
                {weekAgendaDays.map((d) => {
                  const { tasks: dayTasks, events: dayEvents } = getItemsForDate(d.dateStr);
                  const hasItems = dayTasks.length > 0 || dayEvents.length > 0;

                  return (
                    <div
                      key={d.dateStr}
                      className={`p-3.5 rounded-xl border transition-all ${
                        hasItems ? "bg-white border-slate-200 shadow-2xs" : "bg-slate-50/50 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800 font-['Space_Grotesk']">
                            {d.dayName}, Sept {d.dayNum}
                          </span>
                          {d.dateStr === "2026-09-25" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                              Major Deadline Day (Science Proposal)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {dayTasks.length + dayEvents.length} items
                        </span>
                      </div>

                      {hasItems ? (
                        <div className="space-y-2">
                          {dayTasks.map((t) => {
                            const colors = getSubjectColor(t.subject);
                            return (
                              <div
                                key={t.id}
                                onClick={() => setSelectedItem({ type: "task", task: t })}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                  <span className="text-xs font-bold text-slate-900">{t.title}</span>
                                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                    ({t.subject})
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-rose-600">
                                  Due {t.dueTime || "End of day"}
                                </span>
                              </div>
                            );
                          })}

                          {dayEvents.map((e) => {
                            const colors = getSubjectColor(e.category);
                            return (
                              <div
                                key={e.id}
                                onClick={() => setSelectedItem({ type: "event", event: e })}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                  <span className="text-xs font-bold text-slate-900">{e.title}</span>
                                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                    ({e.category})
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-blue-600">
                                  {e.time}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">No scheduled submissions</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 col: Upcoming Deadline List */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Upcoming Deadlines</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {upcomingDeadlines.length} total
              </span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((t) => {
                const daysInfo = getDaysRemaining(t.dueDate);
                const colors = getSubjectColor(t.subject);
                const isCompleted = t.status === "completed";

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedItem({ type: "task", task: t })}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${colors.bg}`}>
                        {t.subject}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          daysInfo.isOverdue
                            ? "text-rose-600"
                            : daysInfo.isToday || daysInfo.isTomorrow
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        {daysInfo.label}
                      </span>
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-bold leading-snug ${
                        isCompleted ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {t.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>{t.dueDate} {t.dueTime ? `@ ${t.dueTime}` : ""}</span>
                      <span className="font-semibold text-blue-600">Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Item Details Popover / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedItem.type === "task"
                    ? selectedItem.task?.subject
                    : selectedItem.event?.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedItem.type === "task"
                    ? selectedItem.task?.title
                    : selectedItem.event?.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem.type === "task" && selectedItem.task && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <p className="leading-relaxed text-slate-600">
                  {selectedItem.task.description || "Submit task according to school circular instructions."}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Due Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.task.dueDate} {selectedItem.task.dueTime ? `@ ${selectedItem.task.dueTime}` : ""}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.task.location || "Online"}
                    </span>
                  </div>
                </div>

                {selectedItem.task.requiredMaterials && (
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                    <strong className="block font-bold">Required Materials:</strong>
                    <span>{selectedItem.task.requiredMaterials}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (selectedItem.task) onToggleTaskComplete(selectedItem.task.id);
                      setSelectedItem(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedItem.task.status === "completed"
                        ? "Mark as Pending"
                        : "Mark as Completed"}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedItem.type === "event" && selectedItem.event && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <p className="leading-relaxed text-slate-600">
                  {selectedItem.event.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.event.date} at {selectedItem.event.time}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Venue</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.event.location}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-end border-t border-slate-100">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
