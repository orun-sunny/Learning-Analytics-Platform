import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  Assignment,
  DifficultyLevel,
  StudentSubmission,
  SubmissionStatus,
} from "@/types";

interface LearningState {
  assignments: Assignment[];
  submissions: StudentSubmission[];
  addAssignment: (payload: Omit<Assignment, "id">) => void;
  submitWork: (payload: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    url: string;
    note: string;
  }) => void;
  updateSubmissionReview: (
    submissionId: string,
    update: Partial<Pick<StudentSubmission, "status" | "feedback">>,
  ) => void;
  generatePreliminaryFeedback: (note: string) => string;
  refineAssignmentDescription: (input: {
    title: string;
    description: string;
    difficulty: DifficultyLevel;
  }) => string;
  getSubmissionStatusStats: () => Record<SubmissionStatus, number>;
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg_1",
    title: "React Component Composition",
    description:
      "Build a reusable layout system using composition patterns and props.",
    deadline: "2026-05-04",
    difficulty: "intermediate",
  },
  {
    id: "asg_2",
    title: "Algorithm Warmup Set",
    description:
      "Solve three beginner-friendly algorithm tasks and explain trade-offs.",
    deadline: "2026-05-07",
    difficulty: "beginner",
  },
];

const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub_1",
    assignmentId: "asg_1",
    studentId: "stu_sample_1",
    studentName: "Rahim Uddin",
    submittedAt: "2026-04-22 11:20",
    url: "https://github.com/rahim/react-composition-task",
    note: "Implemented split-pane layout and reusable section wrappers.",
    status: "Pending",
    feedback: "Initial submission received. Detailed review in progress.",
  },
  {
    id: "sub_2",
    assignmentId: "asg_2",
    studentId: "stu_sample_2",
    studentName: "Nusrat Jahan",
    submittedAt: "2026-04-22 09:40",
    url: "https://docs.example.com/algorithm-warmup",
    note: "Completed all tasks with complexity notes for each approach.",
    status: "Accepted",
    feedback: "Strong explanations. Please add one more edge case for task 3.",
  },
];

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,

      addAssignment: (payload) =>
        set((state) => ({
          assignments: [
            {
              id: `asg_${Date.now()}`,
              ...payload,
            },
            ...state.assignments,
          ],
        })),

      submitWork: (payload) =>
        set((state) => {
          const assignmentTitle =
            state.assignments.find((item) => item.id === payload.assignmentId)
              ?.title ?? "Assignment";
          return {
            submissions: [
              {
                id: `sub_${Date.now()}`,
                assignmentId: payload.assignmentId,
                studentId: payload.studentId,
                studentName: payload.studentName,
                submittedAt: new Date().toLocaleString(),
                url: payload.url,
                note: payload.note,
                status: "Pending",
                feedback: `Submission received for "${assignmentTitle}". Instructor feedback will appear shortly.`,
              },
              ...state.submissions,
            ],
          };
        }),

      updateSubmissionReview: (submissionId, update) =>
        set((state) => ({
          submissions: state.submissions.map((submission) =>
            submission.id === submissionId ? { ...submission, ...update } : submission,
          ),
        })),

      generatePreliminaryFeedback: (note) => {
        const text = note.toLowerCase();
        const hasTests = text.includes("test");
        const hasDocs = text.includes("doc") || text.includes("comment");
        const hasComplexity =
          text.includes("complexity") || text.includes("trade-off");

        const strengths = [];
        if (hasTests) strengths.push("includes validation or testing steps");
        if (hasDocs) strengths.push("documents implementation intent clearly");
        if (hasComplexity) strengths.push("shows awareness of trade-offs");
        if (strengths.length === 0)
          strengths.push("covers the core requirements with a focused approach");

        const improvements = [];
        if (!hasTests) improvements.push("add at least one explicit test case");
        if (!hasDocs) improvements.push("include short inline comments for key logic");
        if (!hasComplexity)
          improvements.push("briefly justify complexity and design decisions");
        if (improvements.length === 0)
          improvements.push("add one edge case discussion to strengthen the submission");

        return `Promising submission: it ${strengths[0]}. Suggested next step: ${improvements[0]}.`;
      },

      refineAssignmentDescription: ({ title, description, difficulty }) => {
        const outcomeByDifficulty: Record<DifficultyLevel, string> = {
          beginner: "focus on correctness and clear structure",
          intermediate: "balance correctness with reusable design choices",
          advanced: "justify architectural trade-offs with measurable outcomes",
        };
        return `${title}: ${description.trim()} Expected outcome: Students should ${outcomeByDifficulty[difficulty]}. Include deliverables, evaluation criteria, and one reflection point in the submission note.`;
      },

      getSubmissionStatusStats: () => {
        const stats: Record<SubmissionStatus, number> = {
          Accepted: 0,
          Pending: 0,
          "Needs Improvement": 0,
        };
        get().submissions.forEach((item) => {
          stats[item.status] += 1;
        });
        return stats;
      },
    }),
    {
      name: "learning-platform-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        assignments: state.assignments,
        submissions: state.submissions,
      }),
    },
  ),
);
