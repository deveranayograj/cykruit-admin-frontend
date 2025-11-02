// Work Mode Badge
import React from 'react';
import { MapPin } from 'lucide-react';

export const WorkModeBadge: React.FC<{ mode: string }> = ({ mode }) => {
    const styles: Record<string, string> = {
        REMOTE: 'bg-purple-100 text-purple-800',
        ONSITE: 'bg-orange-100 text-orange-800',
        HYBRID: 'bg-cyan-100 text-cyan-800',
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[mode] || 'bg-gray-100 text-gray-800'}`}>
            <MapPin className="w-3 h-3 mr-1" />
            {mode}
        </span>
    );
};