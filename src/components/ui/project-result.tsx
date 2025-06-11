import { GitFork, BookmarkIcon as BookmarkSimple } from "lucide-react";
import TooltipWrapper from "./tooltip-wrapper";

interface ProjectResultProps {
  name: string;
  id?: number;
  forkCount?: number;
  openIssues?: number;
  watchers?: number;
  onSave?: () => void;
  username?: string;
}

export default function ProjectResult({
  name,
  forkCount,
  openIssues,
  watchers,
  onSave,
  id,
  username,
}: ProjectResultProps) {
  return (
    <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between transition-colors hover:bg-[#f5f6fa] group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="text-[#121416] flex items-center justify-center rounded-lg bg-[#f1f2f4] shrink-0 size-10 transition-colors group-hover:bg-[#e4e6eb]">
          <GitFork size={24} />
        </div>
        <p className="text-[#121416] text-base font-normal leading-normal flex-1 truncate">
          {username ? `${username} / ${name}` : name}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <TooltipWrapper content={`${forkCount} forks`}>
          <span className="inline-flex items-center mr-3 text-sm text-gray-500">
            <GitFork size={16} className="mr-1" />
            {forkCount}
          </span>
        </TooltipWrapper>
        <TooltipWrapper content={`${openIssues} open issues`}>
          <span className="inline-flex items-center mr-3 text-sm text-gray-500">
            <svg
              className="mr-1"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1" />
            </svg>
            {openIssues}
          </span>
        </TooltipWrapper>
        <TooltipWrapper content={`${watchers} watchers`}>
          <span className="inline-flex items-center mr-3 text-sm text-gray-500">
            <svg
              className="mr-1"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {watchers}
          </span>
        </TooltipWrapper>
        <div
          className="text-[#121416] flex size-7 items-center justify-center transition-colors group-hover:text-[#6366f1]"
          onClick={onSave}
        >
          <BookmarkSimple
            size={24}
            fill={id ? "#facc15" : "none"}
            color={id ? "#facc15" : "currentColor"}
            className="text-gray-400 group-hover:text-yellow-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
