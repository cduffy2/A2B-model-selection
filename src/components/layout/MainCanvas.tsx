import type { ReactNode } from "react";
import { LayoutPanelLeft, Bell } from "lucide-react";

function GhostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3C7.58 3 4 6.58 4 11v7.5a1 1 0 0 0 1.7.7l1.55-1.55 1.55 1.55a1 1 0 0 0 1.4 0L12 17.4l1.8 1.8a1 1 0 0 0 1.4 0l1.55-1.55 1.55 1.55a1 1 0 0 0 1.7-.7V11c0-4.42-3.58-8-8-8Z"
        stroke="#737373"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11" r="1" fill="#737373" />
      <circle cx="14.5" cy="11" r="1" fill="#737373" />
    </svg>
  );
}

export function MainCanvas({ children }: { children?: ReactNode }) {
  return (
    <main className="relative flex h-screen flex-1 flex-col bg-[#f9fbfb]">
      <header className="absolute right-0 top-0 flex items-start gap-6 px-8 py-6">
        <button className="text-[#737373] hover:text-[#1a1a1a]" aria-label="Assistant">
          <GhostIcon />
        </button>
        <div className="flex flex-col items-center gap-6">
          <button className="text-[#737373] hover:text-[#1a1a1a]" aria-label="Layout">
            <LayoutPanelLeft className="h-5 w-5" />
          </button>
          <button className="text-[#737373] hover:text-[#1a1a1a]" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-6">{children}</div>
    </main>
  );
}
