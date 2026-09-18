import React, { useState } from "react";
import {
  BookOpen,
  PlusCircle,
  FileText,
  Trash2,
  Tag,
  Upload,
  Eye,
  CheckCircle2,
  X,
  Send,
  Layers,
} from "lucide-react";
import { ClassNote, User } from "../types";

interface TeacherNotesViewProps {
  currentUser: User;
  notes: ClassNote[];
  onUploadNote: (note: ClassNote) => void;
  onDeleteNote: (noteId: string) => void;
}

export const TeacherNotesView: React.FC<TeacherNotesViewProps> = ({
  currentUser,
  notes,
  onUploadNote,
  onDeleteNote,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [previewNote, setPreviewNote] = useState<ClassNote | null>(null);

  // Form State
  const [title, setTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("Science");
  const [chapterOrTopic, setChapterOrTopic] = useState<string>("");
  const [type, setType] = useState<ClassNote["type"]>("lecture_note");
  const [content, setContent] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("Formula, ExamPrep");
  const [fileName, setFileName] = useState<string>("");

  const handleOpenUploadModal = () => {
    setTitle("");
    setChapterOrTopic("");
    setContent("");
    setTagsInput("");
    setFileName("");
    setIsUploadModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide both a title and study note content.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const newNote: ClassNote = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      subject,
      chapterOrTopic: chapterOrTopic.trim() || "General Topic",
      type,
      content: content.trim(),
      fileName: fileName.trim() || `${title.replace(/\s+/g, "_")}.md`,
      fileSize: `${(content.length / 1024).toFixed(1)} KB`,
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().substring(0, 10),
      tags: tags.length > 0 ? tags : ["ClassroomNotes"],
    };

    onUploadNote(newNote);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2 border border-white/20">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Curriculum & Study Materials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Class Notes & Assessments
          </h1>
          <p className="text-blue-100 text-sm mt-1 leading-relaxed">
            Upload lecture notes, assessment rubrics, and formula sheets for your classes. Students can read and download them anytime.
          </p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="relative z-10 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Material</span>
        </button>
      </div>

      {/* Uploaded Materials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                  {note.subject}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                  {note.type.replace("_", " ")}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                {note.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-3">
                {note.chapterOrTopic}
              </p>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 line-clamp-3 font-mono border border-slate-100 mb-3">
                {note.content.replace(/[#*$`]/g, "").slice(0, 150)}...
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map((t) => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Date: {note.uploadedAt}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Preview Note"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete material "${note.title}"?`)) {
                      onDeleteNote(note.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Upload Notes or Assessment Material</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 6: Chemical Kinetics & Rates of Reaction"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapter or Topic Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 4: Cell Biology"
                    value={chapterOrTopic}
                    onChange={(e) => setChapterOrTopic(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lecture_note">Lecture Notes</option>
                    <option value="formula_sheet">Formula Cheat Sheet</option>
                    <option value="assessment">Assessment & Evaluation Rubric</option>
                    <option value="revision">Revision Summary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes Content (Markdown & Formulas supported) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="# Enter lecture notes, summaries, formulas, and bullet points here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Biology, Mitosis, ExamPrep"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Downloadable File Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Science_Chapter6_Summary.md"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Student Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">{previewNote.title}</h3>
              <button
                onClick={() => setPreviewNote(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
                {previewNote.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
