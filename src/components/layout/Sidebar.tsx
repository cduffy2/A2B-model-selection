import {
  Bookmark,
  PanelLeft,
  Plus,
  Search,
  Users,
  MoreHorizontal,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import logo from "@/assets/Logo.png";

interface AssistantItem {
  id: string;
  name: string;
  avatarClassName: string;
}

interface ChatItem {
  id: string;
  title: string;
  avatarClassName?: string;
}

const pinnedAssistants: AssistantItem[] = [
  { id: "design", name: "Design assistent", avatarClassName: "bg-gradient-to-br from-violet-300 to-rose-400" },
  { id: "webflow", name: "Webflow assistent", avatarClassName: "bg-gradient-to-br from-amber-700 to-stone-900" },
];

const recentChats: ChatItem[] = [
  { id: "1", title: "What movie fits into 2 ho…" },
  { id: "2", title: "How to use Webflow …", avatarClassName: "bg-gradient-to-br from-amber-700 to-stone-900" },
  { id: "3", title: "What movie fits into 2 ho…" },
  { id: "4", title: "Warsaw what to see" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#ebebeb] bg-white px-3 py-3 text-[#1a1a1a]">
      <div className="flex items-center justify-between px-1 py-1">
        <img src={logo} alt="aim2balance.ai" className="h-[26px] w-auto" />
        <div className="flex items-center gap-1 text-[#6b6b6b]">
          <button className="rounded-md p-1.5 hover:bg-[#f2f2f2]" aria-label="Bookmarks">
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-[#f2f2f2]" aria-label="Toggle sidebar">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E8464] text-white">
            <Plus className="h-3.5 w-3.5" />
          </span>
          New chat
        </button>
        <button className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]">
          <Search className="h-[18px] w-[18px] text-[#6b6b6b]" />
          Search in chats
        </button>
        <button className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]">
          <Users className="h-[18px] w-[18px] text-[#6b6b6b]" />
          Assistents
        </button>
      </nav>

      <div className="mt-6">
        <div className="px-2 pb-2 text-[11px] font-medium text-[#9a9a9a]">Pinned assistents</div>
        <div className="flex flex-col gap-0.5">
          {pinnedAssistants.map((a) => (
            <button
              key={a.id}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]"
            >
              <span className={cn("h-6 w-6 shrink-0 rounded-full", a.avatarClassName)} />
              {a.name}
            </button>
          ))}
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#6b6b6b]">
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </span>
            All assistents
          </button>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-hidden">
        <div className="px-2 pb-2 text-[11px] font-medium text-[#9a9a9a]">Recent chats</div>
        <div className="flex flex-col gap-0.5">
          {recentChats.map((c) => (
            <button
              key={c.id}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]"
            >
              {c.avatarClassName ? (
                <span className={cn("h-6 w-6 shrink-0 rounded-full", c.avatarClassName)} />
              ) : (
                <span className="w-6 shrink-0" />
              )}
              <span className="truncate">{c.title}</span>
            </button>
          ))}
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f2f2f2]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#6b6b6b]">
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </span>
            All chats
          </button>
        </div>
      </div>

      <div className="mt-2 border-t border-[#ebebeb] pt-3">
        <button className="flex w-full items-center justify-between px-2 text-left">
          <span className="text-[15px] font-semibold text-[#1a1a1a]">€ 23.07</span>
          <span className="text-[13px] text-[#9a9a9a]">remaining</span>
          <ArrowRight className="h-4 w-4 text-[#1a1a1a]" />
        </button>
        <div className="mx-2 mt-2 h-1.5 overflow-hidden rounded-full bg-[#e4efec]">
          <div className="h-full w-[70%] rounded-full bg-[#0E8464]" />
        </div>

        <button className="mt-3 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-[#f2f2f2]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1465AD] text-[12px] font-medium text-white">
            JE
          </span>
          <span className="text-[14px] text-[#1a1a1a]">John Example</span>
        </button>

        <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-[#6b6b6b] hover:bg-[#f2f2f2]">
          <MessageSquare className="h-4 w-4" />
          How can we improve?
        </button>
      </div>
    </aside>
  );
}
