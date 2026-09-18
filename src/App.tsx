import React, { useState, useEffect, useMemo } from "react";
import {
  Role,
  User,
  Task,
  CalendarEvent,
  Announcement,
  ExtractionResult,
  Project,
  ProjectSubmission,
  AttendanceRecord,
  Quiz,
  QuizSubmission,
  ClassNote,
} from "./types";
import {
  MOCK_USERS,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PROJECTS,
  INITIAL_SUBMISSIONS,
  INITIAL_ATTENDANCE,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_SUBMISSIONS,
  INITIAL_NOTES,
  SAMPLE_STUDENT,
  SAMPLE_TEACHER,
} from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { Sidebar, NavTab } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AnnouncementAnalyzer } from "./components/AnnouncementAnalyzer";
import { CalendarView } from "./components/CalendarView";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AnnouncementsView } from "./components/AnnouncementsView";
import { SettingsView } from "./components/SettingsView";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { DemoGuideModal } from "./components/DemoGuideModal";
import { AuthModal } from "./components/AuthModal";
import { StudentProjectsView } from "./components/StudentProjectsView";
import { StudentAttendanceView } from "./components/StudentAttendanceView";
import { StudentQuizView } from "./components/StudentQuizView";
import { StudentNotesView } from "./components/StudentNotesView";
import { TeacherProjectsView } from "./components/TeacherProjectsView";
import { TeacherAttendanceView } from "./components/TeacherAttendanceView";
import { TeacherQuizView } from "./components/TeacherQuizView";
import { TeacherNotesView } from "./components/TeacherNotesView";
import { LeaderboardView } from "./components/LeaderboardView";
import { detectDeadlineConflicts } from "./utils/conflictDetector";

