export type UserRole = 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type QuestionType = 'checkbox' | 'radio' | 'text';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: string[]; // For checkbox also radio
}

export interface QuestionSet {
  id: string;
  name: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  totalCandidates: number;
  totalSlots: number;
  startTime: string; // ISO String for date and time
  endTime: string; //  String for date and time
  duration: number; // minutes
  negativeMarking: boolean;
  questionSets: QuestionSet[];
  createdAt: string;
}

export interface BehavioralLog {
  id: string;
  examId: string;
  candidateId: string;
  eventType: 'tab_switch' | 'fullscreen_exit';
  timestamp: string;
}

export interface Answer {
  questionId: string;
  value: string | string[]; // Can be single choice, multiple choice or text
}

export interface ExamAttempt {
  id: string;
  examId: string;
  candidateId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  startTime: string;
  endTime?: string;
  answers: Answer[];
  behavioralLogs: BehavioralLog[];
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SubmissionStatus = 'Accepted' | 'Pending' | 'Needs Improvement';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: DifficultyLevel;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  url: string;
  note: string;
  status: SubmissionStatus;
  feedback: string;
}
