"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { Portal } from "@/components/common/Portal";

export const InfoTooltip = ({
  ip,
  userAgent,
}: {
  ip?: string | null;
  userAgent?: string | null;
}) => {
  const [hover, setHover] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const showTooltip = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY + 8,
    });
    setHover(true);
  };

  return (
    <>
      <div
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={() => setHover(false)}
      >
        <Info className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
      </div>

      {hover && (
        <Portal>
          <div
            style={{
              top: coords.y,
              left: coords.x,
              transform: "translateX(-50%)",
            }}
            className="absolute z-[9999] w-72 bg-white shadow-lg rounded-lg border border-gray-200 p-3 animate-fade"
          >
            <div className="text-sm text-gray-800 space-y-2">
              <div>
                <span className="font-medium">IP Address:</span>
                <div className="text-gray-600 break-all">{ip || "Unavailable"}</div>
              </div>

              <div>
                <span className="font-medium">User Agent:</span>
                <div className="text-gray-600 break-all max-h-32 overflow-auto text-xs">
                  {userAgent || "Unavailable"}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};
