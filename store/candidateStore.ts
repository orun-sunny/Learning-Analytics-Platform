import { create } from 'zustand';
import { BehavioralLog, ExamAttempt } from '@/types';

interface CandidateState {
  currentAttempt: ExamAttempt | null;
  startExam: (examId: string, candidateId: string) => void;
  submitExam: () => void;
  abandonExam: () => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  logBehavior: (log: Omit<BehavioralLog, 'id' | 'timestamp'>) => void;
  getAnswer: (questionId: string) => string | string[] | undefined;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  currentAttempt: null,
  startExam: (examId, candidateId) => set({
    currentAttempt: {
      id: crypto.randomUUID(),
      examId,
      candidateId,
      status: 'in_progress',
      startTime: new Date().toISOString(),
      answers: [],
      behavioralLogs: []
    }
  }),
  submitExam: () => set((state) => ({
    currentAttempt: state.currentAttempt ? {
      ...state.currentAttempt,
      status: 'completed',
      endTime: new Date().toISOString()
    } : null
  })),
  abandonExam: () => set((state) => ({
    currentAttempt: state.currentAttempt ? {
      ...state.currentAttempt,
      status: 'abandoned',
      endTime: new Date().toISOString()
    } : null
  })),
  setAnswer: (questionId, value) => set((state) => {
    if (!state.currentAttempt) return state;
    
    // Check if answer exists and update it, otherwise add new
    const existingIndex = state.currentAttempt.answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...state.currentAttempt.answers];
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, value };
    } else {
      newAnswers.push({ questionId, value });
    }
    
    return {
      currentAttempt: {
        ...state.currentAttempt,
        answers: newAnswers
      }
    };
  }),
  logBehavior: (log) => set((state) => {
    if (!state.currentAttempt) return state;
    
    const newLog: BehavioralLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    return {
      currentAttempt: {
        ...state.currentAttempt,
        behavioralLogs: [...state.currentAttempt.behavioralLogs, newLog]
      }
    };
  }),
  getAnswer: (questionId) => {
    return get().currentAttempt?.answers.find((a) => a.questionId === questionId)?.value;
  }
}));
