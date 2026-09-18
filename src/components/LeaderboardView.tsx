import React, { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  CalendarCheck2,
  HelpCircle,
  UploadCloud,
  TrendingUp,
  Sparkles,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { User, ProjectSubmission, AttendanceRecord, QuizSubmission } from "../types";
import { DEMO_STUDENTS } from "../data/mockData";

interface LeaderboardViewProps {
  currentUser: User;
  submissions: ProjectSubmission[];
  attendanceRecords: AttendanceRecord[];
  quizSubmissions: QuizSubmission[];
}

interface StudentRankEntry {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  overallScore: number;
  attendancePct: number;
  quizAvg: number;
  projectsCompleted: number;
  badges: string[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  submissions,
  attendanceRecords,
  quizSubmissions,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    "overall" | "attendance" | "quizzes" | "projects"
  >("overall");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Seed rich students list for competitive leaderboard
  const leaderboardStudents: StudentRankEntry[] = useMemo(() => {
    return [
      {
        id: "student-maya",
        name: "Maya Sharma",
        grade: "Grade 10-A",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        overallScore: 980,
        attendancePct: 96,
        quizAvg: 95,
        projectsCompleted: 3,
        badges: ["School Topper", "Math Whiz", "Perfect Quizzer"],
      },
      {
        id: "student-aarav",
        name: "Aarav Patel",
        grade: "Grade 10-A",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        overallScore: 945,
        attendancePct: 100,
        quizAvg: 92,
        projectsCompleted: 3,
        badges: ["100% Attendance", "Science Star"],
      },
      {
        id: "student-sophia",
        name: "Sophia Rodriguez",
        grade: "Grade 10-B",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        overallScore: 920,
        attendancePct: 94,
        quizAvg: 90,
        projectsCompleted: 2,
        badges: ["Top Researcher", "Literature Laureate"],
      },
      {
        id: "student-liam",
        name: "Liam Chen",
        grade: "Grade 10-A",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        overallScore: 890,
        attendancePct: 92,
        quizAvg: 88,
        projectsCompleted: 2,
        badges: ["Tech Pioneer"],
      },
      {
        id: "student-noah",
        name: "Noah Kim",
        grade: "Grade 10-B",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        overallScore: 865,
        attendancePct: 90,
        quizAvg: 85,
        projectsCompleted: 2,
        badges: ["Consistent Achiever"],
      },
      {
        id: "student-emma",
        name: "Emma Watson",
        grade: "Grade 10-A",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        overallScore: 840,
        attendancePct: 95,
        quizAvg: 82,
        projectsCompleted: 2,
        badges: ["Rising Talent"],
      },
    ];
  }, []);

  // Sort and filter based on active category
  const sortedStudents = useMemo(() => {
    let list = [...leaderboardStudents];

    if (selectedClass !== "All") {
      list = list.filter((s) => s.grade === selectedClass);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.grade.toLowerCase().includes(q) ||
          s.badges.some((b) => b.toLowerCase().includes(q))
      );
    }

    switch (activeCategory) {
      case "attendance":
        return list.sort((a, b) => b.attendancePct - a.attendancePct);
      case "quizzes":
        return list.sort((a, b) => b.quizAvg - a.quizAvg);
      case "projects":
        return list.sort((a, b) => b.projectsCompleted - a.projectsCompleted || b.overallScore - a.overallScore);
      case "overall":
      default:
        return list.sort((a, b) => b.overallScore - a.overallScore);
    }
  }, [leaderboardStudents, activeCategory, selectedClass, searchQuery]);

  const topThree = sortedStudents.slice(0, 3);
  const remainingStudents = sortedStudents.slice(3);

  const getMetricDisplay = (student: StudentRankEntry) => {
    switch (activeCategory) {
      case "attendance":
        return `${student.attendancePct}% Attendance`;
      case "quizzes":
        return `${student.quizAvg}% Avg Score`;
      case "projects":
        return `${student.projectsCompleted} Projects Done`;
      case "overall":
      default:
        return `${student.overallScore} Academic Pts`;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100 mb-2 border border-white/30">
            <Trophy className="w-3.5 h-3.5 text-yellow-200" />
            <span>Academic Distinction & Gamified Honors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
            School Academic Leaderboard
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Recognizing excellence across classes: School Toppers, 100% Attendance Champions, and Quiz Distinction Achievers.
          </p>
        </div>
      </div>

      {/* Category Tabs & Class Selector */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory("overall")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              activeCategory === "overall"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>School Toppers</span>
          </button>
          <button
            onClick={() => setActiveCategory("attendance")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              activeCategory === "attendance"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Highest Attendance</span>
          </button>
          <button
            onClick={() => setActiveCategory("quizzes")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              activeCategory === "quizzes"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz Champions</span>
          </button>
          <button
            onClick={() => setActiveCategory("projects")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              activeCategory === "projects"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Project Stars</span>
          </button>
        </div>

        {/* Filter by Class & Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          >
            <option value="All">All Classes (School-Wide)</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 w-32 sm:w-40"
            />
          </div>
        </div>
      </div>

      {/* Podium Showcase (Top 3) */}
      {topThree.length >= 3 && (
        <div className="bg-gradient-to-b from-amber-50/70 via-slate-50 to-white rounded-2xl border border-amber-200/80 p-6 shadow-xs">
          <div className="text-center mb-6">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Podium of Academic Honors</span>
            </h2>
            <p className="text-xs text-slate-500">Top performers in {selectedClass === "All" ? "Oakridge High" : selectedClass}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto items-end pt-2">
            {/* 2nd Place (Silver) */}
            <div className="flex flex-col items-center text-center order-1">
              <div className="relative mb-2">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-slate-300 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center shadow">
                  2
                </span>
              </div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[90px] sm:max-w-none">
                {topThree[1].name}
              </span>
              <span className="text-[10px] text-slate-500">{topThree[1].grade}</span>
              <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-800">
                {getMetricDisplay(topThree[1])}
              </span>
              <div className="w-full bg-slate-200 h-20 sm:h-24 rounded-t-xl mt-3 flex items-center justify-center shadow-inner">
                <Medal className="w-6 h-6 text-slate-400" />
              </div>
            </div>

            {/* 1st Place (Gold / School Topper) */}
            <div className="flex flex-col items-center text-center order-2">
              <div className="relative mb-2 animate-bounce duration-1000">
                <Crown className="w-6 h-6 text-amber-500 absolute -top-5 left-1/2 -translate-x-1/2" />
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-amber-400 shadow-lg ring-4 ring-amber-200"
                />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow">
                  1
                </span>
              </div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate max-w-[100px] sm:max-w-none">
                {topThree[0].name}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">{topThree[0].grade}</span>
              <span className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                {getMetricDisplay(topThree[0])}
              </span>
              <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 h-28 sm:h-32 rounded-t-xl mt-3 flex items-center justify-center shadow-md">
                <Trophy className="w-8 h-8 text-amber-900" />
              </div>
            </div>

            {/* 3rd Place (Bronze) */}
            <div className="flex flex-col items-center text-center order-3">
              <div className="relative mb-2">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-amber-600 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow">
                  3
                </span>
              </div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[90px] sm:max-w-none">
                {topThree[2].name}
              </span>
              <span className="text-[10px] text-slate-500">{topThree[2].grade}</span>
              <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                {getMetricDisplay(topThree[2])}
              </span>
              <div className="w-full bg-amber-200/80 h-16 sm:h-18 rounded-t-xl mt-3 flex items-center justify-center shadow-inner">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Full Class Honor Roll</h3>
            <p className="text-xs text-slate-500">Live rankings updated from quiz attempts, project submissions, and daily attendance</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {sortedStudents.length} Students Ranked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Performance Metric</th>
                <th className="py-3 px-4">Honors & Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedStudents.map((student, idx) => {
                const rank = idx + 1;
                const isCurrentUser = student.id === currentUser.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? "bg-blue-50/60 font-semibold"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-2xs">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs shadow-2xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">{rank}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {student.name} {isCurrentUser && "(You)"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600">
                      {student.grade}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900">
                        {getMetricDisplay(student)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.badges.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            {b}
                          </span>
                        ))}
                      </div>
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
