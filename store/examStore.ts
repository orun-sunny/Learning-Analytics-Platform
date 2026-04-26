import { create } from 'zustand';
import { Exam } from '@/types';

// Mock Exams
const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Software Engineer Assessment',
    totalCandidates: 50,
    totalSlots: 2,
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    duration: 1, // Set to 1 minute for timeout testing
    negativeMarking: true,
    createdAt: new Date().toISOString(),
    questionSets: [
      {
        id: 'qs1',
        name: 'Technical Questions',
        questions: [
          { id: 'q1', title: 'What is Next.js?', type: 'radio', options: ['A React framework', 'A database', 'A CSS Library', 'None of the above'] },
          { id: 'q2', title: 'Explain the difference between state and props.', type: 'text', options: [] }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Frontend Developer Task',
    totalCandidates: 25,
    totalSlots: 1,
    startTime: new Date(Date.now() + 172800000).toISOString(),
    endTime: new Date(Date.now() + 176400000).toISOString(),
    duration: 90,
    negativeMarking: false,
    createdAt: new Date().toISOString(),
    questionSets: [
      {
        id: 'qs2',
        name: 'Frontend Basics',
        questions: [
          { id: 'q3', title: 'What is the purpose of React hooks?', type: 'radio', options: ['To manage state and side effects', 'To write CSS in JS', 'To fetch data from SQL', 'To create animations'] },
          { id: 'q4', title: 'Describe your favorite frontend library.', type: 'text', options: [] }
        ]
      }
    ]
  }
];

interface ExamState {
  exams: Exam[];
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updatedExam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamById: (id: string) => Exam | undefined;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: MOCK_EXAMS,
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  updateExam: (id, updatedExam) => set((state) => ({
    exams: state.exams.map((e) => e.id === id ? { ...e, ...updatedExam } : e)
  })),
  deleteExam: (id) => set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),
  getExamById: (id) => get().exams.find((e) => e.id === id)
}));
