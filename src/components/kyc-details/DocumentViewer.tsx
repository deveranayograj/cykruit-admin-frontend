"use client";

import dynamic from "next/dynamic";
import { DocumentItem } from "@/types/kyc";
import { FileText, Download, X } from "lucide-react";

// ✅ Dynamically import the PDF preview (client-only)
const PDFPreview = dynamic(() => import("./PDFPreview"), { ssr: false });

export const DocumentViewer: React.FC<{
  document: DocumentItem | null;
  onClose: () => void;
}> = ({ document, onClose }) => {
  if (!document) return null;

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900 truncate max-w-[400px]">
              {document.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
          {document.type === "pdf" ? (
            <PDFPreview fileUrl={document.url} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain rounded-md shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};