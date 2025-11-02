// Error State Component
import React from "react";
import { AlertCircle } from "lucide-react";
export const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
    return (
        <tr>
            <td colSpan={8} className="px-6 py-16">
                <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-16 h-16 text-red-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
                    <p className="text-sm text-gray-500 mb-4">There was an error loading the jobs.</p>
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </td>
        </tr>
    );
};