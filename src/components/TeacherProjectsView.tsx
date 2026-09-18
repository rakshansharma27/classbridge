import React, { useState } from "react";
import {
  FolderPlus,
  UploadCloud,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  ExternalLink,
  PlusCircle,
  Search,
  Users,
  Edit3,
  Calendar,
  X,
  Send,
  MessageSquare,
} from "lucide-react";
import { Project, ProjectSubmission, User } from "../types";

interface TeacherProjectsViewProps {
  currentUser: User;
  projects: Project[];
  submissions: ProjectSubmission[];
  onCreateProject: (project: Project) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
}

export const TeacherProjectsView: React.FC<TeacherProjectsViewProps> = ({
  currentUser,
  projects,
  submissions,
  onCreateProject,
  onGradeSubmission,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("All");

  // Create Project Form State
  const [title, setTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("Science");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("2026-09-25");
  const [dueTime, setDueTime] = useState<string>("16:00");
  const [allowOnlineUpload, setAllowOnlineUpload] = useState<boolean>(true);
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [instructions, setInstructions] = useState<string>("");
  const [assignedGrade, setAssignedGrade] = useState<string>("Grade 10");

  // Grading Modal Form State
  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>("");

  const handleOpenCreateModal = () => {
    setTitle("");
    setDescription("");
    setInstructions("");
    setMaxMarks(50);
    setDueDate("2026-09-25");
    setDueTime("16:00");
    setAllowOnlineUpload(true);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please specify a project title.");
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      subject,
      description: description.trim() || "Complete the designated assignment following classroom guidelines.",
      dueDate,
      dueTime,
      allowOnlineUpload,
      maxMarks: Number(maxMarks) || 50,
      instructions: instructions.trim() || "Upload your completed project documentation or provide a link before the deadline.",
      assignedGrade,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    onCreateProject(newProject);
    setIsCreateModalOpen(false);
  };

  const handleOpenGradingModal = (sub: ProjectSubmission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.grade !== undefined ? sub.grade : 0);
    setFeedbackInput(sub.feedback || "");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    onGradeSubmission(selectedSubmission.id, Number(gradeInput), feedbackInput.trim());
    setSelectedSubmission(null);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedProjectFilter === "All") return true;
    return sub.projectId === selectedProjectFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2 border border-white/20">
            <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
            <span>Assignment & Project Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Projects & Student Uploads
          </h1>
          <p className="text-blue-100 text-sm mt-1 leading-relaxed">
            Create assignments, enable online file/link uploads for students, and review & grade incoming student submissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="relative z-10 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project Assignment</span>
        </button>
      </div>

      {/* Projects Roster Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const count = submissions.filter((s) => s.projectId === proj.id).length;
          const gradedCount = submissions.filter((s) => s.projectId === proj.id && s.status === "graded").length;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-blue-600 uppercase text-[10px] tracking-wider">
                    {proj.subject}
                  </span>
                  <span className="text-slate-400">{proj.assignedGrade || "Grade 10"}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Due: {proj.dueDate}</span>
                  <span>Max: {proj.maxMarks} pts</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-slate-700">
                  <span className="font-medium">Submissions:</span>
                  <span className="font-bold text-blue-700">
                    {count} received ({gradedCount} graded)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Submissions Review Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Incoming Student Submissions</h3>
            <p className="text-xs text-slate-500">Review student files, assess work, and provide feedback</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Filter Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Attached Work / File</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status & Grade</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No submissions found for the selected project.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const project = projects.find((p) => p.id === sub.projectId);
                  const isGraded = sub.status === "graded";

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                            alt={sub.studentName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-semibold text-slate-900">{sub.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                        {project?.title || "Class Project"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {sub.fileName && (
                            <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[150px]">{sub.fileName}</span>
                            </div>
                          )}
                          {sub.fileContentOrUrl && (
                            <a
                              href={sub.fileContentOrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Online Link</span>
                            </a>
                          )}
                          {sub.notes && (
                            <p className="text-[10px] text-slate-500 italic truncate max-w-[160px]">
                              Note: {sub.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {sub.submittedAt}
                      </td>
                      <td className="py-3 px-4">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Award className="w-3 h-3 text-emerald-600" />
                            {sub.grade} / {project?.maxMarks || 50} pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Needs Grading
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                            isGraded
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                          }`}
                        >
                          {isGraded ? "Edit Grade" : "Grade Submission"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Create New Project Assignment</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition Project Proposal & Blueprint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Marks / Score
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of project goals and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Instructions for Students
                </label>
                <textarea
                  rows={2}
                  placeholder="Format requirements, page limits, rubric details..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Toggle Online Upload Option (Key User Requirement 3.1) */}
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    Allow Online Upload by Students
                  </span>
                  <span className="text-[11px] text-blue-700">
                    Enables file upload and external drive/github link submission in student portal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowOnlineUpload}
                  onChange={(e) => setAllowOnlineUpload(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Grade Student Submission</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Student:</div>
                <div className="font-bold text-slate-900 text-sm">{selectedSubmission.studentName}</div>
                {selectedSubmission.fileName && (
                  <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedSubmission.fileName} ({selectedSubmission.fileSize})</span>
                  </div>
                )}
                {selectedSubmission.notes && (
                  <div className="text-xs text-slate-500 mt-1 italic">
                    "{selectedSubmission.notes}"
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Awarded (Score)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Constructive Feedback & Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide praise and actionable areas for improvement..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Save & Post Grade</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
