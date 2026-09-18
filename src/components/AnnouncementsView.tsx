import React, { useState, useMemo } from "react";
import {
  Bell,
  Search,
  Wand2,
  Calendar,
  MapPin,
  Package,
  Users,
  Filter,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Announcement } from "../types";

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onAnalyzeAnnouncementText: (text: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onAnalyzeAnnouncementText,
}) => {
  const [search, setSearch] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("All");
  const [simplifiedStates, setSimplifiedStates] = useState<Record<string, boolean>>({});

  const toggleSimplified = (id: string) => {
    setSimplifiedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = useMemo(() => {
    return announcements.filter((ann) => {
      const matchSearch =
        ann.title.toLowerCase().includes(search.toLowerCase()) ||
        ann.originalText.toLowerCase().includes(search.toLowerCase()) ||
        ann.category.toLowerCase().includes(search.toLowerCase());

      const matchAudience =
        selectedAudience === "All" ||
        ann.targetAudience.toLowerCase().includes(selectedAudience.toLowerCase());

      return matchSearch && matchAudience;
    });
  }, [announcements, search, selectedAudience]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
              School Circulars & Notices
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse all school announcements or convert any notice into an action item with the AI analyzer.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keyword, department, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-slate-500">Audience:</span>
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Audiences</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Entire school">Entire School</option>
            <option value="Council">Student Council</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No announcements found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or audience filter.</p>
          </div>
        ) : (
          filtered.map((ann) => {
            const isSimplified = !!simplifiedStates[ann.id];

            return (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {ann.category}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {ann.targetAudience}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {ann.createdAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {ann.title}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      By {ann.createdBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleSimplified(ann.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                        isSimplified
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isSimplified ? "View Original" : "Explain Simply"}</span>
                    </button>

                    <button
                      onClick={() => onAnalyzeAnnouncementText(ann.originalText)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Analyze with AI</span>
                    </button>
                  </div>
                </div>

                {/* Announcement Body */}
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed transition-all ${
                    isSimplified
                      ? "bg-amber-50/80 border border-amber-200/80 text-amber-950 font-medium"
                      : "bg-slate-50 border border-slate-100 text-slate-700 font-serif italic"
                  }`}
                >
                  {isSimplified ? (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                        Simple Explanation:
                      </span>
                      <p>{ann.simplifiedText}</p>
                    </div>
                  ) : (
                    <p>“{ann.originalText}”</p>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  {ann.deadline && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span><strong>Deadline:</strong> {ann.deadline}</span>
                    </span>
                  )}
                  {ann.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span><strong>Location:</strong> {ann.location}</span>
                    </span>
                  )}
                  {ann.requiredMaterials && (
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-500" />
                      <span><strong>Materials:</strong> {ann.requiredMaterials}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
