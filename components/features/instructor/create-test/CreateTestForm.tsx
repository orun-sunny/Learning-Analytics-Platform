"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useExamStore } from "@/store/examStore";
import { useUIStore } from "@/store/uiStore";
import {
  ChevronDown,
  Clock,
  PlusCircle,
  Trash2,
  Wand2,
  Info,
  ListChecks,
  Bold,
  Italic,
  Link2,
  Code2,
  Image as ImageIcon,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Plus,
  Pencil,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const basicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  totalCandidates: z.number().min(1, "At least 1 candidate"),
  totalSlots: z.number().min(1, "At least 1 slot"),
  totalQuestionSet: z.number().min(1, "At least 1 question set"),
  questionType: z.string().min(1, "Select a question type"),
  startTime: z.string().nonempty("Required"),
  endTime: z.string().nonempty("Required"),
  duration: z.number().min(1, "Required"),
});

type BasicInfoStatus = z.infer<typeof basicInfoSchema>;

interface FormQuestion {
  id: string;
  title: string;
  type: "checkbox" | "radio" | "text";
  options: string[];
  score?: number;
  correctAnswers?: number[];
}

export const CreateTestForm = () => {
  const router = useRouter();
  const addExam = useExamStore((state) => state.addExam);
  const { showModal } = useUIStore();

  const [activeTab, setActiveTab] = useState<"basic" | "questions">("basic");
  const [basicInfoMode, setBasicInfoMode] = useState<"edit" | "view">("edit");
  const [questions, setQuestions] = useState<FormQuestion[]>([]);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [qTitle, setQTitle] = useState("");
  const [qType, setQType] = useState<"checkbox" | "radio" | "text">("checkbox");

  const [qOptions, setQOptions] = useState<string[]>(["Option 1", "Option 2"]);
  const [qScore, setQScore] = useState<number>(1);
  const [qCorrectAnswers, setQCorrectAnswers] = useState<number[]>([0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<BasicInfoStatus>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      if (basicInfoMode === "edit") {
        setBasicInfoMode("view");
      } else {
        setActiveTab("questions");
      }
    }
  };

  const onSubmit = (data: BasicInfoStatus) => {
    if (questions.length === 0) {
      showModal({
        title: "Missing Questions",
        message:
          "Please add at least one question to your assessment before submitting!",
        type: "alert",
        confirmText: "Okay",
      });
      return;
    }

    addExam({
      id: Math.random().toString(36).substring(7),
      title: data.title,
      totalCandidates: data.totalCandidates,
      totalSlots: data.totalSlots,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      negativeMarking: false,
      createdAt: new Date().toISOString(),
      questionSets: [
        {
          id: "set1",
          name: "Default Set",
          questions: questions,
        },
      ],
    });

    router.push("/employer/dashboard");
  };

  const openQuestionModal = (q?: FormQuestion) => {
    if (q) {
      setEditingQuestionId(q.id);
      setQTitle(q.title);
      setQType(q.type);
      setQOptions(q.options);
      setQScore(q.score || 1);
      setQCorrectAnswers(q.correctAnswers || [0]);
    } else {
      setEditingQuestionId(null);
      setQTitle("");
      setQType("radio");
      setQOptions(["", ""]);
      setQScore(1);
      setQCorrectAnswers([0]);
    }
    setIsQuestionModalOpen(true);
  };

  const saveQuestion = () => {
    if (!qTitle.trim()) return;
    const newQuestion: FormQuestion = {
      id: editingQuestionId || Math.random().toString(36).substring(7),
      title: qTitle,
      type: qType,
      options: qType !== "text" ? qOptions.filter((o) => o.trim() !== "") : [],
      score: qScore,
      correctAnswers: qCorrectAnswers,
    };
    if (editingQuestionId) {
      setQuestions(
        questions.map((q) => (q.id === editingQuestionId ? newQuestion : q)),
      );
    } else {
      setQuestions([...questions, newQuestion]);
    }
    setIsQuestionModalOpen(false);
  };

  const deleteQuestion = (id: string) =>
    setQuestions(questions.filter((q) => q.id !== id));

  const generateAIQuestions = () => {
    const mockAIQuestions: FormQuestion[] = [
      {
        id: "ai1",
        title: "What is the virtual DOM?",
        type: "text",
        options: [],
      },
      {
        id: "ai2",
        title: "Which of the following are React hooks?",
        type: "checkbox",
        options: ["useState", "useForm", "useFilter", "useEffect"],
      },
    ];
    setQuestions([...questions, ...mockAIQuestions]);
  };

  return (
    <div className="flex flex-col items-center self-stretch mx-4 md:mx-20 gap-8 mb-[120px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8 items-center"
      >
        {/* Header & Stepper Card */}
        <div className="flex flex-col items-start self-stretch bg-white p-6 gap-6 rounded-2xl border border-solid border-gray-200 w-full shadow-sm">
          <span className="text-slate-700 text-xl font-bold">
            Manage Online Test
          </span>
          <div className="flex flex-col md:flex-row justify-between items-center self-stretch gap-4 md:gap-0">
            <div className="flex shrink-0 items-center gap-4">
              <div
                className={`flex shrink-0 items-center gap-2 cursor-pointer transition-opacity ${activeTab === "questions" ? "opacity-50 hover:opacity-100" : ""}`}
                onClick={() => {
                  setActiveTab("basic");
                  // If they already have valid data, show view mode
                  if (formValues.title) setBasicInfoMode("view");
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === "basic" ? "bg-[#6633FF] text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <Info className="w-4 h-4" />
                </div>
                <span
                  className={`${activeTab === "basic" ? "text-[#6633FF] font-bold" : "text-slate-700"} text-sm`}
                >
                  Basic Info
                </span>
              </div>
              <div className="bg-gray-300 w-10 md:w-20 h-[1px]"></div>
              <div
                className={`flex shrink-0 items-center gap-2 transition-opacity ${activeTab === "basic" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={async () => {
                  if (activeTab === "basic") {
                    const valid = await trigger();
                    if (valid) setActiveTab("questions");
                  } else {
                    setActiveTab("questions");
                  }
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === "questions" ? "bg-[#6633FF] text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <ListChecks className="w-4 h-4" />
                </div>
                <div className="flex flex-col shrink-0 items-start pb-[1px]">
                  <span
                    className={`${activeTab === "questions" ? "text-[#6633FF] font-bold" : "text-slate-700"} text-sm`}
                  >
                    Questions Sets
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/employer/dashboard")}
              className="flex flex-col shrink-0 items-start bg-transparent hover:bg-gray-50 transition-colors text-left py-2.5 px-[26px] rounded-xl border border-solid border-gray-200 shadow-sm"
            >
              <span className="text-slate-700 text-sm font-bold">
                Back to Dashboard
              </span>
            </button>
          </div>
        </div>

        {activeTab === "basic" && (
          <div className="flex flex-col items-start gap-6 w-full max-w-4xl">
            <div className="flex flex-col items-start bg-white p-6 gap-5 rounded-2xl border border-solid border-gray-200 w-full shadow-sm">
              <div className="flex w-full justify-between items-center">
                <span className="text-slate-700 text-lg font-bold">
                  Basic Information
                </span>
                {basicInfoMode === "view" && (
                  <div
                    className="flex shrink-0 items-center py-1.5 gap-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setBasicInfoMode("edit")}
                  >
                    <Pencil className="w-4 h-4 text-[#6633FF]" />
                    <span className="text-[#6633FF] text-sm font-bold">
                      Edit
                    </span>
                  </div>
                )}
              </div>

              {basicInfoMode === "edit" ? (
                <div className="flex flex-col items-start gap-6 w-full mt-2 animate-in fade-in duration-300">
                  {/* Title Row */}
                  <div className="flex flex-col items-start gap-3 w-full">
                    <div className="flex items-center">
                      <span className="text-slate-700 text-sm font-medium mr-1">
                        Online Test Title
                      </span>
                      <span className="text-[#EA5055] text-sm">*</span>
                    </div>
                    <div
                      className={`flex flex-col w-full bg-white py-[13px] px-3 rounded-lg border border-solid ${errors.title ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                    >
                      <input
                        type="text"
                        placeholder="Enter online test title"
                        className="text-slate-700 text-sm outline-none bg-transparent w-full"
                        {...register("title")}
                      />
                    </div>
                    {errors.title && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  {/* Candidates & Slots Row */}
                  <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Total Candidates
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex flex-col bg-white py-[13px] px-3 rounded-lg border border-solid ${errors.totalCandidates ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="number"
                          placeholder="Enter total candidates"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("totalCandidates", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      {errors.totalCandidates && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.totalCandidates.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Total Slots
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid ${errors.totalSlots ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="number"
                          placeholder="Enter total slots"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("totalSlots", { valueAsNumber: true })}
                        />
                      </div>
                      {errors.totalSlots && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.totalSlots.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Set & Type Row */}
                  <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Total Question Set
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid border-gray-200 focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="number"
                          placeholder="Enter total question sets"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("totalQuestionSet", {
                            valueAsNumber: true,
                          })}
                        />
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Question Type
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid border-gray-200 focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="text"
                          placeholder="e.g. Cognitive"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("questionType")}
                        />
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Timing Row */}
                  <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Start Time
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid ${errors.startTime ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="datetime-local"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("startTime")}
                        />
                      </div>
                      {errors.startTime && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.startTime.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          End Time
                        </span>
                        <span className="text-[#EA5055] text-sm">*</span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid ${errors.endTime ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="datetime-local"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("endTime")}
                        />
                      </div>
                      {errors.endTime && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.endTime.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-center">
                        <span className="text-slate-700 text-sm font-medium mr-1">
                          Duration
                        </span>
                      </div>
                      <div
                        className={`flex items-center bg-white p-3 rounded-lg border border-solid ${errors.duration ? "border-red-500" : "border-gray-200"} focus-within:border-[#6633FF]`}
                      >
                        <input
                          type="number"
                          placeholder="In Minutes"
                          className="text-slate-700 text-sm outline-none bg-transparent w-full"
                          {...register("duration", { valueAsNumber: true })}
                        />
                        <Clock className="w-5 h-5 text-gray-400 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-6 w-full mt-2 animate-in slide-in-from-bottom-2 duration-400">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-slate-500 text-sm">
                      Online Test Title
                    </span>
                    <span className="text-slate-700 text-base font-medium">
                      {formValues.title || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-start gap-y-6 w-full">
                    <div className="flex flex-col items-start w-1/4 min-w-[150px] gap-1">
                      <span className="text-slate-500 text-sm">
                        Total Candidates
                      </span>
                      <span className="text-slate-700 text-base font-medium">
                        {formValues.totalCandidates?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start w-1/4 min-w-[150px] gap-1">
                      <span className="text-slate-500 text-sm">
                        Total Slots
                      </span>
                      <span className="text-slate-700 text-base font-medium">
                        {formValues.totalSlots || "0"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start w-1/4 min-w-[150px] gap-1">
                      <span className="text-slate-500 text-sm">
                        Total Question Set
                      </span>
                      <span className="text-slate-700 text-base font-medium">
                        {formValues.totalQuestionSet || "0"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start w-1/4 min-w-[150px] gap-1">
                      <span className="text-slate-500 text-sm">
                        Duration (Minutes)
                      </span>
                      <span className="text-slate-700 text-base font-medium">
                        {formValues.duration || "0"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start w-full gap-1 mt-2">
                      <span className="text-slate-500 text-sm">
                        Question Type
                      </span>
                      <span className="text-slate-700 text-base font-medium">
                        {formValues.questionType || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl w-full border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => router.push("/employer/dashboard")}
                className="flex items-center bg-transparent hover:bg-gray-50 transition-colors text-center py-3 px-[63px] rounded-xl border border-solid border-gray-200"
              >
                <span className="text-slate-700 text-base font-bold w-full">
                  Cancel
                </span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center bg-[#6633FF] hover:bg-[#5229CC] transition-colors text-center py-3 px-[26px] rounded-xl border-0"
              >
                <span className="text-white text-base font-bold">
                  Save & Continue
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="flex flex-col items-start gap-6 w-full max-w-4xl animate-in slide-in-from-right-4 duration-500">
            {/* Questions Header with AI Generate */}
            {questions.length > 0 && (
              <div className="flex justify-between items-center w-full px-2">
                <span className="text-slate-700 text-lg font-bold">
                  Question Sets ({questions.length})
                </span>
                <button
                  type="button"
                  onClick={generateAIQuestions}
                  className="flex items-center text-[#6633FF] font-medium text-sm hover:underline hover:opacity-80"
                >
                  <Wand2 className="w-4 h-4 mr-1" /> AI Generate
                </button>
              </div>
            )}

            <div className="flex flex-col items-center w-full gap-6">
              {questions.length > 0 ? (
                <div className="w-full space-y-6">
                  {questions.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex flex-col items-start bg-white p-6 gap-[15px] rounded-2xl shadow-sm border border-gray-100 w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <div className="flex flex-col items-start gap-6 w-full">
                        <div className="flex flex-col items-start gap-[23px] w-full">
                          <div className="flex flex-col items-start gap-4 w-full">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-slate-700 text-base font-bold">
                                Question {i + 1}
                              </span>
                              <div className="flex shrink-0 items-center gap-3">
                                <div className="bg-transparent py-[5px] px-3 rounded-xl border border-solid border-gray-200">
                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    {q.type}
                                  </span>
                                </div>
                                <div className="bg-transparent py-[5px] px-4 rounded-xl border border-solid border-gray-200">
                                  <span className="text-slate-500 text-xs font-bold uppercase">
                                    {q.score || 1} PT
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-200 w-full h-[1px]"></div>
                          </div>

                          <div className="flex flex-col items-start gap-[26px] w-full">
                            <span className="text-black text-base font-bold pr-10">
                              {q.title}
                            </span>

                            {q.type !== "text" ? (
                              <div className="flex flex-col items-start gap-3 w-full">
                                {q.options.map((opt, idx) => {
                                  const isCorrect =
                                    q.correctAnswers?.includes(idx);
                                  return (
                                    <div
                                      key={idx}
                                      className={`flex items-center w-full py-3 px-4 rounded-lg transition-all ${isCorrect ? "bg-[#F2F4F7] border border-[#6633FF]/10" : "bg-white"}`}
                                    >
                                      <span
                                        className={`text-slate-700 text-base flex-1 ${isCorrect ? "font-bold" : "font-medium"}`}
                                      >
                                        {String.fromCharCode(65 + idx)}. {opt}
                                      </span>
                                      {isCorrect && (
                                        <CheckCircle2 className="w-6 h-6 text-[#6633FF] ml-4 shrink-0 fill-white" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="w-full text-slate-700 text-base border-l-4 border-gray-100 pl-4 py-2 italic leading-relaxed">
                                This is a descriptive question.
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-200 w-full h-[1px]"></div>
                      </div>
                      <div className="flex items-center w-full mt-2">
                        <button
                          type="button"
                          onClick={() => openQuestionModal(q)}
                          className="text-[#6633FF] text-base font-medium mr-auto hover:bg-slate-50 py-1.5 px-3 rounded-lg transition-colors border-0"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(q.id)}
                          className="text-[#EA5055] text-base font-medium hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors border-0"
                        >
                          Remove From Exam
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <PlusCircle className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-700 text-lg font-bold">
                      No questions yet
                    </span>
                    <p className="text-gray-400 text-sm">
                      Click &apos;Add Question&apos; below to start building
                      your test manually.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => openQuestionModal()}
                className="w-full flex flex-col items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all group"
              >
                <div className="w-full flex justify-center items-center bg-[#6633FF] py-4 rounded-xl group-hover:bg-[#5229CC] transition-colors">
                  <span className="text-white text-base font-bold">
                    Add Question
                  </span>
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl w-full border border-gray-200 shadow-sm mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className="flex items-center bg-transparent hover:bg-gray-50 transition-colors text-center py-3 px-10 rounded-xl border border-solid border-gray-200"
              >
                <span className="text-slate-700 text-base font-bold w-full">
                  Back
                </span>
              </button>
              <button
                type="submit"
                className="flex items-center bg-[#6633FF] hover:bg-[#5229CC] transition-colors text-center py-3 px-10 rounded-xl border-0"
              >
                <span className="text-white text-base font-bold">
                  Complete Test Creation
                </span>
              </button>
            </div>
          </div>
        )}
      </form>

      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="sm:max-w-[960px] bg-white rounded-2xl border-0 p-0 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="flex items-center justify-between w-full p-6 border-b border-gray-100 bg-white z-10">
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex flex-col shrink-0 items-center justify-center bg-gray-50 w-8 h-8 rounded-full border border-solid border-gray-200">
                <span className="text-slate-700 text-sm font-bold">
                  {editingQuestionId
                    ? questions.findIndex((q) => q.id === editingQuestionId) + 1
                    : questions.length + 1}
                </span>
              </div>
              <span className="text-slate-700 text-base font-bold">
                {editingQuestionId
                  ? "Edit Question"
                  : `Question ${questions.length + 1}`}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-[19px]">
              <div className="flex shrink-0 items-center gap-5">
                <div className="flex shrink-0 items-center gap-[11px]">
                  <span className="text-slate-700 text-sm font-bold">
                    Score:
                  </span>
                  <div className="flex flex-col shrink-0 items-start bg-transparent py-1.5 px-3 rounded-lg border border-solid border-gray-200">
                    <input
                      type="number"
                      value={qScore}
                      onChange={(e) => setQScore(parseInt(e.target.value) || 0)}
                      className="text-slate-700 text-sm font-bold w-10 outline-none"
                    />
                  </div>
                </div>
                <div className="flex shrink-0 items-center bg-transparent py-1.5 px-4 gap-2 rounded-lg border border-solid border-gray-200 cursor-pointer relative group">
                  <select
                    value={qType}
                    onChange={(e) =>
                      setQType(e.target.value as "checkbox" | "radio" | "text")
                    }
                    className="bg-transparent text-slate-700 text-sm font-bold outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="checkbox">MCQ</option>
                    <option value="radio">Radio</option>
                    <option value="text">Text</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 pointer-events-none" />
                </div>
              </div>
              <Trash2
                className="w-6 h-6 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => setIsQuestionModalOpen(false)}
              />
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="flex flex-col items-start gap-3 w-full">
              {/* Question Title / Input Area */}
              <div className="flex flex-col items-start bg-white w-full rounded-lg border border-solid border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center bg-gray-50 py-[15px] px-4 w-full border-b border-gray-200">
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="flex gap-1.5 items-center">
                      <Bold className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                      <Italic className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                    </div>
                    <div className="flex items-center gap-[5px] cursor-pointer group">
                      <span className="text-[#212529] text-sm group-hover:text-[#6633FF]">
                        Normal text
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Link2 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                      <Code2 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <ImageIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                      <MoreHorizontal className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
                    </div>
                  </div>
                </div>
                <textarea
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full h-32 p-4 text-slate-700 text-sm outline-none resize-none bg-white"
                />
              </div>
            </div>

            {/* Options Section (Hidden for Text type) */}
            {qType !== "text" && (
              <div className="flex flex-col items-start gap-6 w-full mt-2">
                {qOptions.map((opt, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start gap-3 w-full animate-in fade-in slide-in-from-top-1 duration-200 bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="flex flex-col shrink-0 items-center justify-center bg-gray-50 w-8 h-8 rounded-full border border-solid border-gray-200">
                          <span className="text-slate-700 text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <div
                          className="flex shrink-0 items-center gap-2 cursor-pointer group/correct"
                          onClick={() => {
                            setQCorrectAnswers([index]);
                          }}
                        >
                          {qCorrectAnswers.includes(index) ? (
                            <CheckCircle2 className="w-6 h-6 text-[#6633FF]" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-300 group-hover/correct:text-gray-400" />
                          )}
                          <span
                            className={`text-sm transition-colors ${qCorrectAnswers.includes(index) ? "text-[#6633FF] font-bold" : "text-slate-500 font-medium group-hover/correct:text-slate-700"}`}
                          >
                            Set as correct answer
                          </span>
                        </div>
                      </div>
                      <Trash2
                        className="w-5 h-5 text-gray-300 cursor-pointer hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() =>
                          setQOptions(qOptions.filter((_, i) => i !== index))
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start bg-white w-full rounded-lg border border-solid border-gray-200 overflow-hidden">
                      <div className="flex items-center bg-gray-50 py-2 px-4 w-full border-b border-gray-200">
                        <div className="flex gap-1.5 scale-90 origin-left">
                          <Bold className="w-4 h-4 text-slate-400" />
                          <Italic className="w-4 h-4 text-slate-400" />
                          <div className="flex items-center gap-1 mx-2">
                            <span className="text-slate-400 text-xs">
                              Normal
                            </span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </div>
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOps = [...qOptions];
                          newOps[index] = e.target.value;
                          setQOptions(newOps);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full py-3 px-4 text-slate-700 text-sm outline-none"
                      />
                    </div>
                  </div>
                ))}

                <div
                  className="flex items-center py-3 px-4 gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-dashed border-gray-300 w-full justify-center group"
                  onClick={() => setQOptions([...qOptions, ""])}
                >
                  <Plus className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-700 text-sm font-medium">
                    Add Another Option
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-4">
            <button
              type="button"
              className="flex flex-col shrink-0 items-center justify-center bg-transparent py-3 px-10 rounded-xl border border-solid border-[#6633FF] hover:bg-indigo-50 transition-colors"
              onClick={saveQuestion}
            >
              <span className="text-[#6633FF] text-base font-bold">Save</span>
            </button>
            <button
              type="button"
              className="flex flex-col shrink-0 items-center justify-center bg-[#6633FF] py-3 px-6 rounded-xl border-0 hover:bg-[#5229CC] transition-colors"
              onClick={() => {
                saveQuestion();
                setQTitle("");
                setQOptions(["", ""]);
                setQCorrectAnswers([0]);
                setEditingQuestionId(null);
                setIsQuestionModalOpen(true);
              }}
            >
              <span className="text-white text-base font-bold">
                Save & Add More
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
