"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFPreview({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const handlePrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
    };

    return (<div className="flex flex-col items-center justify-center w-full space-y-4">
        <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPageNumber(1);
            }}
            loading={<p className="text-gray-500">Loading PDF...</p>}
            onLoadError={(error) => console.error("PDF load error:", error)}
        > <Page
                pageNumber={pageNumber}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
            /> </Document>
        {numPages > 1 && (
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePrevPage}
                    disabled={pageNumber <= 1}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm text-gray-700">
                    Page {pageNumber} of {numPages}
                </span>

                <button
                    onClick={handleNextPage}
                    disabled={pageNumber >= numPages}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>


    );
}
