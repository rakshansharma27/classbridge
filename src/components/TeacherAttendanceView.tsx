import React, { useState, useMemo } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Save,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";
import { AttendanceRecord, User } from "../types";
import { DEMO_STUDENTS } from "../data/mockData";

interface TeacherAttendanceViewProps {
  currentUser: User;
  attendanceRecords: AttendanceRecord[];
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => void;
}

export const TeacherAttendanceView: React.FC<TeacherAttendanceViewProps> = ({
  currentUser,
  attendanceRecords,
  onSaveAttendanceBatch,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("Science");
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-17");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Local state for the current session being edited
  const [rosterStatus, setRosterStatus] = useState<
    Record<string, { status: "present" | "absent" | "late"; remarks: string }>
  >(() => {
    const init: Record<string, { status: "present" | "absent" | "late"; remarks: string }> = {};
    DEMO_STUDENTS.forEach((student) => {
      // Look up if already recorded for this subject and date
      const match = attendanceRecords.find(
        (r) => r.studentId === student.id && r.date === "2026-09-17" && r.subject === "Science"
      );
      init[student.id] = {
        status: match ? match.status : "present",
        remarks: match?.remarks || "",
      };
    });
    return init;
  });

  // Handle change date or subject: populate with existing if any
  const handleDateOrSubjectChange = (newDate: string, newSub: string) => {
    setSelectedDate(newDate);
    setSelectedSubject(newSub);
    setSaveSuccess(false);

    const updated: Record<string, { status: "present" | "absent" | "late"; remarks: string }> = {};
    DEMO_STUDENTS.forEach((student) => {
      const match = attendanceRecords.find(
        (r) => r.studentId === student.id && r.date === newDate && r.subject === newSub
      );
      updated[student.id] = {
        status: match ? match.status : "present",
        remarks: match?.remarks || "",
      };
    });
    setRosterStatus(updated);
  };

  const handleStatusToggle = (studentId: string, status: "present" | "absent" | "late") => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
    setSaveSuccess(false);
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRosterStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
    setSaveSuccess(false);
  };

  const handleMarkAllPresent = () => {
    const allPres: Record<string, { status: "present" | "absent" | "late"; remarks: string }> = {};
    DEMO_STUDENTS.forEach((st) => {
      allPres[st.id] = {
        status: "present",
        remarks: rosterStatus[st.id]?.remarks || "",
      };
    });
    setRosterStatus(allPres);
  };

  const handleSave = () => {
    const newRecords: AttendanceRecord[] = DEMO_STUDENTS.map((student) => {
      const info = rosterStatus[student.id] || { status: "present", remarks: "" };
      return {
        id: `att-${student.id}-${selectedDate}-${selectedSubject}`,
        studentId: student.id,
        studentName: student.name,
        date: selectedDate,
        subject: selectedSubject,
        status: info.status,
        remarks: info.remarks || undefined,
      };
    });

    onSaveAttendanceBatch(newRecords);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const presentCount = Object.values(rosterStatus).filter((s) => s.status === "present").length;
  const lateCount = Object.values(rosterStatus).filter((s) => s.status === "late").length;
  const absentCount = Object.values(rosterStatus).filter((s) => s.status === "absent").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-teal-100 mb-2 border border-white/20">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Classroom Register & Attendance Upload</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Record Class Attendance
          </h1>
          <p className="text-teal-100 text-sm mt-1 leading-relaxed">
            Take roll call, log lates and absences, and publish verified attendance directly to the student portal.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="relative z-10 px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <Save className="w-4 h-4 text-emerald-700" />
          <span>Save & Upload Attendance</span>
        </button>
      </div>

      {/* Control Bar: Class, Subject & Date Picker */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Subject / Course:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => handleDateOrSubjectChange(selectedDate, e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Science">Grade 10 Science</option>
              <option value="Mathematics">Grade 10 Mathematics</option>
              <option value="English">Grade 10 English</option>
              <option value="Social Studies">Grade 10 Social Studies</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateOrSubjectChange(e.target.value, selectedSubject)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Summary & Action */}
        <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
              {presentCount} Present
            </span>
            <span className="px-2 py-1 bg-amber-50 text-amber-700 font-semibold rounded-md border border-amber-200">
              {lateCount} Late
            </span>
            <span className="px-2 py-1 bg-rose-50 text-rose-700 font-semibold rounded-md border border-rose-200">
              {absentCount} Absent
            </span>
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attendance saved for {selectedSubject} on {selectedDate}! Student records updated.</span>
          </div>
          <span className="text-[10px] text-emerald-700">Live synchronized</span>
        </div>
      )}

      {/* Roster Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Student Roll Call (Grade 10-A)</h3>
          <p className="text-xs text-slate-500">Toggle status button for each student and add optional notes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status Selector</th>
                <th className="py-3 px-4">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DEMO_STUDENTS.map((student) => {
                const currentStatus = rosterStatus[student.id]?.status || "present";
                const remarks = rosterStatus[student.id]?.remarks || "";

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">{student.name}</span>
                          <span className="text-[10px] text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Quick Status Button Group */}
                    <td className="py-3 px-4">
                      <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(student.id, "present")}
                          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                            currentStatus === "present"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(student.id, "late")}
                          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                            currentStatus === "late"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(student.id, "absent")}
                          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                            currentStatus === "absent"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          Absent
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. medical, excused, late arrival reason)"
                        value={remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full max-w-sm px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
