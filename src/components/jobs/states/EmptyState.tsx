// Empty State Component
import React from "react";
import { FileX } from "lucide-react";
export const EmptyState: React.FC = () => {
    return (
        <tr>
            <td colSpan={8} className="px-6 py-16">
                <div className="flex flex-col items-center justify-center text-center">
                    <FileX className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
                    <p className="text-sm text-gray-500">There are no jobs matching your filters.</p>
                </div>
            </td>
        </tr>
    );
};