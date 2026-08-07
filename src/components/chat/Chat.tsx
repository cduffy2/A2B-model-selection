import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function reply(userText: string): string {
  return `You said: "${userText}". This is a prototype response — no backend is wired up yet.`;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    window.setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply(text),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 400);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full w-full max-w-2xl flex-col">
      {!hasMessages ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <h1 className="text-2xl font-medium text-[#1a1a1a]">What can I help with?</h1>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={send}
            onKeyDown={onKeyDown}
            textareaRef={textareaRef}
          />
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto py-8">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                    m.role === "user"
                      ? "bg-[#0E8464] text-white"
                      : "bg-white text-[#1a1a1a] shadow-sm ring-1 ring-[#ebebeb]",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="pb-8">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={send}
              onKeyDown={onKeyDown}
              textareaRef={textareaRef}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}) {
  return (
    <div className="w-full rounded-2xl border border-[#ebebeb] bg-white p-3 shadow-sm">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Message aim2balance.ai…"
        rows={1}
        className="max-h-40 w-full resize-none bg-transparent px-2 py-1.5 text-[14px] text-[#1a1a1a] placeholder:text-[#9a9a9a] focus:outline-none"
      />
      <div className="flex items-center justify-end px-1 pt-1">
        <button
          onClick={onSend}
          disabled={!value.trim()}
          aria-label="Send message"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0E8464] text-white transition-opacity disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
