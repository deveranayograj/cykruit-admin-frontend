// Moderation Info Card
import { JobDetail } from "@/types/job";
import { Check, Flag } from "lucide-react";
export const ModerationCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!job.moderatedAt && !job.flaggedAt) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Moderation Information</h3>
      
      <div className="space-y-4">
        {job.moderatedAt && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Check className="w-4 h-4" />
              <span className="font-medium">Moderated</span>
            </div>
            <div className="text-sm text-green-700">
              <p>Moderated on: {formatDate(job.moderatedAt)}</p>
              {job.moderatedBy && <p>By: Admin #{job.moderatedBy}</p>}
            </div>
          </div>
        )}

        {job.flaggedAt && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <Flag className="w-4 h-4" />
              <span className="font-medium">Flagged</span>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <p>Flagged on: {formatDate(job.flaggedAt)}</p>
              {job.flaggedBy && <p>By: Admin #{job.flaggedBy}</p>}
              {job.flagReason && (
                <div className="mt-2">
                  <p className="font-medium">Reason:</p>
                  <p className="mt-1">{job.flagReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};