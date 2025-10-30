"use client";
import { DocumentItem } from "@/types/kyc";
import { FileText } from 'lucide-react';

export const DocumentsCard: React.FC<{
  documents: DocumentItem[];
  onDocumentClick: (doc: DocumentItem) => void;
}> = ({ documents, onDocumentClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Submitted Documents</h2>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No documents uploaded</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onDocumentClick(doc)}
              className="relative group cursor-pointer rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                {doc.type === 'pdf' ? (
                  <div className="text-center p-4">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 font-medium">{doc.name}</p>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doc.url}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Click to view</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};