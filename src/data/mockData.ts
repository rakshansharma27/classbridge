import {
  Announcement,
  CalendarEvent,
  ExtractionResult,
  Task,
  User,
  Project,
  ProjectSubmission,
  AttendanceRecord,
  Quiz,
  QuizSubmission,
  ClassNote,
} from "../types";

export const SAMPLE_STUDENT: User = {
  id: "student-maya",
  name: "Maya Sharma",
  email: "maya@classbridge.edu",
  role: "student",
  grade: "Grade 10-A",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const SAMPLE_TEACHER: User = {
  id: "teacher-sharma",
  name: "Mr. Sharma",
  email: "sharma@classbridge.edu",
  role: "teacher",
  department: "Science Department",
  grade: "Grade 10 Lead",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
};

export const MOCK_USERS = {
  student: SAMPLE_STUDENT,
  teacher: SAMPLE_TEACHER,
};

export const DEMO_STUDENTS: User[] = [
  SAMPLE_STUDENT,
  {
    id: "student-aarav",
    name: "Aarav Patel",
    email: "aarav@classbridge.edu",
    role: "student",
    grade: "Grade 10-A",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "student-liam",
    name: "Liam Chen",
    email: "liam@classbridge.edu",
    role: "student",
    grade: "Grade 10-A",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "student-sophia",
    name: "Sophia Rodriguez",
    email: "sophia@classbridge.edu",
    role: "student",
    grade: "Grade 10-A",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "student-noah",
    name: "Noah Kim",
    email: "noah@classbridge.edu",
    role: "student",
    grade: "Grade 10-A",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
];

export const DEMO_ANNOUNCEMENT_TEXT =
  "Reminder for Grade 10 students: The science exhibition project proposal must be submitted by Friday, September 25 at 4:00 PM. Submit the proposal through the Science Department portal. Bring a printed copy to Lab 2 on Monday. Teams may have up to four members.";

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Science Exhibition Project Proposal Submission",
    originalText:
      "Reminder for Grade 10 students: The science exhibition project proposal must be submitted by Friday, September 25 at 4:00 PM. Submit the proposal through the Science Department portal. Bring a printed copy to Lab 2 on Monday. Teams may have up to four members.",
    simplifiedText:
      "Grade 10 students need to submit their science exhibition proposal online by Friday at 4:00 PM. Bring a printed copy to Lab 2 on Monday. Teams can have up to four members.",
    category: "Science",
    targetAudience: "Grade 10",
    createdBy: "Mr. Sharma (Science Dept)",
    createdAt: "2026-09-17 08:30",
    location: "Science Department portal & Lab 2",
    deadline: "Friday, September 25 at 4:00 PM",
    requiredMaterials: "Printed project proposal",
    requiredAction: "Submit proposal online and bring printed copy to Lab 2.",
    urgency: "Soon",
  },
  {
    id: "ann-2",
    title: "Mathematics Chapter 5 Problem Set",
    originalText:
      "Notice for all Grade 10 Math students: Quadratic Equations homework set #4 must be submitted to the assignment bin outside Room 108 by tomorrow (Friday, Sept 18) morning before 8:30 AM sharp. No late submissions accepted.",
    simplifiedText:
      "Grade 10 Math students must turn in Quadratic Equations homework #4 in the bin outside Room 108 by tomorrow (Sept 18) 8:30 AM.",
    category: "Mathematics",
    targetAudience: "Grade 10",
    createdBy: "Mrs. Kapoor (Math Dept)",
    createdAt: "2026-09-16 14:00",
    location: "Assignment Bin outside Room 108",
    deadline: "Tomorrow, Sept 18 at 8:30 AM",
    requiredMaterials: "Quadratic Equations Problem Set Sheet",
    requiredAction: "Hand in completed problem set to the Room 108 bin.",
    urgency: "Urgent",
  },
  {
    id: "ann-3",
    title: "Student Council Executive Meeting",
    originalText:
      "Attention student council class representatives: Our bi-weekly agenda meeting will convene next Wednesday, September 23 at 3:30 PM in Conference Room B. Please review the spirit week survey results prior to arrival.",
    simplifiedText:
      "Student council meeting next Wednesday, Sept 23 at 3:30 PM in Conference Room B. Review spirit week results beforehand.",
    category: "Student Council",
    targetAudience: "Specific class / Council",
    createdBy: "Vice Principal Office",
    createdAt: "2026-09-15 11:15",
    location: "Conference Room B",
    deadline: "Wednesday, Sept 23 at 3:30 PM",
    requiredMaterials: "Spirit week survey notes",
    requiredAction: "Attend planning meeting and discuss spirit week.",
    urgency: "Soon",
  },
  {
    id: "ann-4",
    title: "Annual Science Discovery Field Trip Permission Slips",
    originalText:
      "All students attending the National Science Observatory tour scheduled for next month must submit parent-signed liability forms and medical waivers to the main administration counter by Thursday, October 1. Uniform badge required on tour day.",
    simplifiedText:
      "Turn in signed field trip permission forms and medical waivers to the main office by Thursday, Oct 1.",
    category: "Field Trip / Admin",
    targetAudience: "Entire school",
    createdBy: "School Administration",
    createdAt: "2026-09-14 09:00",
    location: "Main Administration Counter",
    deadline: "Thursday, October 1 at 3:00 PM",
    requiredMaterials: "Signed permission form & medical waiver",
    requiredAction: "Obtain parent signature and submit waiver to main desk.",
    urgency: "Upcoming",
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Mathematics Problem Set #4 (Quadratics)",
    description: "Complete exercises 12-35 on quadratic formulas and graphing parabolas.",
    subject: "Mathematics",
    dueDate: "2026-09-18",
    dueTime: "08:30",
    location: "Assignment Bin outside Room 108",
    requiredMaterials: "Quadratic Problem Set Sheet",
    urgency: "Urgent",
    status: "pending",
    sourceAnnouncementId: "ann-2",
  },
  {
    id: "task-2",
    title: "English Literature Comparative Essay Draft",
    description: "Draft 750 words comparing theme of justice in To Kill a Mockingbird vs Antigone.",
    subject: "English",
    dueDate: "2026-09-24",
    dueTime: "15:00",
    location: "Google Classroom / Turnitin",
    requiredMaterials: "Draft Google Doc",
    urgency: "Soon",
    status: "pending",
  },
  {
    id: "task-3",
    title: "Student Council Spirit Week Agenda Review",
    description: "Review class feedback survey results before executive meeting.",
    subject: "Student Council",
    dueDate: "2026-09-23",
    dueTime: "15:30",
    location: "Conference Room B",
    requiredMaterials: "Survey Summary Sheet",
    urgency: "Soon",
    status: "pending",
    sourceAnnouncementId: "ann-3",
  },
  {
    id: "task-4",
    title: "Science Discovery Field Trip Permission Slip",
    description: "Have parents sign liability and emergency medical release form.",
    subject: "Administrative",
    dueDate: "2026-10-01",
    dueTime: "15:00",
    location: "Main Administration Counter",
    requiredMaterials: "Signed permission form",
    urgency: "Upcoming",
    status: "pending",
    sourceAnnouncementId: "ann-4",
  },
  {
    id: "task-5",
    title: "History Unit 2 Vocabulary Flashcards",
    description: "Prepare 25 flashcards for Industrial Revolution terms.",
    subject: "History",
    dueDate: "2026-09-16",
    dueTime: "14:00",
    location: "Room 202",
    requiredMaterials: "Index cards",
    urgency: "Urgent",
    status: "completed",
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "event-1",
    title: "Math Homework Hand-in Deadline",
    date: "2026-09-18",
    time: "08:30 AM",
    location: "Room 108 Bin",
    category: "Mathematics",
    description: "Submit Quadratic Equations problem set #4.",
    relatedTaskId: "task-1",
  },
  {
    id: "event-2",
    title: "Student Council Executive Meeting",
    date: "2026-09-23",
    time: "03:30 PM",
    location: "Conference Room B",
    category: "Student Council",
    description: "Bi-weekly council meeting to finalize Spirit Week theme.",
    relatedTaskId: "task-3",
  },
  {
    id: "event-3",
    title: "English Comparative Essay Due",
    date: "2026-09-24",
    time: "03:00 PM",
    location: "Online Portal",
    category: "English",
    description: "Submit 750-word literary essay draft.",
    relatedTaskId: "task-2",
  },
  {
    id: "event-4",
    title: "Annual Science Discovery Field Trip Deadline",
    date: "2026-10-01",
    time: "03:00 PM",
    location: "Main Admin Office",
    category: "Administrative",
    description: "Last day to turn in parent-signed permission slips.",
    relatedTaskId: "task-4",
  },
];

