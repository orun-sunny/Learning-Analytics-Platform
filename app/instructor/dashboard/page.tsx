"use client";
import React, { useMemo, useState } from "react";
import {
  Bot,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  MessageSquareText,
  PlusCircle,
  Search,
  WandSparkles,
} from "lucide-react";
import { useLearningStore } from "@/store/learningStore";
import { DifficultyLevel, SubmissionStatus } from "@/types";

export default function EmployerDashboard() {
  const {
    assignments,
    submissions,
    addAssignment,
    updateSubmissionReview,
    generatePreliminaryFeedback,
    refineAssignmentDescription,
    getSubmissionStatusStats,
  } = useLearningStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [smartNote, setSmartNote] = useState("");
  const [smartFeedbackOutput, setSmartFeedbackOutput] = useState("");
  const [refinedDescriptionOutput, setRefinedDescriptionOutput] = useState("");
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "beginner" as DifficultyLevel,
  });
  const [formError, setFormError] = useState("");

  const handleAddAssignment = () => {
    if (
      !newAssignment.title.trim() ||
      !newAssignment.description.trim() ||
      !newAssignment.deadline
    ) {
      setFormError("Please complete title, description, and deadline.");
      return;
    }

    addAssignment({
      title: newAssignment.title.trim(),
      description: newAssignment.description.trim(),
      deadline: newAssignment.deadline,
      difficulty: newAssignment.difficulty,
    });
    setNewAssignment({
      title: "",
      description: "",
      deadline: "",
      difficulty: "beginner",
    });
    setFormError("");
  };

  const filteredSubmissions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return submissions;

    return submissions.filter((submission) => {
      const assignmentTitle =
        assignments.find(
          (assignment) => assignment.id === submission.assignmentId,
        )?.title ?? "";
      return (
        submission.studentName.toLowerCase().includes(query) ||
        assignmentTitle.toLowerCase().includes(query)
      );
    });
  }, [assignments, searchQuery, submissions]);

  const statusStats = getSubmissionStatusStats();
  const totalSubmissions = submissions.length || 1;

  return (
    <div className="mx-4 mb-20 flex flex-col gap-6 md:mx-20 md:mb-60">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">
          Assignment & Review Console
        </h1>
        <p className="text-sm text-slate-500">
          Create assignments, review submissions, get AI assistance, and monitor
          learning performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-[#6633FF]" />
            <h2 className="text-lg font-bold text-slate-800">
              Manage Assignment
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g., Data Structures Reflection"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add assignment instructions and expected outcomes."
                className="h-24 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newAssignment.deadline}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Difficulty
                </label>
                <select
                  value={newAssignment.difficulty}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      difficulty: e.target.value as DifficultyLevel,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
                >
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                </select>
              </div>
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              onClick={handleAddAssignment}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6633FF] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5229CC]"
            >
              <PlusCircle className="h-4 w-4" />
              Create Assignment
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#6633FF]" />
            <h2 className="text-lg font-bold text-slate-800">
              Assignment List
            </h2>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No assignments created yet.
              </p>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <p className="text-base font-semibold text-slate-800">
                    {assignment.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {assignment.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[#6633FF]/10 px-3 py-1 text-[#6633FF]">
                      {assignment.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Due {assignment.deadline}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        <div className="mb-5 flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#6633FF]" />
          <h2 className="text-lg font-bold text-slate-800">Smart Assistance</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Generate preliminary feedback from student note
            </p>
            <textarea
              value={smartNote}
              onChange={(e) => setSmartNote(e.target.value)}
              placeholder="Paste student note to generate draft feedback..."
              className="h-24 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
            />
            <button
              onClick={() =>
                setSmartFeedbackOutput(generatePreliminaryFeedback(smartNote))
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#6633FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#5229CC]"
            >
              <WandSparkles className="h-3.5 w-3.5" />
              Generate Draft Feedback
            </button>
            {smartFeedbackOutput && (
              <p className="rounded-lg bg-[#6633FF]/5 p-3 text-sm text-slate-700">
                {smartFeedbackOutput}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Refine assignment clarity
            </p>
            <button
              onClick={() =>
                setRefinedDescriptionOutput(
                  refineAssignmentDescription({
                    title: newAssignment.title || "Assignment Draft",
                    description:
                      newAssignment.description ||
                      "Provide a complete solution and short rationale.",
                    difficulty: newAssignment.difficulty,
                  }),
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-[#6633FF] px-4 py-2 text-xs font-bold text-[#6633FF] hover:bg-[#6633FF] hover:text-white"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Refine Description
            </button>
            {refinedDescriptionOutput && (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {refinedDescriptionOutput}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-800">Learning Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Submission distribution and performance trends by status and
          difficulty.
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-4 text-sm font-semibold text-slate-700">
              Submission Status Distribution
            </p>
            {(
              ["Accepted", "Pending", "Needs Improvement"] as SubmissionStatus[]
            ).map((status) => {
              const value = statusStats[status];
              const percent = Math.round((value / totalSubmissions) * 100);
              return (
                <div key={status} className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                    <span>{status}</span>
                    <span>
                      {value} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-2.5 rounded-full ${
                        status === "Accepted"
                          ? "bg-green-500"
                          : status === "Pending"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-4 text-sm font-semibold text-slate-700">
              Submissions by Difficulty
            </p>
            {(
              ["beginner", "intermediate", "advanced"] as DifficultyLevel[]
            ).map((difficulty) => {
              const count = submissions.filter((submission) => {
                const assignment = assignments.find(
                  (item) => item.id === submission.assignmentId,
                );
                return assignment?.difficulty === difficulty;
              }).length;
              const percent = Math.round((count / totalSubmissions) * 100);
              return (
                <div key={difficulty} className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                    <span className="capitalize">{difficulty}</span>
                    <span>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-2.5 rounded-full bg-[#6633FF]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-[#6633FF]" />
            <h2 className="text-lg font-bold text-slate-800">Review System</h2>
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 md:w-[360px]">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student or assignment"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No submissions matched your search.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const assignment = assignments.find(
                (item) => item.id === submission.assignmentId,
              );
              return (
                <div
                  key={submission.id}
                  className="rounded-xl border border-gray-200 p-4 md:p-5"
                >
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-800">
                        {submission.studentName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {assignment?.title ?? "Unknown Assignment"} - Submitted{" "}
                        {submission.submittedAt}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {submission.status}
                    </span>
                  </div>

                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {submission.note}
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
                    <select
                      value={submission.status}
                      onChange={(e) =>
                        updateSubmissionReview(submission.id, {
                          status: e.target.value as SubmissionStatus,
                        })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Pending">Pending</option>
                      <option value="Needs Improvement">
                        Needs Improvement
                      </option>
                    </select>

                    <textarea
                      value={submission.feedback}
                      onChange={(e) =>
                        updateSubmissionReview(submission.id, {
                          feedback: e.target.value,
                        })
                      }
                      placeholder="Add qualitative feedback..."
                      className="h-20 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
