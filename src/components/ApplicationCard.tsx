import { memo } from "react";

interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
}

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const statusConfig: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
  }
> = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  interview: {
    label: "Interview",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  offer: {
    label: "Offer",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

const ApplicationCard = memo(function ApplicationCard({
  application,
  onDelete,
  onEdit,
}: ApplicationCardProps) {
  const status = statusConfig[application.status] || statusConfig.applied;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200
                    p-5 hover:shadow-md transition-all duration-200
                    hover:border-gray-300 group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left section */}
        <div className="flex-1 min-w-0">
          {/* Company and Role */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br
                            from-blue-500 to-purple-600 flex items-center
                            justify-center text-white font-bold text-sm
                            flex-shrink-0"
            >
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {application.company}
              </h3>
              <p className="text-gray-500 text-sm">{application.role}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5
                             px-3 py-1 rounded-full text-xs font-medium
                             ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>

            {application.salary && (
              <span
                className="text-xs text-gray-500 bg-gray-100
                               px-2 py-1 rounded-full"
              >
                💰 {application.salary}
              </span>
            )}

            <span className="text-xs text-gray-400">
              📅{" "}
              {new Date(application.appliedDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Notes */}
          {application.notes && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-1">
              📝 {application.notes}
            </p>
          )}
        </div>

        {/* Right section — actions */}
        <div
          className="flex items-center gap-2 flex-shrink-0
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-200"
        >
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600
                         hover:bg-blue-50 rounded-lg transition-colors
                         no-underline text-sm"
              title="View job posting"
            >
              🔗
            </a>
          )}

          <button
            onClick={() => onEdit(application.id)}
            className="p-2 text-gray-400 hover:text-blue-600
                       hover:bg-blue-50 rounded-lg transition-colors
                       border-none cursor-pointer bg-transparent text-sm"
            title="Edit application"
          >
            ✏️
          </button>

          <button
            onClick={() => onDelete(application.id)}
            className="p-2 text-gray-400 hover:text-red-600
                       hover:bg-red-50 rounded-lg transition-colors
                       border-none cursor-pointer bg-transparent text-sm"
            title="Delete application"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

export default ApplicationCard;
