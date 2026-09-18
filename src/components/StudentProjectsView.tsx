import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Link2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderPlus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  CheckSquare,
  Award,
  Calendar,
  Layers,
  X,
  Send,
} from "lucide-react";
import { Project, ProjectSubmission, User } from "../types";
import { triggerConfetti } from "../utils/confetti";

interface StudentProjectsViewProps {
  currentUser: User;
  projects: Project[];
  submissions: ProjectSubmission[];
  onSubmitProject: (submission: ProjectSubmission) => void;
}

export const StudentProjectsView: React.FC<StudentProjectsViewProps> = ({
  currentUser,
  projects,
  submissions,
  onSubmitProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all");

  // Form State for Project Upload
  const [submissionUrl, setSubmissionUrl] = useState<string>("");
  const [submissionNotes, setSubmissionNotes] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Helper to get submission for a project
  const getStudentSubmission = (projectId: string) => {
    return submissions.find(
      (s) => s.projectId === projectId && s.studentId === currentUser.id
    );
  };

  const handleOpenFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    const existingSub = getStudentSubmission(project.id);
    if (existingSub) {
      setSubmissionUrl(existingSub.fileContentOrUrl || "");
      setSubmissionNotes(existingSub.notes || "");
      setUploadedFileName(existingSub.fileName || "");
      setUploadedFileSize(existingSub.fileSize || "");
    } else {
      setSubmissionUrl("");
      setSubmissionNotes("");
      setUploadedFileName("");
      setUploadedFileSize("");
    }
    setSubmissionSuccess(false);
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (!uploadedFileName && !submissionUrl.trim()) {
      alert("Please either attach a project file or provide an online project link.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const existingSub = getStudentSubmission(selectedProject.id);
      const newSubmission: ProjectSubmission = {
        id: existingSub ? existingSub.id : `sub-${Date.now()}`,
        projectId: selectedProject.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAvatar: currentUser.avatar,
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        fileName: uploadedFileName || "Project_Online_Submission.pdf",
        fileSize: uploadedFileSize || "1.2 MB",
        fileContentOrUrl: submissionUrl.trim() || undefined,
        notes: submissionNotes.trim() || undefined,
        status: existingSub?.status === "graded" ? "graded" : "submitted",
        grade: existingSub?.grade,
        feedback: existingSub?.feedback,
      };

      onSubmitProject(newSubmission);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      triggerConfetti({ durationMs: 3000, particleCount: 140 });

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSubmissionSuccess(false);
      }, 1200);
    }, 600);
  };

  // Filtered projects
  const filteredProjects = projects.filter((project) => {
    const sub = getStudentSubmission(project.id);
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "pending") return !sub;
    if (filter === "submitted") return sub && sub.status === "submitted";
    if (filter === "graded") return sub && sub.status === "graded";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
            <span>Online Project Submission Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Class Projects & Assignments
          </h1>
          <p className="text-blue-100 text-sm mt-1.5 leading-relaxed">
            Upload your homework blueprints, laboratory write-ups, and slides directly to your teachers. Track submission receipts, grades, and teacher feedback in real time.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects by title, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "pending", "submitted", "graded"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-all ${
                filter === mode
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mode === "all" ? "All Projects" : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const submission = getStudentSubmission(project.id);
          const isGraded = submission?.status === "graded";
          const isSubmitted = !!submission;

          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-100">
                    {project.subject}
                  </span>

                  {/* Submission Status Badge */}
                  {isGraded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Graded: {submission.grade}/{project.maxMarks}
                    </span>
                  ) : isSubmitted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 flex-1">
                  {project.description}
                </p>

                {/* Deadlines & Marks Info */}
                <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due Date:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {project.dueDate} ({project.dueTime})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      Max Marks:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {project.maxMarks} pts
                    </span>
                  </div>
                  {project.allowOnlineUpload && (
                    <div className="flex items-center justify-between text-indigo-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <UploadCloud className="w-3.5 h-3.5" />
                        Online Upload:
                      </span>
                      <span className="font-bold text-[11px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-800">
                        Enabled
                      </span>
                    </div>
                  )}
                </div>

                {/* Submission Preview / Feedback if Graded */}
                {isGraded && submission?.feedback && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      Teacher's Feedback:
                    </div>
                    <p className="text-emerald-800 italic">"{submission.feedback}"</p>
                  </div>
                )}

                {isSubmitted && !isGraded && (
                  <div className="mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
                    <span className="truncate">File: {submission.fileName}</span>
                    <span className="text-[10px] font-semibold text-blue-600 shrink-0 ml-2">
                      {submission.submittedAt}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                {project.allowOnlineUpload ? (
                  <button
                    onClick={() => handleOpenModal(project)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      isSubmitted
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isSubmitted ? "View / Update Online Upload" : "Upload Project Online"}</span>
                  </button>
                ) : (
                  <div className="text-center text-xs text-slate-500 font-medium py-1">
                    Physical Submission Required (See Instructions)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Upload Modal */}
      {isUploadModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Submit Assignment Online</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {selectedProject.subject}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedProject.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedProject.instructions}
                </p>
              </div>

              {/* Drag and drop / File Upload Box */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/60 transition-colors">
                <input
                  type="file"
                  id="project-file-input"
                  onChange={handleOpenFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="project-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-600 hover:underline">
                      Click to choose file
                    </span>
                    <span className="text-xs text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PDF, DOCX, ZIP, PPTX, or JPG (Up to 25MB)
                  </p>
                </label>

                {uploadedFileName && (
                  <div className="mt-3 p-2 bg-blue-100/60 border border-blue-300 rounded-lg flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold truncate">{uploadedFileName}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 shrink-0 ml-2">
                      {uploadedFileSize}
                    </span>
                  </div>
                )}
              </div>

              {/* Online Project Link Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Project Link / GitHub / Google Drive URL
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/... or https://github.com/..."
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submission Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Comments & Team Members (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes for the teacher, team member names, or special considerations..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {submissionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Project submitted successfully! Receipt saved.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Uploading..." : "Confirm & Submit Online"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