export default function App() {
  // Authentication State - Login Mandatory for Dashboard
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("classbridge_auth_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialRole, setAuthInitialRole] = useState<Role>("student");

  // Navigation & Role State
  const [isLandingPage, setIsLandingPage] = useState<boolean>(() => !currentUser);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);

  // Sync Auth User to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("classbridge_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("classbridge_auth_user");
    }
  }, [currentUser]);

  // Data Stores with Local Storage fallback
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("classbridge_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("classbridge_events");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("classbridge_announcements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("classbridge_projects");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => {
    const saved = localStorage.getItem("classbridge_submissions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SUBMISSIONS;
      }
    }
    return INITIAL_SUBMISSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("classbridge_attendance");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ATTENDANCE;
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem("classbridge_quizzes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_QUIZZES;
      }
    }
    return INITIAL_QUIZZES;
  });

  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem("classbridge_quiz_submissions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_QUIZ_SUBMISSIONS;
      }
    }
    return INITIAL_QUIZ_SUBMISSIONS;
  });

  const [classNotes, setClassNotes] = useState<ClassNote[]>(() => {
    const saved = localStorage.getItem("classbridge_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  // Task Details Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Synchronize state with LocalStorage
  useEffect(() => {
    localStorage.setItem("classbridge_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("classbridge_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("classbridge_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("classbridge_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("classbridge_submissions", JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem("classbridge_attendance", JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem("classbridge_quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem("classbridge_quiz_submissions", JSON.stringify(quizSubmissions));
  }, [quizSubmissions]);

  useEffect(() => {
    localStorage.setItem("classbridge_notes", JSON.stringify(classNotes));
  }, [classNotes]);

  // Current Role
  const currentRole: Role = currentUser?.role || "student";

  // Conflict warning
  const conflictWarning = useMemo(() => detectDeadlineConflicts(tasks), [tasks]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setIsLandingPage(false);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLandingPage(true);
    setActiveTab("dashboard");
  };

  const handleSwitchRole = (newRole: Role) => {
    if (newRole === "student") {
      setCurrentUser(SAMPLE_STUDENT);
    } else {
      setCurrentUser(SAMPLE_TEACHER);
    }
    setIsLandingPage(false);
    setActiveTab("dashboard");
  };

  // Toggle task completion
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: t.status === "completed" ? "pending" : "completed",
          };
        }
        return t;
      })
    );
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Add extracted announcement to plan
  const handleAddToPlan = (extracted: ExtractionResult) => {
    const newTaskId = `task-${Date.now()}`;
    const targetDueDate = extracted.deadline.includes("September 25")
      ? "2026-09-25"
      : "2026-09-25";

    const newTask: Task = {
      id: newTaskId,
      title: extracted.title,
      subject: extracted.subject || "Science",
      dueDate: targetDueDate,
      dueTime: "4:00 PM",
      urgency: extracted.urgency || "Soon",
      status: "pending",
      description: extracted.requiredAction,
      location: extracted.location,
      requiredMaterials: extracted.requiredMaterials,
      teamInfo: extracted.teamInfo,
    };

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: extracted.title,
      date: targetDueDate,
      time: "4:00 PM",
      category: extracted.subject || "Science",
      location: extracted.location || "Lab 2",
      description: extracted.requiredAction,
    };

    setTasks((prev) => {
      const exists = prev.some((t) => t.title === newTask.title);
      if (exists) return prev;
      return [newTask, ...prev];
    });

    setEvents((prev) => {
      const exists = prev.some((e) => e.title === newEvent.title);
      if (exists) return prev;
      return [...prev, newEvent];
    });
  };

  // Teacher Handlers
  const handlePublishAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Academic Modules Handlers
  const handleSubmitProject = (newSub: ProjectSubmission) => {
    setSubmissions((prev) => {
      const idx = prev.findIndex(
        (s) => s.projectId === newSub.projectId && s.studentId === newSub.studentId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSub;
        return copy;
      }
      return [newSub, ...prev];
    });
  };

  const handleCreateProject = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
  };

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            status: "graded",
            grade,
            feedback,
          };
        }
        return s;
      })
    );
  };

  const handleSaveAttendanceBatch = (batch: AttendanceRecord[]) => {
    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (p) =>
          !batch.some(
            (b) => b.studentId === p.studentId && b.date === p.date && b.subject === p.subject
          )
      );
      return [...batch, ...filtered];
    });
  };

  const handleSubmitQuiz = (newSub: QuizSubmission) => {
    setQuizSubmissions((prev) => [newSub, ...prev]);
  };

  const handleCreateQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleUploadNote = (newNote: ClassNote) => {
    setClassNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setClassNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Reset demo session
  const handleResetDemoData = () => {
    setTasks(INITIAL_TASKS);
    setEvents(INITIAL_EVENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setProjects(INITIAL_PROJECTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setQuizzes(INITIAL_QUIZZES);
    setQuizSubmissions(INITIAL_QUIZ_SUBMISSIONS);
    setClassNotes(INITIAL_NOTES);
    localStorage.clear();
  };

  // Hackathon Judge Demo Jump Steps
  const handleJumpToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        // Step 1: Real Problem & 82% Impact Stat on Landing Page
        setIsLandingPage(true);
        break;
      case 2:
        // Step 2: Student Portal & Dynamic Conflict Alert
        setCurrentUser(SAMPLE_STUDENT);
        setIsLandingPage(false);
        setActiveTab("dashboard");
        break;
      case 3:
        // Step 3: Online Quiz Runner & Confetti
        setCurrentUser(SAMPLE_STUDENT);
        setIsLandingPage(false);
        setActiveTab("quizzes");
        break;
      case 4:
        // Step 4: Multimodal WhatsApp Notice Scanner
        setCurrentUser(SAMPLE_STUDENT);
        setIsLandingPage(false);
        setActiveTab("analyze");
        break;
      case 5:
        // Step 5: Academic Leaderboard & Honor Roll
        setCurrentUser(SAMPLE_STUDENT);
        setIsLandingPage(false);
        setActiveTab("leaderboard");
        break;
      case 6:
        // Step 6: Teacher Command Suite (Mr. Sharma)
        setCurrentUser(SAMPLE_TEACHER);
        setIsLandingPage(false);
        setActiveTab("dashboard");
        break;
      default:
        setActiveTab("dashboard");
    }
  };

  // Pending counts
  const pendingProjectsCount = projects.filter((p) => {
    if (currentRole === "student") {
      const sub = submissions.find(
        (s) => s.projectId === p.id && s.studentId === currentUser?.id
      );
      return !sub;
    }
    // Teacher: count pending submissions to grade
    const unGraded = submissions.filter((s) => s.projectId === p.id && s.status !== "graded").length;
    return unGraded > 0;
  }).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar - Displayed inside authenticated portals only */}
      {!isLandingPage && currentUser && (
        <Navbar
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
          onOpenLogin={() => {
            setAuthInitialRole("student");
            setIsAuthModalOpen(true);
          }}
          onExitDemo={() => setIsLandingPage(true)}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
          conflictActive={conflictWarning.hasConflict}
          activeView={activeTab}
        />
      )}

      {/* Main Body */}
      {isLandingPage || !currentUser ? (
        <main className="flex-1">
          <LandingPage
            onEnterStudentDemo={() => {
              handleLoginSuccess(SAMPLE_STUDENT);
            }}
            onEnterTeacherDemo={() => {
              handleLoginSuccess(SAMPLE_TEACHER);
            }}
            onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
            onOpenLogin={() => {
              setAuthInitialRole("student");
              setIsAuthModalOpen(true);
            }}
          />
        </main>
      ) : (
        <div className="flex-1 flex w-full">
          {/* Desktop Left Sidebar & Mobile Bottom Navigation */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab: NavTab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            pendingTasksCount={tasks.filter((t) => t.status === "pending").length}
            pendingProjectsCount={pendingProjectsCount}
            announcementsCount={announcements.length}
            role={currentRole}
            onQuickCreateAnnouncement={() => {
              setActiveTab("announcements");
            }}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-12">
            {/* ================= Student Portal Views ================= */}
            {currentRole === "student" && (
              <>
                {activeTab === "dashboard" && (
                  <StudentDashboard
                    user={currentUser}
                    tasks={tasks}
                    events={events}
                    announcements={announcements}
                    pendingProjectsCount={pendingProjectsCount}
                    onToggleTaskComplete={handleToggleTaskComplete}
                    onOpenTaskDetails={(task) => setSelectedTask(task)}
                    onNavigateToAnalyze={() => setActiveTab("analyze")}
                    onNavigateToCalendar={() => setActiveTab("calendar")}
                    onNavigateToAnnouncements={() => setActiveTab("announcements")}
                    onNavigateToProjects={() => setActiveTab("projects")}
                    onNavigateToAttendance={() => setActiveTab("attendance")}
                    onNavigateToQuizzes={() => setActiveTab("quizzes")}
                    onNavigateToNotes={() => setActiveTab("notes")}
                  />
                )}

                {activeTab === "projects" && (
                  <StudentProjectsView
                    currentUser={currentUser}
                    projects={projects}
                    submissions={submissions}
                    onSubmitProject={handleSubmitProject}
                  />
                )}

                {activeTab === "attendance" && (
                  <StudentAttendanceView
                    currentUser={currentUser}
                    attendanceRecords={attendanceRecords}
                  />
                )}

                {activeTab === "quizzes" && (
                  <StudentQuizView
                    currentUser={currentUser}
                    quizzes={quizzes}
                    quizSubmissions={quizSubmissions}
                    onSubmitQuiz={handleSubmitQuiz}
                  />
                )}

                {activeTab === "notes" && (
                  <StudentNotesView
                    currentUser={currentUser}
                    notes={classNotes}
                  />
                )}
              </>
            )}

            {/* ================= Teacher Portal Views ================= */}
            {currentRole === "teacher" && (
              <>
                {activeTab === "dashboard" && (
                  <TeacherDashboard
                    user={currentUser}
                    announcements={announcements}
                    onPublishAnnouncement={handlePublishAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    onSwitchToStudentView={() => handleSwitchRole("student")}
                    onNavigateToProjects={() => setActiveTab("projects")}
                    onNavigateToAttendance={() => setActiveTab("attendance")}
                    onNavigateToQuizzes={() => setActiveTab("quizzes")}
                    onNavigateToNotes={() => setActiveTab("notes")}
                  />
                )}

                {activeTab === "projects" && (
                  <TeacherProjectsView
                    currentUser={currentUser}
                    projects={projects}
                    submissions={submissions}
                    onCreateProject={handleCreateProject}
                    onGradeSubmission={handleGradeSubmission}
                  />
                )}

                {activeTab === "attendance" && (
                  <TeacherAttendanceView
                    currentUser={currentUser}
                    attendanceRecords={attendanceRecords}
                    onSaveAttendanceBatch={handleSaveAttendanceBatch}
                  />
                )}

                {activeTab === "quizzes" && (
                  <TeacherQuizView
                    currentUser={currentUser}
                    quizzes={quizzes}
                    quizSubmissions={quizSubmissions}
                    onCreateQuiz={handleCreateQuiz}
                    onDeleteQuiz={handleDeleteQuiz}
                  />
                )}

                {activeTab === "notes" && (
                  <TeacherNotesView
                    currentUser={currentUser}
                    notes={classNotes}
                    onUploadNote={handleUploadNote}
                    onDeleteNote={handleDeleteNote}
                  />
                )}
              </>
            )}

            {/* ================= Shared Common Views ================= */}
            {activeTab === "leaderboard" && (
              <LeaderboardView
                currentUser={currentUser}
                submissions={submissions}
                attendanceRecords={attendanceRecords}
                quizSubmissions={quizSubmissions}
              />
            )}

            {activeTab === "analyze" && (
              <AnnouncementAnalyzer
                onAddToPlan={handleAddToPlan}
                onViewCalendar={() => setActiveTab("calendar")}
                onViewDashboard={() => setActiveTab("dashboard")}
              />
            )}

            {activeTab === "calendar" && (
              <CalendarView
                tasks={tasks}
                events={events}
                onOpenTaskDetails={(task) => setSelectedTask(task)}
                onToggleTaskComplete={handleToggleTaskComplete}
              />
            )}

            {activeTab === "announcements" && (
              <AnnouncementsView
                announcements={announcements}
                onAnalyzeAnnouncementText={() => {
                  setActiveTab("analyze");
                }}
              />
            )}

            {activeTab === "settings" && (
              <SettingsView
                currentUser={currentUser}
                onResetDemoData={handleResetDemoData}
                onSwitchRole={handleSwitchRole}
              />
            )}
          </main>
        </div>
      )}

      {/* Task Details Modal */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggleComplete={handleToggleTaskComplete}
        onDeleteTask={handleDeleteTask}
      />

      {/* 90-Second Demo Guide Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        currentRole={currentRole}
        activeTab={activeTab}
        isLandingActive={isLandingPage}
        onJumpToStep={(stepNum) => {
          handleJumpToStep(stepNum);
          setIsDemoGuideOpen(false);
        }}
      />

      {/* Mandatory Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authInitialRole}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        allowClose={true}
      />
    </div>
  );
}
