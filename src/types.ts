export type Role = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  grade?: string;
  department?: string;
  avatar: string;
}

export interface Announcement {
  id: string;
  title: string;
  originalText: string;
  simplifiedText: string;
  category: string;
  targetAudience: string;
  createdBy: string;
  createdAt: string;
  location?: string;
  deadline?: string;
  requiredMaterials?: string;
  requiredAction?: string;
  urgency?: "Urgent" | "Soon" | "Upcoming";
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  location?: string;
  requiredMaterials?: string;
  urgency: "Urgent" | "Soon" | "Upcoming";
  status: "pending" | "completed";
  sourceAnnouncementId?: string;
  teamInfo?: string;
  createdAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: string;
  description: string;
  relatedTaskId?: string;
}

export interface ExtractionResult {
  title: string;
  summary: string;
  deadline: string;
  dueDate: string;
  dueTime: string;
  eventDate: string;
  location: string;
  requiredAction: string;
  requiredMaterials: string;
  targetAudience: string;
  urgency: "Urgent" | "Soon" | "Upcoming";
  subject: string;
  simplifiedExplanation: string;
  teamInfo?: string;
}

// ================= Academic Portal Types ================= //

export interface Project {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  allowOnlineUpload: boolean;
  maxMarks: number;
  instructions: string;
  assignedGrade?: string;
  createdAt: string;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  fileContentOrUrl?: string;
  notes?: string;
  status: "submitted" | "graded";
  grade?: number;
  feedback?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  subject: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  durationMinutes: number; // 0 for practice/untimed, 20, 30, etc.
  type: "timed" | "practice";
  createdBy: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  answers: number[]; // chosen option index per question
}

export interface ClassNote {
  id: string;
  title: string;
  subject: string;
  chapterOrTopic: string;
  type: "lecture_note" | "revision" | "assessment" | "formula_sheet";
  content: string;
  fileName?: string;
  fileSize?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}
