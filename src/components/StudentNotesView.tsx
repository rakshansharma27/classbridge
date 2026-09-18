import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Download,
  FileText,
  Search,
  Tag,
  Eye,
  Calendar,
  Sparkles,
  Layers,
  X,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { ClassNote, User } from "../types";

interface StudentNotesViewProps {
  currentUser: User;
  notes: ClassNote[];
}

export const StudentNotesView: React.FC<StudentNotesViewProps> = ({
  currentUser,
  notes,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNoteModal, setActiveNoteModal] = useState<ClassNote | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Available subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => set.add(n.subject));
    return ["All", ...Array.from(set)];
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedSubject !== "All" && n.subject !== selectedSubject) return false;
      if (selectedType !== "All" && n.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.chapterOrTopic.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [notes, selectedSubject, selectedType, searchQuery]);

  // Real client-side file download
  const handleDownloadFile = (note: ClassNote) => {
    const blob = new Blob([note.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = note.fileName || `${note.title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(note.id);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const getCategoryLabel = (type: ClassNote["type"]) => {
    switch (type) {
      case "lecture_note":
        return { label: "Lecture Notes", color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "formula_sheet":
        return { label: "Formula Sheet", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "assessment":
        return { label: "Assessment Guide", color: "bg-purple-50 text-purple-700 border-purple-200" };
      case "revision":
        return { label: "Revision Summary", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      default:
        return { label: "Class Note", color: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Teacher Study Materials & Lecture Notes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Class Notes & Resources
          </h1>
          <p className="text-sky-100 text-sm mt-1.5 leading-relaxed">
            Review lecture summaries, formula cheat sheets, and assessment rubrics uploaded directly by your teachers for {currentUser.grade || "Grade 10"}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes, topics, formulas, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Subjects" : s}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Resource Types</option>
            <option value="lecture_note">Lecture Notes</option>
            <option value="formula_sheet">Formula Sheets</option>
            <option value="assessment">Assessment Guides</option>
            <option value="revision">Revision Summaries</option>
          </select>
        </div>
      </div>

      {/* Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const typeBadge = getCategoryLabel(note.type);
          const isJustDownloaded = downloadSuccess === note.id;

          return (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                    {note.subject}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeBadge.color}`}
                  >
                    {typeBadge.label}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                  {note.title}
                </h3>
                <div className="text-xs font-medium text-slate-500 mb-3">
                  {note.chapterOrTopic}
                </div>

                {/* Content Snippet */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 font-mono">
                  {note.content.replace(/[#*$`]/g, "").slice(0, 160)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Uploaded by: {note.uploadedBy.split(" ")[0]}</span>
                  <span>{note.fileSize || "Text Document"}</span>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveNoteModal(note)}
                  className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Note</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(note)}
                  className={`py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    isJustDownloaded
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  }`}
                >
                  {isJustDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Reader Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  {activeNoteModal.subject} • {activeNoteModal.chapterOrTopic}
                </span>
                <h3 className="font-bold text-base mt-0.5">{activeNoteModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Author: {activeNoteModal.uploadedBy}</span>
                <span>Date: {activeNoteModal.uploadedAt}</span>
              </div>

              {/* Formatted Content Viewer */}
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                {activeNoteModal.content}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeNoteModal.tags.map((t) => (
                  <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                File: {activeNoteModal.fileName || "study_note.md"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveNoteModal(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadFile(activeNoteModal)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
