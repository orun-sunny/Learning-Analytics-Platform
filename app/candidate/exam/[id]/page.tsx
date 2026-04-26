"use client";
import React, { useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useLearningStore } from "@/store/learningStore";
import {
  ChevronDown,
  Phone,
  Mail,
  Link2,
  MessageSquareText,
  SendHorizonal,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default function ExamScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const assignmentIdFromRoute = unwrappedParams.id;

  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { assignments, submissions, submitWork } = useLearningStore();

  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    assignments.find((a) => a.id === assignmentIdFromRoute)?.id ||
      assignments[0]?.id ||
      assignmentIdFromRoute,
  );

  const availableAssignments = useMemo(() => assignments, [assignments]);

  const mySubmissions = useMemo(() => {
    if (!user) return [];
    return submissions.filter((submission) => submission.studentId === user.id);
  }, [submissions, user]);

  const statusCounts = mySubmissions.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { Pending: 0, Accepted: 0, "Needs Improvement": 0 },
  );

  const handleSubmitWork = () => {
    if (!user) return;
    if (
      !selectedAssignmentId ||
      !submissionUrl.trim() ||
      !submissionNote.trim()
    ) {
      setFormError("Please provide assignment, URL, and descriptive note.");
      return;
    }

    const isValidUrl = /^https?:\/\/\S+$/i.test(submissionUrl.trim());
    if (!isValidUrl) {
      setFormError("Enter a valid URL starting with http:// or https://");
      return;
    }

    submitWork({
      assignmentId: selectedAssignmentId,
      studentId: user.id,
      studentName: user.name || "Student",
      url: submissionUrl.trim(),
      note: submissionNote.trim(),
    });
    setSubmissionUrl("");
    setSubmissionNote("");
    setFormError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <div className="flex justify-between items-center self-stretch bg-white py-5 px-4 md:px-20 shadow-[0px_2.7135651111602783px_4px_#C0C0C005] z-10">
        <div
          className="w-[90px] h-6 relative cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() =>
            router.push(isAuthenticated ? "/candidate/dashboard" : "/")
          }
        >
          <Image
            src="/assets/phlogo.svg"
            alt="programming hero logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-slate-700 text-2xl font-bold hidden md:block">
          Programming Hero
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <div className="w-10 h-10 relative">
            <Image
              src="/assets/profileicon.png"
              alt="Profile"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col shrink-0 items-start">
              <span className="text-slate-700 text-sm font-bold">
                {user?.name || "Student"}
              </span>
              <span className="text-slate-500 text-xs">
                Ref.ID: {user?.id?.substring(0, 8) || "12341341"}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-14 px-4 md:px-0 gap-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-slate-800">
                Submission Portal
              </h2>
              <span className="rounded-full bg-[#6633FF]/10 px-3 py-1 text-xs font-medium text-[#6633FF]">
                Real-time feedback enabled
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Submit your work using a URL and a descriptive note. Instructor
              feedback updates in your submission history.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Assignment
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6633FF]"
                >
                  {availableAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title} (Due: {assignment.deadline})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Submission URL
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-[#6633FF]">
                  <Link2 className="h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/your-project or portfolio link"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Descriptive Note
                </label>
                <div className="rounded-lg border border-gray-300 px-3 py-2 focus-within:border-[#6633FF]">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <MessageSquareText className="h-4 w-4" />
                    <span className="text-xs">
                      Explain what you built and why
                    </span>
                  </div>
                  <textarea
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    placeholder="Describe your implementation, challenges, and improvements in this submission."
                    className="h-28 w-full resize-none bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <button
                onClick={handleSubmitWork}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6633FF] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5522EE]"
              >
                <SendHorizonal className="h-4 w-4" />
                Submit Work
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-slate-800">
              Progress Tracking
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Track statuses of your previous submissions.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Pending</p>
                <p className="text-xl font-bold text-slate-700">
                  {statusCounts.Pending}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Accepted</p>
                <p className="text-xl font-bold text-green-600">
                  {statusCounts.Accepted}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Needs Improvement</p>
                <p className="text-xl font-bold text-amber-600">
                  {statusCounts["Needs Improvement"]}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-800">
              Submission History & Feedback
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              <Clock3 className="h-3.5 w-3.5" />
              Real-time updates
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {mySubmissions.length === 0 ? (
              <p className="text-sm text-slate-500">
                No submissions yet. Submit your first assignment.
              </p>
            ) : (
              mySubmissions.map((submission) => {
                const assignment = availableAssignments.find(
                  (item) => item.id === submission.assignmentId,
                );
                return (
                  <div
                    key={submission.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {assignment?.title || "Assignment"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Submitted: {submission.submittedAt}
                        </p>
                      </div>
                      <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        submission.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        submission.status === 'Needs Improvement' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {submission.status}
                      </span>
                    </div>

                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block text-sm text-[#6633FF] underline underline-offset-2 break-all"
                    >
                      {submission.url}
                    </a>

                    <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {submission.note}
                    </p>

                    <div className="mt-3 rounded-lg border border-[#6633FF]/20 bg-[#6633FF]/5 p-3">
                      <p className="text-xs font-medium text-[#6633FF]">
                        Instructor Feedback
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {submission.feedback}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-800">
            Available Assignments
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`rounded-xl border p-4 transition-colors ${
                  assignment.id === selectedAssignmentId
                    ? "border-[#6633FF] bg-[#6633FF]/5"
                    : "border-gray-200"
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">
                  {assignment.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Due date: {assignment.deadline}
                </p>
                <button
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                  className="mt-3 rounded-lg border border-[#6633FF] px-3 py-1.5 text-xs font-medium text-[#6633FF] hover:bg-[#6633FF] hover:text-white transition-colors"
                >
                  Submit to this assignment
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/candidate/dashboard")}
            className="mt-6 bg-transparent hover:bg-gray-50 text-slate-700 text-sm font-bold py-2.5 px-6 rounded-xl border border-solid border-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </section>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center self-stretch bg-[#130B2C] py-6 px-4 md:px-20 shadow-[0px_2.7135651111602783px_4px_#C0C0C005] mt-auto">
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-white text-xl">Powered by</span>
          <div className="w-[116px] h-8 relative">
            <Image
              src="/assets/phlogo.svg"
              alt="Powered by logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row shrink-0 items-center gap-4 md:gap-[19px]">
          <span className="text-white text-base hidden md:block">Helpline</span>
          <div className="flex flex-col md:flex-row shrink-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white text-base">+88 01856698546</span>
            </div>
            <div className="flex shrink-0 items-center">
              <Mail className="w-5 h-5 text-white mr-2" />
              <span className="text-white text-base mr-0 md:mr-[35px]">
                support@phero.work
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