export const EXTRACTED_DEMO_RESULT: ExtractionResult = {
  title: "Science Exhibition Project Proposal",
  summary:
    "Grade 10 project proposal submission through the Science Department portal by Friday 4:00 PM, followed by physical submission to Lab 2 on Monday.",
  deadline: "Friday, September 25 at 4:00 PM",
  dueDate: "2026-09-25",
  dueTime: "16:00",
  eventDate: "Monday, September 28",
  location: "Science Department portal and Lab 2",
  requiredAction: "Submit the project proposal online and bring a printed copy.",
  requiredMaterials: "Printed project proposal",
  targetAudience: "Grade 10 students",
  urgency: "Soon",
  subject: "Science",
  simplifiedExplanation:
    "Grade 10 students need to submit their science exhibition proposal online by Friday at 4:00 PM. Bring a printed copy to Lab 2 on Monday. Teams can have up to four members.",
  teamInfo: "Teams may have up to 4 members",
};

export const DEMO_TRANSLATIONS: Record<string, string> = {
  English:
    "Reminder for Grade 10 students: The science exhibition project proposal must be submitted by Friday, September 25 at 4:00 PM. Submit the proposal through the Science Department portal. Bring a printed copy to Lab 2 on Monday. Teams may have up to four members.",
  Hindi:
    "कक्षा 10 के छात्रों के लिए स्मरण: विज्ञान प्रदर्शनी परियोजना प्रस्ताव शुक्रवार, 25 सितंबर को शाम 4:00 बजे तक जमा किया जाना चाहिए। विज्ञान विभाग पोर्टल के माध्यम से प्रस्ताव जमा करें। सोमवार को लैब 2 में एक मुद्रित प्रति लाएं। टीमों में चार सदस्य तक हो सकते हैं।",
  Tamil:
    "10 ஆம் வகுப்பு மாணவர்களுக்கான நினைவூட்டல்: அறிவியல் கண்காட்சி திட்ட முன்மொழிவு வெள்ளிக்கிழமை, செப்டம்பர் 25 மாலை 4:00 மணிக்குள் சமர்ப்பிக்கப்பட வேண்டும். அறிவியல் துறை போர்டல் வழியாக சமர்ப்பிக்கவும். திங்கட்கிழமை லேப் 2-க்கு அச்சிடப்பட்ட நகலைக் கொண்டு வாருங்கள். அணிகளில் 4 உறுப்பினர்கள் வரை இருக்கலாம்.",
  Spanish:
    "Recordatorio para estudiantes de 10º grado: La propuesta del proyecto de la feria de ciencias debe enviarse antes del viernes 25 de septiembre a las 4:00 PM. Envíe la propuesta a través del portal del Departamento de Ciencias. Traiga una copia impresa al Laboratorio 2 el lunes. Los equipos pueden tener hasta cuatro miembros.",
};

