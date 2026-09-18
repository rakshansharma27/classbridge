import React, { useState, useMemo } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Filter,
  Search,
  BookOpen,
  Award,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { AttendanceRecord, User } from "../types";

interface StudentAttendanceViewProps {
  currentUser: User;
  attendanceRecords: AttendanceRecord[];
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({
  currentUser,
  attendanceRecords,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "late" | "absent">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter records specifically for this student
  const studentRecords = useMemo(() => {
    return attendanceRecords.filter((r) => r.studentId === currentUser.id);
  }, [attendanceRecords, currentUser.id]);

  // Unique subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    studentRecords.forEach((r) => set.add(r.subject));
    return ["All", ...Array.from(set)];
  }, [studentRecords]);

  // Aggregate Metrics
  const totalRecords = studentRecords.length;
  const presentCount = studentRecords.filter((r) => r.status === "present").length;
  const lateCount = studentRecords.filter((r) => r.status === "late").length;
  const absentCount = studentRecords.filter((r) => r.status === "absent").length;

  // Weighted percentage (late counts as 0.75 present for academic metrics)
  const overallPercentage =
    totalRecords > 0
      ? Math.round(((presentCount + lateCount * 0.75) / totalRecords) * 100)
      : 100;

  // Subject-wise percentage map
  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; present: number; late: number; absent: number; pct: number }> = {};
    studentRecords.forEach((r) => {
      if (!map[r.subject]) {
        map[r.subject] = { total: 0, present: 0, late: 0, absent: 0, pct: 0 };
      }
      map[r.subject].total += 1;
      if (r.status === "present") map[r.subject].present += 1;
      else if (r.status === "late") map[r.subject].late += 1;
      else if (r.status === "absent") map[r.subject].absent += 1;
    });

    Object.keys(map).forEach((sub) => {
      const s = map[sub];
      s.pct = Math.round(((s.present + s.late * 0.75) / s.total) * 100);
    });

    return map;
  }, [studentRecords]);

  // Filtered log table
  const filteredLog = useMemo(() => {
    return studentRecords.filter((r) => {
      if (selectedSubject !== "All" && r.subject !== selectedSubject) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.subject.toLowerCase().includes(q) ||
          r.date.includes(q) ||
          (r.remarks && r.remarks.toLowerCase().includes(q))
        );
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [studentRecords, selectedSubject, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 mb-3 border border-white/20">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Attendance & Classroom Participation Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Attendance Record
          </h1>
          <p className="text-emerald-100 text-sm mt-1.5 leading-relaxed">
            Monitor your overall standing, verified presence across subjects, and teacher remarks for {currentUser.grade || "Grade 10"}.
          </p>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {overallPercentage}%
            </div>
            <div className="text-xs font-medium text-slate-500">
              Overall Attendance
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
              {overallPercentage >= 85 ? "Excellent Standing" : "Needs Attention"}
            </div>
          </div>
        </div>

        {/* Present Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {presentCount} <span className="text-sm font-normal text-slate-400">/ {totalRecords}</span>
            </div>
            <div className="text-xs font-medium text-slate-500">
              Classes Present
            </div>
            <div className="text-[10px] font-semibold text-blue-600 mt-0.5">
              Verified Attendance
            </div>
          </div>
        </div>

        {/* Late Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {lateCount}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Late Arrivals
            </div>
            <div className="text-[10px] font-semibold text-amber-600 mt-0.5">
              Punctuality Rate: {Math.round(((totalRecords - lateCount) / Math.max(totalRecords, 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Absent Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {absentCount}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Absences Logged
            </div>
            <div className="text-[10px] font-semibold text-rose-600 mt-0.5">
              Medical / Excused
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Progress */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Subject-Wise Attendance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(subjectStats).map(([sub, stat]) => (
            <div
              key={sub}
              className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-slate-800">{sub}</span>
                <span
                  className={`text-xs font-extrabold ${
                    stat.pct >= 90
                      ? "text-emerald-600"
                      : stat.pct >= 75
                      ? "text-blue-600"
                      : "text-amber-600"
                  }`}
                >
                  {stat.pct}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    stat.pct >= 90
                      ? "bg-emerald-500"
                      : stat.pct >= 75
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${stat.pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Present: {stat.present}</span>
                <span>Late: {stat.late}</span>
                <span>Absent: {stat.absent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Chronological Attendance Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance Log</h3>
            <p className="text-xs text-slate-500">Detailed day-by-day record verified by teachers</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="late">Late Only</option>
              <option value="absent">Absent Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No attendance records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLog.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      {record.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {record.subject}
                    </td>
                    <td className="py-3 px-4">
                      {record.status === "present" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Present
                        </span>
                      ) : record.status === "late" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Late
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic">
                      {record.remarks || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
