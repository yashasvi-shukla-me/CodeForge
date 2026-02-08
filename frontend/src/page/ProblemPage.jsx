import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";

import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore.js";
import { useExecutionStore } from "../store/useExecutionStore.js";
import { useSubmissionStore } from "../store/useSubmissionStore.js";
import { getLanguageId } from "../lib/lang.js";

import SubmissionResults from "../components/Submission.jsx";
import SubmissionList from "../components/SubmissionList.jsx";

const ProblemPage = () => {
  const { id } = useParams();

  /* ---------------- STORES ---------------- */
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: runResult,
    executeCode,
    isExecuting,
  } = useExecutionStore();

  const {
    submission: submissions,
    submitSolution,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    isLoading: isSubmissionsLoading,
  } = useSubmissionStore();

  /* ---------------- STATE ---------------- */
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (!problem) return;

    // load starter code only first time
    if (!code) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
    }

    setTestCases(
      problem.testcases?.map((tc) => ({
        input: tc.input,
        output: tc.output,
      })) || [],
    );
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions") {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  /* ---------------- HANDLERS ---------------- */

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);

    setCode(problem.codeSnippets?.[lang] || "");
  };

  /* -------- RUN ONLY (NO SUBMIT) -------- */
  const handleRunCode = async () => {
    try {
      await executeCode({
        source_code: code,
        language_id: getLanguageId(selectedLanguage),
      });
    } catch {
      toast.error("Execution failed");
    }
  };

  /* -------- SUBMIT ONLY -------- */
  const handleSubmitSolution = async () => {
    try {
      setIsSubmitting(true);

      await submitSolution({
        problemId: problem.id,
        source_code: code,
        language_id: getLanguageId(selectedLanguage),
      });

      toast.success("Submitted successfully");
      setActiveTab("submissions");
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- LOADING SCREEN ---------------- */

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  /* ---------------- DESCRIPTION TAB ---------------- */

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples &&
              Object.values(problem.examples).map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                >
                  <p>
                    <b>Input:</b> {ex.input}
                  </p>
                  <p>
                    <b>Output:</b> {ex.output}
                  </p>
                  {ex.explanation && <p>{ex.explanation}</p>}
                </div>
              ))}

            {problem.constraints && (
              <>
                <h3>Constraints</h3>
                <pre>{problem.constraints}</pre>
              </>
            )}
          </div>
        );

      case "submissions":
        return (
          <SubmissionList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );

      case "discussion":
        return <div className="p-4 text-center">No discussions yet</div>;

      case "hints":
        return (
          <div className="p-4">{problem.hints || "No hints available"}</div>
        );

      default:
        return null;
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-base-200">
      {/* ---------- HEADER ---------- */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Home className="w-5 h-5" />
          <ChevronRight />
        </Link>

        <h1 className="ml-3 font-bold text-lg">{problem.title}</h1>

        <div className="ml-auto flex gap-3">
          <select
            className="select select-bordered select-sm"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>

          <button
            className={`btn btn-ghost ${isBookmarked ? "text-primary" : ""}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark />
          </button>
        </div>
      </nav>

      {/* ---------- MAIN GRID ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* LEFT PANEL */}
        <div className="card bg-base-100 shadow-xl">
          <div className="tabs tabs-bordered">
            {["description", "submissions", "discussion", "hints"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="card bg-base-100 shadow-xl">
          <div className="h-[520px]">
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase()}
              key={selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="p-4 border-t flex justify-between">
            <button
              className={`btn btn-primary ${isExecuting ? "loading" : ""}`}
              onClick={handleRunCode}
              disabled={isExecuting || isSubmitting}
            >
              Run Code
            </button>

            <button
              className={`btn btn-success ${isSubmitting ? "loading" : ""}`}
              onClick={handleSubmitSolution}
              disabled={isSubmitting || isExecuting}
            >
              Submit Solution
            </button>
          </div>
        </div>
      </div>

      {/* ---------- RESULT SECTION ---------- */}
      <div className="card bg-base-100 m-4 shadow-xl">
        <div className="card-body">
          {runResult ? (
            <SubmissionResults submission={runResult} />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected</th>
                </tr>
              </thead>
              <tbody>
                {testcases.map((tc, i) => (
                  <tr key={i}>
                    <td>{tc.input}</td>
                    <td>{tc.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
