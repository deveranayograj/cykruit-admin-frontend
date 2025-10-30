"use client";
import { NavItem } from "@/components/admin/Sidebar";
import { ChevronRight } from "lucide-react";

export const SidebarItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}> = ({ item, isActive, isExpanded, onToggle, onNavigate, currentPath }) => {
  const hasChildren = item.children && item.children.length > 0;

  const isChildActive = (childPath: string) =>
    currentPath === childPath || currentPath.startsWith(childPath + "?");

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            onToggle();
          } else {
            onNavigate(item.path);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
          isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={isActive ? "text-blue-700" : "text-gray-500"}>
            {item.icon}
          </div>
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.badge !== undefined && item.badge > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
        </div>
      </button>

      {hasChildren && isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child, index) => (
            <button
              key={index}
              onClick={() => onNavigate(child.path)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                isChildActive(child.path)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {child.icon ? (
                  <div className="text-gray-500">{child.icon}</div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                )}
                <span>{child.label}</span>
              </div>
              {child.badge !== undefined && child.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {child.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
