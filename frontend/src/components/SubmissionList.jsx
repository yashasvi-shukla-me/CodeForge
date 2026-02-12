import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const toArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;

  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [v];
  }
};

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const SubmissionsList = ({ submissions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return <div className="p-8 text-center">No submissions yet</div>;
  }

  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        const mem = avg(toArray(s.memory).map(Number));
        const time = avg(toArray(s.time).map(Number));

        return (
          <div key={s.id} className="card bg-base-200 shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                {s.status === "Accepted" ? (
                  <CheckCircle2 className="text-success w-5 h-5" />
                ) : (
                  <XCircle className="text-error w-5 h-5" />
                )}
                <span>{s.status}</span>
                <span className="badge">{s.language}</span>
              </div>

              <div className="flex gap-4 text-sm opacity-70">
                <span>
                  <Clock /> {time.toFixed(3)} s
                </span>
                <span>
                  <Memory /> {mem.toFixed(0)} KB
                </span>
                <span>
                  <Calendar /> {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