export const TARGET_AUDIENCE_OPTIONS = [
  "Entire school",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Specific class",
  "Club or activity",
];

// ================= Academic Portal Initial Data ================= //

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Science Exhibition Project Proposal & Blueprint",
    subject: "Science",
    description: "Formulate a research hypothesis and structural design for the Annual Science Expo. Include material safety and experimentation steps.",
    dueDate: "2026-09-25",
    dueTime: "16:00",
    allowOnlineUpload: true,
    maxMarks: 50,
    instructions: "Upload your 2-page project blueprint in PDF/DOCX or provide a shared Google Drive/Docs link. Teams of up to 4 can submit a single unified proposal with all member names listed.",
    assignedGrade: "Grade 10",
    createdAt: "2026-09-17",
  },
  {
    id: "proj-2",
    title: "Quadratic Equations Real-World Parabolic Trajectory",
    subject: "Mathematics",
    description: "Analyze parabolic trajectories in sports or bridge architecture using standard quadratic formulas and vertex calculations.",
    dueDate: "2026-09-22",
    dueTime: "14:00",
    allowOnlineUpload: true,
    maxMarks: 30,
    instructions: "Submit your worked calculations sheet and graph plotting either by uploading a photo/document or submitting an online link.",
    assignedGrade: "Grade 10",
    createdAt: "2026-09-16",
  },
  {
    id: "proj-3",
    title: "Comparative Thematic Essay: Power & Morality",
    subject: "English",
    description: "Draft a 750-word literary essay comparing characters and thematic developments across studied texts.",
    dueDate: "2026-09-29",
    dueTime: "23:59",
    allowOnlineUpload: true,
    maxMarks: 40,
    instructions: "Submit your essay draft online. Ensure proper MLA citations and a clearly stated thesis statement in the introduction.",
    assignedGrade: "Grade 10",
    createdAt: "2026-09-15",
  },
];

