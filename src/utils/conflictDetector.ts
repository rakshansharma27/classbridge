import { Task } from "../types";

export interface ConflictWarning {
  hasConflict: boolean;
  countThisWeek: number;
  message: string;
  suggestedAction: string;
  conflictingTaskTitles: string[];
}

/**
 * Dynamically detects deadline clusters across pending tasks.
 * Uses a rolling 7-day clustering algorithm so it works dynamically with both
 * pre-seeded demo tasks and any newly created live tasks.
 */
export function detectDeadlineConflicts(tasks: Task[]): ConflictWarning {
  // Filter active pending tasks with valid due dates
  const pendingTasks = tasks.filter((t) => t.status === "pending" && t.dueDate);

  if (pendingTasks.length === 0) {
    return {
      hasConflict: false,
      countThisWeek: 0,
      message: "Your upcoming schedule is clear and on track.",
      suggestedAction: "Great job keeping on top of deadlines!",
      conflictingTaskTitles: [],
    };
  }

  // Sort tasks by due date
  const sortedTasks = [...pendingTasks].sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

  // Check rolling 7-day clusters
  let densestCluster: Task[] = [];

  for (let i = 0; i < sortedTasks.length; i++) {
    const baseDate = new Date(sortedTasks[i].dueDate + "T00:00:00");
    if (isNaN(baseDate.getTime())) continue;

    const windowEnd = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const cluster = sortedTasks.filter((t) => {
      const d = new Date(t.dueDate + "T00:00:00");
      return d >= baseDate && d <= windowEnd;
    });

    if (cluster.length > densestCluster.length) {
      densestCluster = cluster;
    }
  }

  const count = densestCluster.length;

  if (count >= 3) {
    const scienceTask = densestCluster.find(
      (t) =>
        t.title.toLowerCase().includes("science exhibition") ||
        t.title.toLowerCase().includes("proposal") ||
        t.urgency === "Urgent"
    );
    const highlightedTask = scienceTask ? scienceTask.title : densestCluster[0].title;

    return {
      hasConflict: true,
      countThisWeek: count,
      message: `Heads up! You have ${count} major deadlines clustered within a 7-day window. Consider starting your "${highlightedTask}" early.`,
      suggestedAction: "Pacing your submissions across consecutive weekdays will prevent submission bottlenecks and keep your weekend stress-free.",
      conflictingTaskTitles: densestCluster.map((t) => t.title),
    };
  }

  if (count === 2) {
    return {
      hasConflict: false,
      countThisWeek: 2,
      message: `You have 2 assignments coming up in the same week. Your schedule looks well balanced.`,
      suggestedAction: "Knocking out the earlier task will leave you plenty of breathing room.",
      conflictingTaskTitles: densestCluster.map((t) => t.title),
    };
  }

  return {
    hasConflict: false,
    countThisWeek: count,
    message: "Your upcoming schedule is clear and on track.",
    suggestedAction: "Great job keeping on top of deadlines!",
    conflictingTaskTitles: densestCluster.map((t) => t.title),
  };
}

/**
 * Calculates human-readable countdown relative to the active date anchor.
 * Seamlessly handles preloaded demo dates (Sept 2026 anchor) and real-time live tasks.
 */
export function getDaysRemaining(dueDateStr: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  // If date belongs to the curated demo timeline, anchor to Sept 18 2026; otherwise use real today
  const isDemoRange = dueDateStr.startsWith("2026-09");
  const ref = isDemoRange ? new Date("2026-09-18T00:00:00") : new Date();
  ref.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDateStr}T00:00:00`);
  const diffTime = due.getTime() - ref.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false, isTomorrow: false };
  }
  if (diffDays === 0) {
    return { label: "Due today", isOverdue: false, isToday: true, isTomorrow: false };
  }
  if (diffDays === 1) {
    return { label: "Due tomorrow", isOverdue: false, isToday: false, isTomorrow: true };
  }
  if (diffDays <= 7) {
    return { label: `In ${diffDays} days`, isOverdue: false, isToday: false, isTomorrow: false };
  }
  return { label: `In ${Math.ceil(diffDays / 7)} wks`, isOverdue: false, isToday: false, isTomorrow: false };
}
