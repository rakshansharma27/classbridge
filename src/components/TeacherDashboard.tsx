import React, { useState } from "react";
import {
  School,
  PlusCircle,
  Eye,
  Send,
  Calendar,
  MapPin,
  Package,
  Users,
  CheckCircle2,
  Trash2,
  Sparkles,
  FileText,
  Clock,
  X,
  UploadCloud,
  CalendarCheck2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Announcement, User } from "../types";
import { TARGET_AUDIENCE_OPTIONS } from "../data/mockData";

interface TeacherDashboardProps {
  user: User;
  announcements: Announcement[];
  onPublishAnnouncement: (newAnn: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onSwitchToStudentView: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToQuizzes?: () => void;
  onNavigateToNotes?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  announcements,
  onPublishAnnouncement,
  onDeleteAnnouncement,
  onSwitchToStudentView,
  onNavigateToProjects,
  onNavigateToAttendance,
  onNavigateToQuizzes,
  onNavigateToNotes,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [deadlineDate, setDeadlineDate] = useState<string>("2026-09-25");
  const [deadlineTime, setDeadlineTime] = useState<string>("16:00");
  const [location, setLocation] = useState<string>("");
  const [requiredMaterials, setRequiredMaterials] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("Grade 10");
  const [category, setCategory] = useState<string>("Science");
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleResetForm = () => {
    setTitle("");
    setMessage("");
    setDeadlineDate("2026-09-25");
    setDeadlineTime("16:00");
    setLocation("");
    setRequiredMaterials("");
    setTargetAudience("Grade 10");
    setCategory("Science");
    setIsPreviewing(false);
    setFormError("");
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFormError("Please fill in both the announcement title and message.");
      return;
    }

    const formattedDeadline = deadlineDate
      ? `${deadlineDate} at ${deadlineTime || "16:00"}`
      : undefined;

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      originalText: message.trim(),
      simplifiedText: `Action required for ${targetAudience}: ${title}. Submit by ${formattedDeadline || "specified date"}. Location: ${location || "Campus"}.`,
      category: category || "General",
      targetAudience: targetAudience || "Grade 10",
      createdBy: `${user.name} (${user.department || "Faculty"})`,
      createdAt: "Just now",
      location: location.trim() || undefined,
      deadline: formattedDeadline,
      requiredMaterials: requiredMaterials.trim() || undefined,
      requiredAction: `Review announcement details and prepare required materials: ${requiredMaterials || "as instructed"}.`,
      urgency: "Soon",
    };

    onPublishAnnouncement(newAnnouncement);
    setPublishSuccess(true);
    setShowCreateModal(false);
    handleResetForm();

    setTimeout(() => {
      setPublishSuccess(false);
    }, 4500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Teacher Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <School className="w-3.5 h-3.5 text-indigo-400" />
            <span>Faculty Portal • {user.department}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
            Welcome, {user.name}
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl leading-relaxed">
            Create structured announcements that automatically parse into organized student tasks, calendar events, and material checklists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="teacher-btn-create-modal"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
          <button
            onClick={onSwitchToStudentView}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Preview as Student →
          </button>
        </div>
      </div>

      {/* Quick Academic Management Hub Cards (4 Modules) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onNavigateToProjects}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-blue-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
              Projects & Submissions
            </div>
            <div className="text-[10px] text-slate-500">Enable uploads & grade</div>
          </div>
        </button>

        <button
          onClick={onNavigateToAttendance}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-teal-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors mb-2">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-teal-600">
              Mark Attendance
            </div>
            <div className="text-[10px] text-slate-500">Daily roll call & lates</div>
          </div>
        </button>

        <button
          onClick={onNavigateToQuizzes}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-purple-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors mb-2">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-purple-600">
              Quiz Creator
            </div>
            <div className="text-[10px] text-slate-500">20m, 30m & practice</div>
          </div>
        </button>

        <button
          onClick={onNavigateToNotes}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm hover:border-indigo-300 text-left transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
              Upload Notes
            </div>
            <div className="text-[10px] text-slate-500">Formulas & rubrics</div>
          </div>
        </button>
      </div>

      {/* Success Notification */}
      {publishSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Announcement published successfully! Students can now see it and extract it to their plan.</span>
          </div>
          <button
            onClick={onSwitchToStudentView}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
          >
            View on Student Dashboard
          </button>
        </div>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Published Announcements
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-['Space_Grotesk']">
            {announcements.length}
          </span>
          <span className="text-xs text-slate-500">Live for Grade 10 & School</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Target Audience
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-['Space_Grotesk']">
            Grade 10
          </span>
          <span className="text-xs text-slate-500">Science Exhibition Proposals</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Clarity Score
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block font-['Space_Grotesk']">
            98%
          </span>
          <span className="text-xs text-slate-500">Auto-extracted structure</span>
        </div>
      </div>

      {/* Previously Published Announcements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Published Circulars & Announcements
            </h2>
            <p className="text-xs text-slate-500">
              Notices published by you and departmental staff
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Circular</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.map((ann) => (
            <div key={ann.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {ann.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {ann.targetAudience}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {ann.createdAt}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{ann.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                {ann.originalText}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                {ann.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Deadline: {ann.deadline}</span>
                  </span>
                )}
                {ann.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{ann.location}</span>
                  </span>
                )}
                {ann.requiredMaterials && (
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    <span>Materials: {ann.requiredMaterials}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                  Create School Announcement
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish clear information for students and departments
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  handleResetForm();
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            {/* Toggle Preview Mode */}
            <div className="flex justify-end">
              <button
                type="button"
                id="btn-preview-announcement"
                onClick={() => setIsPreviewing(!isPreviewing)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isPreviewing
                    ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isPreviewing ? "Edit Announcement Form" : "Preview Announcement"}</span>
              </button>
            </div>

            {isPreviewing ? (
              /* Announcement Preview */
              <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Student Preview
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Audience: {targetAudience}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{title || "Untitled Announcement"}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
                  “{message || "No announcement text entered yet."}”
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block font-medium">Submission Deadline</span>
                    <span className="font-bold text-slate-800">{deadlineDate} at {deadlineTime}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="font-bold text-slate-800">{location || "Not specified"}</span>
                  </div>
                </div>
                {requiredMaterials && (
                  <div className="p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                    <strong>Materials needed:</strong> {requiredMaterials}
                  </div>
                )}
              </div>
            ) : (
              /* Announcement Form */
              <form onSubmit={handlePublish} className="space-y-4 text-xs sm:text-sm">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Science Exhibition Project Proposal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message Body *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter full announcement details for students..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm leading-relaxed resize-y"
                  />
                </div>

                {/* Target Audience & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Audience *
                    </label>
                    <select
                      id="select-target-audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium cursor-pointer"
                    >
                      {TARGET_AUDIENCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject / Department
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deadline Date
                    </label>
                    <input
                      type="date"
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deadline Time
                    </label>
                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Location and Required Materials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location / Portal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Science Dept Portal and Lab 2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Required Materials
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Printed project proposal"
                      value={requiredMaterials}
                      onChange={(e) => setRequiredMaterials(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      handleResetForm();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="btn-publish-announcement"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Announcement</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
