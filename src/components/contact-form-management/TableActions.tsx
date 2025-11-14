// src/components/contact-form-management/TableActions.tsx
"use client";

import React, { useState } from "react";
import { Check, Flag, Trash } from "lucide-react";
import { ContactFormRecord, ContactFormStatus } from "@/types/contactForm";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";

export const TableActions: React.FC<{
  record: ContactFormRecord;
  onUpdateStatus: (id: string, status: ContactFormStatus, remarks?: string) => void;
}> = ({ record, onUpdateStatus }) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [spamOpen, setSpamOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">

      {/* Mark Reviewed */}
      {record.status !== "REVIEWED" && (
        <button
          onClick={() => setReviewOpen(true)}
          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded"
          title="Mark as Reviewed"
        >
          <Check className="w-4 h-4" />
        </button>
      )}

      {/* Resolve */}
      {record.status !== "RESOLVED" && (
        <button
          onClick={() => setResolveOpen(true)}
          className="p-1.5 text-green-600 hover:bg-green-100 rounded"
          title="Resolve"
        >
          <Flag className="w-4 h-4" />
        </button>
      )}

      {/* Mark as Spam */}
      {record.status !== "SPAM" && (
        <button
          onClick={() => setSpamOpen(true)}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded"
          title="Mark as Spam"
        >
          <Trash className="w-4 h-4" />
        </button>
      )}

      {/* Confirm Dialog: Reviewed */}
      <ConfirmDialog
        open={reviewOpen}
        title="Mark as Reviewed"
        message="You can optionally add remarks below."
        confirmLabel="Mark Reviewed"
        confirmColor="bg-indigo-600 hover:bg-indigo-700"
        showInput={false}   // 🚀 IMPORTANT
        onCancel={() => setReviewOpen(false)}
        onConfirm={(_, remarks) => {
          onUpdateStatus(record.id, "REVIEWED", remarks || "");
          setReviewOpen(false);
        }}
      />

      {/* Confirm Dialog: Resolve */}
      <ConfirmDialog
        open={resolveOpen}
        title="Resolve Submission"
        message="You can optionally add remarks below."
        confirmLabel="Resolve"
        confirmColor="bg-green-600 hover:bg-green-700"
        showInput={false}
        onCancel={() => setResolveOpen(false)}
        onConfirm={(_, remarks) => {
          onUpdateStatus(record.id, "RESOLVED", remarks || "");
          setResolveOpen(false);
        }}
      />

      {/* Confirm Dialog: Spam */}
      <ConfirmDialog
        open={spamOpen}
        title="Mark as Spam"
        message="You can optionally add remarks below."
        confirmLabel="Mark Spam"
        confirmColor="bg-red-600 hover:bg-red-700"
        showInput={false}
        onCancel={() => setSpamOpen(false)}
        onConfirm={(_, remarks) => {
          onUpdateStatus(record.id, "SPAM", remarks || "");
          setSpamOpen(false);
        }}
      />
    </div>
  );
};
