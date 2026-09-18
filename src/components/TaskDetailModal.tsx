import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Package,
  CheckCircle2,
  Square,
  CheckSquare,
  Trash2,
  Users,
  Layers,
} from "lucide-react";
import { Task } from "../types";
import { getDaysRemaining } from "../utils/conflictDetector";

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onToggleComplete,
  onDeleteTask,
}) => {
  if (!task) return null;

  const daysInfo = getDaysRemaining(task.dueDate);
  const isCompleted = task.status === "completed";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">
                {task.subject}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  task.urgency === "Urgent"
                    ? "bg-rose-100 text-rose-800"
                    : task.urgency === "Soon"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {task.urgency}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {daysInfo.label}
              </span>
            </div>
            <h3
              className={`text-xl font-bold text-slate-900 leading-snug ${
                isCompleted ? "line-through text-slate-400" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description / Required Action */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Instructions & Action
          </span>
          <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800">
            {task.description || "Submit task according to announcement requirements."}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due Date</span>
            </span>
            <span className="font-bold text-slate-800 block text-xs sm:text-sm">
              {task.dueDate} {task.dueTime ? `@ ${task.dueTime}` : ""}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location / Venue</span>
            </span>
            <span className="font-bold text-slate-800 block text-xs sm:text-sm truncate">
              {task.location || "Online"}
            </span>
          </div>
        </div>

        {/* Required Materials */}
        {task.requiredMaterials && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Required Materials to Prepare:</span>
            </div>
            <p className="leading-relaxed">{task.requiredMaterials}</p>
          </div>
        )}

        {/* Team limits */}
        {task.teamInfo && (
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span><strong>Collaboration:</strong> {task.teamInfo}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 p-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              }`}
            >
              {isCompleted ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Mark Incomplete</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