export const INITIAL_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: "sub-1",
    projectId: "proj-2",
    studentId: "student-maya",
    studentName: "Maya Sharma",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-09-17 11:20",
    fileName: "Maya_Parabolic_Trajectory_Model.pdf",
    fileSize: "1.4 MB",
    fileContentOrUrl: "https://drive.google.com/file/d/maya-parabolic-math-doc",
    notes: "Included 3 real-world basketball shot trajectory models and verified discriminant calculations.",
    status: "graded",
    grade: 28,
    feedback: "Outstanding work Maya! The vertex calculations and graph plots were crystal clear and exceptionally well labeled.",
  },
  {
    id: "sub-2",
    projectId: "proj-1",
    studentId: "student-liam",
    studentName: "Liam Chen",
    studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-09-17 14:45",
    fileName: "Solar_Water_Purifier_Proposal.pdf",
    fileSize: "2.1 MB",
    notes: "Group project proposal for Liam Chen & Aarav Patel. Prototype diagram included on page 2.",
    status: "submitted",
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today & recent days for Maya
  { id: "att-1", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-17", subject: "Science", status: "present", remarks: "Participated in lab discussion" },
  { id: "att-2", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-17", subject: "Mathematics", status: "present", remarks: "On time" },
  { id: "att-3", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-17", subject: "English", status: "present", remarks: "Engaged in reading circle" },
  { id: "att-4", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-16", subject: "Science", status: "present" },
  { id: "att-5", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-16", subject: "Mathematics", status: "present" },
  { id: "att-6", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-16", subject: "English", status: "late", remarks: "Arrived 5 mins late due to bus delay" },
  { id: "att-7", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-15", subject: "Science", status: "present" },
  { id: "att-8", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-15", subject: "Mathematics", status: "present" },
  { id: "att-9", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-15", subject: "Social Studies", status: "present" },
  { id: "att-10", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-12", subject: "Science", status: "present" },
  { id: "att-11", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-12", subject: "Mathematics", status: "absent", remarks: "Excused medical appointment" },
  { id: "att-12", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-11", subject: "Science", status: "present" },
  { id: "att-13", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-11", subject: "Mathematics", status: "present" },
  { id: "att-14", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-10", subject: "Science", status: "present" },
  { id: "att-15", studentId: "student-maya", studentName: "Maya Sharma", date: "2026-09-10", subject: "English", status: "present" },

  // Classmates records for teacher attendance sheet
  { id: "att-c1", studentId: "student-aarav", studentName: "Aarav Patel", date: "2026-09-17", subject: "Science", status: "present" },
  { id: "att-c2", studentId: "student-liam", studentName: "Liam Chen", date: "2026-09-17", subject: "Science", status: "present" },
  { id: "att-c3", studentId: "student-sophia", studentName: "Sophia Rodriguez", date: "2026-09-17", subject: "Science", status: "late" },
  { id: "att-c4", studentId: "student-noah", studentName: "Noah Kim", date: "2026-09-17", subject: "Science", status: "present" },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Science Chapter 4: Cell Mitosis, Genetics & DNA",
    subject: "Science",
    description: "Timed assessment testing knowledge of cell division stages, double helix structure, and Mendelian inheritance.",
    durationMinutes: 20,
    type: "timed",
    createdBy: "Mr. Sharma (Science Dept)",
    createdAt: "2026-09-16",
    questions: [
      {
        id: "q1-1",
        question: "During which phase of mitosis do chromosomes align in the center of the dividing cell?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correctAnswerIndex: 1,
        explanation: "In Metaphase, chromosomes line up along the metaphase plate (equatorial plane) of the cell before separation.",
      },
      {
        id: "q2-1",
        question: "Which nucleotide base pairs specifically with Adenine in a standard DNA molecule?",
        options: ["Cytosine", "Guanine", "Thymine", "Uracil"],
        correctAnswerIndex: 2,
        explanation: "Adenine forms two hydrogen bonds exclusively with Thymine in double-stranded DNA (Uracil replaces Thymine in RNA).",
      },
      {
        id: "q3-1",
        question: "If a heterozygous pea plant (Bb) is crossed with a homozygous recessive plant (bb), what is the probability of purple flowers (B is dominant)?",
        options: ["25%", "50%", "75%", "100%"],
        correctAnswerIndex: 1,
        explanation: "A Bb x bb cross yields offspring genotypes Bb (50%) and bb (50%), meaning a 50% probability of dominant purple phenotype.",
      },
      {
        id: "q4-1",
        question: "What organelle is commonly referred to as the 'powerhouse of the cell' due to ATP production?",
        options: ["Ribosome", "Endoplasmic Reticulum", "Mitochondria", "Golgi Apparatus"],
        correctAnswerIndex: 2,
        explanation: "Mitochondria carry out cellular respiration and synthesize adenosine triphosphate (ATP) for metabolic processes.",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Mathematics: Quadratic Equations & Discriminant Rules",
    subject: "Mathematics",
    description: "30-Minute comprehensive quiz on factoring quadratics, completing the square, and using the discriminant.",
    durationMinutes: 30,
    type: "timed",
    createdBy: "Mrs. Kapoor (Math Dept)",
    createdAt: "2026-09-15",
    questions: [
      {
        id: "q2-1-1",
        question: "What does a discriminant (b² - 4ac) value greater than zero (> 0) indicate about a quadratic equation?",
        options: [
          "No real solutions (two complex roots)",
          "Exactly one real repeated root",
          "Two distinct real solutions",
          "The equation cannot be graphed",
        ],
        correctAnswerIndex: 2,
        explanation: "When the discriminant is strictly positive, the quadratic formula yields two distinct real solutions where the parabola crosses the x-axis twice.",
      },
      {
        id: "q2-1-2",
        question: "What are the roots of the equation: x² - 7x + 12 = 0?",
        options: ["x = 2 and x = 6", "x = 3 and x = 4", "x = -3 and x = -4", "x = 1 and x = 12"],
        correctAnswerIndex: 1,
        explanation: "Factoring (x - 3)(x - 4) = 0 gives roots x = 3 and x = 4.",
      },
      {
        id: "q2-1-3",
        question: "For the quadratic y = ax² + bx + c, the x-coordinate of the vertex is given by:",
        options: ["-b / 2a", "b / 2a", "-b / a", "c / a"],
        correctAnswerIndex: 0,
        explanation: "The axis of symmetry and vertex x-coordinate is given by x = -b / (2a).",
      },
      {
        id: "q2-1-4",
        question: "What is the value of the discriminant for 2x² - 4x + 2 = 0?",
        options: ["-8", "0", "16", "32"],
        correctAnswerIndex: 1,
        explanation: "b² - 4ac = (-4)² - 4(2)(2) = 16 - 16 = 0. There is one repeated real root.",
      },
    ],
  },
  {
    id: "quiz-3",
    title: "General Science Practice Check (Untimed)",
    subject: "Science",
    description: "Self-paced practice review with instant step-by-step solutions for exam preparation.",
    durationMinutes: 0,
    type: "practice",
    createdBy: "Mr. Sharma (Science Dept)",
    createdAt: "2026-09-14",
    questions: [
      {
        id: "q3-p1",
        question: "Which state of matter has a definite volume but no definite shape?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correctAnswerIndex: 1,
        explanation: "Liquids conform to the shape of their container while retaining an essentially constant volume.",
      },
      {
        id: "q3-p2",
        question: "What is the primary gas found in Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        correctAnswerIndex: 2,
        explanation: "Nitrogen comprises approximately 78% of Earth's atmosphere, followed by Oxygen at ~21%.",
      },
      {
        id: "q3-p3",
        question: "What is the chemical formula for ordinary table salt?",
        options: ["KCl", "NaCl", "NaOH", "CaCl₂"],
        correctAnswerIndex: 1,
        explanation: "Sodium chloride (NaCl) is the chemical compound known as table salt.",
      },
    ],
  },
];

export const INITIAL_QUIZ_SUBMISSIONS: QuizSubmission[] = [
  {
    id: "qsub-1",
    quizId: "quiz-3",
    quizTitle: "General Science Practice Check (Untimed)",
    studentId: "student-maya",
    studentName: "Maya Sharma",
    score: 3,
    totalQuestions: 3,
    percentage: 100,
    submittedAt: "2026-09-16 16:30",
    answers: [1, 2, 1],
  },
];

export const INITIAL_NOTES: ClassNote[] = [
  {
    id: "note-1",
    title: "Cell Mitosis & Meiosis Comprehensive Revision Notes",
    subject: "Science",
    chapterOrTopic: "Chapter 4: Cell Biology & Genetics",
    type: "lecture_note",
    content: `# Chapter 4: Cell Mitosis & Genetics Overview

## 1. Key Stages of Mitosis (PMAT)
- **Prophase**: Chromatin condenses into visible chromosomes. Nucleolus disappears; mitotic spindle starts forming.
- **Metaphase**: Chromosomes align along the metaphase plate (cell equator). Kinetochores attach to spindle microtubules.
- **Anaphase**: Sister chromatids are pulled apart to opposite poles of the cell.
- **Telophase & Cytokinesis**: Nuclear envelope re-forms around each set of chromosomes. Cleavage furrow divides cytoplasm.

## 2. DNA Structure
- Double-helix model discovered by Watson, Crick, and Franklin.
- Complementary base pairing:
  - **A (Adenine) = T (Thymine)** [2 hydrogen bonds]
  - **G (Guanine) ≡ C (Cytosine)** [3 hydrogen bonds]

## 3. Important Exam Tips
- Remember that mitosis produces 2 diploid identical daughter cells, while meiosis produces 4 haploid genetically diverse gametes.
- Always check if questions specify plant cells (which form cell plates) vs animal cells (which form cleavage furrows).`,
    fileName: "Grade10_Science_Mitosis_Notes.md",
    fileSize: "42 KB",
    uploadedBy: "Mr. Sharma (Science Dept)",
    uploadedAt: "2026-09-16 09:15",
    tags: ["Mitosis", "Genetics", "ExamPrep", "Biology"],
  },
  {
    id: "note-2",
    title: "Quadratic Equations Formula Sheet & Discriminant Quick Guide",
    subject: "Mathematics",
    chapterOrTopic: "Unit 3: Quadratic Relations",
    type: "formula_sheet",
    content: `# Unit 3: Quadratic Relations Formula Sheet

## Standard Form
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

## Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Discriminant Rules ($D = b^2 - 4ac$)
- **$D > 0$**: Two distinct real roots (parabola crosses x-axis twice)
- **$D = 0$**: One real repeated root (vertex touches x-axis)
- **$D < 0$**: No real roots (two complex roots; parabola never crosses x-axis)

## Vertex Form
$$y = a(x - h)^2 + k$$
- Vertex: $(h, k)$
- Axis of symmetry: $x = h$`,
    fileName: "Math_Quadratic_Formula_Sheet.pdf",
    fileSize: "88 KB",
    uploadedBy: "Mrs. Kapoor (Math Dept)",
    uploadedAt: "2026-09-15 14:00",
    tags: ["Algebra", "Formulas", "Discriminant", "CheatSheet"],
  },
  {
    id: "note-3",
    title: "Literature Essay Assessment Rubric & Transition Words",
    subject: "English",
    chapterOrTopic: "Literary Analysis & Writing",
    type: "assessment",
    content: `# Literary Essay Writing Guide & Evaluation Rubric

## Structure of a 5-Paragraph Literary Essay:
1. **Introduction**:
   - Compelling hook connected to the human condition.
   - Author, title, and historical context.
   - Clear, arguable thesis statement with 3 points.

2. **Body Paragraphs (x3 - Claim, Evidence, Analysis)**:
   - Topic sentence connecting to thesis sub-claim.
   - Integrated quote with correct MLA citation e.g. (Act III, sc. 2, 45-47).
   - Analysis: Explain *how* literary devices (metaphor, dramatic irony) reinforce author's intent.

3. **Conclusion**:
   - Restate thesis in fresh words.
   - Synthesize arguments without introducing new quotes.
   - Leave reader with a profound final takeaway.`,
    fileName: "English_Essay_Rubric_Grade10.pdf",
    fileSize: "55 KB",
    uploadedBy: "Ms. Davis (English Dept)",
    uploadedAt: "2026-09-14 11:30",
    tags: ["Essay", "Rubric", "Writing", "MLA"],
  },
];
