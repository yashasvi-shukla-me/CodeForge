import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const safeArray = (val) => {
  if (!val) return [];

  if (Array.isArray(val)) return val;

  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [val];
  }
};

const SubmissionResults = ({ submission }) => {
  if (!submission) return null;

  const memoryArr = safeArray(submission.memory);
  const timeArr = safeArray(submission.time);
  const testCases = submission.testCases || [];

  const avgMemory =
    memoryArr.length > 0
      ? memoryArr.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
        memoryArr.length
      : 0;

  const avgTime =
    timeArr.length > 0
      ? timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
        timeArr.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>Status: {submission.status || "Executed"}</div>
        <div>Runtime: {avgTime.toFixed(3)} s</div>
        <div>Memory: {avgMemory.toFixed(0)} KB</div>
      </div>

      {testCases.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Status</th>
              <th>Expected</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, i) => (
              <tr key={i}>
                <td>{tc.passed ? "Passed" : "Failed"}</td>
                <td>{String(tc.expected)}</td>
                <td>{String(tc.stdout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionResults;
