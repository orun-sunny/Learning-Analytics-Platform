"use client";
import React, { useState } from "react";
import {
  Clock,
  PlayCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useLearningStore } from "@/store/learningStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CandidateDashboard() {
  const { user } = useAuthStore();
  const { showModal } = useUIStore();
  const { submissions, assignments } = useLearningStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartExam = (assignmentId: string) => {
    if (!user) return;

    showModal({
      title: "Open Assignment",
      message:
        "Open this assignment and submit your work from the student portal?",
      type: "confirm",
      confirmText: "Open Now",
      onConfirm: () => {
        router.push(`/candidate/exam/${assignmentId}`);
      },
    });
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const mySubmissions = submissions.filter(
    (item) => item.studentId === user?.id,
  );
  const pendingCount = mySubmissions.filter(
    (item) => item.status === "Pending",
  ).length;
  const acceptedCount = mySubmissions.filter(
    (item) => item.status === "Accepted",
  ).length;
  const needsImprovementCount = mySubmissions.filter(
    (item) => item.status === "Needs Improvement",
  ).length;

  return (
    <div className="flex flex-col self-stretch mx-4 md:mx-20 gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center self-stretch gap-4">
        <div className="flex flex-col shrink-0 items-start">
          <span className="text-slate-700 text-2xl font-bold">
            Available Assignments
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4 w-full md:w-auto">
          <div className="flex shrink-0 items-center bg-white py-2 px-3 rounded-lg border border-solid border-gray-100 shadow-[2px_2px_6px_#497BF11A] flex-1 md:w-[400px]">
            <input
              type="text"
              placeholder="Search by assignment title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[#7C8493] text-sm bg-transparent outline-none flex-1 mr-2"
            />
            <div className="w-6 h-6 relative">
              <Image
                src="/assets/searchicon.png"
                alt="Search"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-slate-500">Pending Reviews</p>
          <p className="text-2xl font-bold text-slate-700">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-slate-500">Needs Improvement</p>
          <p className="text-2xl font-bold text-amber-600">
            {needsImprovementCount}
          </p>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-solid border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
          <div className="w-[180px] h-[130px] relative mb-8">
            <Image
              src="/assets/notest.png"
              alt="No test illustration"
              width={180}
              height={130}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <h3 className="text-slate-800 text-2xl font-bold">
              {searchQuery ? "No Results Found" : "No Assignment Available"}
            </h3>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed">
              {searchQuery
                ? `We couldn't find any assessments matching "${searchQuery}". Please try a different search term.`
                : "Currently, there are no assignments available. Please check back later for updates."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {filteredAssignments.map((assignment) => {
            const submissionCount = submissions.filter(
              (item) =>
                item.assignmentId === assignment.id &&
                item.studentId === user?.id,
            ).length;

            return (
              <div
                key={assignment.id}
                className="flex flex-col bg-white p-6 gap-6 rounded-2xl border border-solid border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col items-start self-stretch pr-4 gap-5">
                  <span className="text-slate-700 text-xl font-bold group-hover:text-[#6633FF] transition-colors leading-tight">
                    {assignment.title}
                  </span>
                  <p className="text-sm text-slate-500">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap justify-between items-center self-stretch gap-y-4">
                    <div className="flex shrink-0 items-center">
                      <Clock className="w-5 h-5 mr-2 text-slate-400" />
                      <span className="text-slate-700 text-sm mr-2 font-medium">
                        Deadline:
                      </span>
                      <span className="text-slate-700 text-sm">
                        {assignment.deadline}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-slate-400" />
                      <span className="text-slate-500 text-sm mr-2 font-medium">
                        Difficulty:
                      </span>
                      <span className="text-slate-700 text-sm capitalize">
                        {assignment.difficulty}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="text-slate-700 text-sm mr-2 font-medium">
                        My Submissions:
                      </span>
                      <span className="text-slate-700 text-sm">
                        {submissionCount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start self-stretch">
                  <button
                    onClick={() => handleStartExam(assignment.id)}
                    className="text-[#6633FF] bg-transparent hover:bg-[#6633FF] hover:text-white transition-all text-sm font-bold py-3 px-[53px] rounded-xl border-2 border-solid border-[#6633FF] flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Open & Submit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center self-stretch gap-4 mt-4">
        <div className="flex shrink-0 items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm text-slate-400 hover:text-[#6633FF] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="flex items-center justify-center bg-[#6633FF] text-white w-10 h-10 rounded-xl font-bold shadow-lg shadow-[#6633FF]/20">
            1
          </button>
          <button className="flex items-center justify-center bg-white text-slate-700 w-10 h-10 rounded-xl font-bold hover:bg-gray-50 border border-gray-100 shadow-sm transition-colors">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm text-slate-400 hover:text-[#6633FF] transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-[19px]">
          <span className="text-[#666666] text-xs">Assignments Per Page</span>
          <div className="flex shrink-0 items-center bg-white py-1.5 px-3 gap-3 rounded-lg border border-solid border-[#F0F1F3] cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-[#2E2E2E] text-sm font-bold">8</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
