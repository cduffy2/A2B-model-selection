import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";
import paperclipIcon from "@/assets/Paperclip.png";
import magicWandIcon from "@/assets/MagicWand.png";
import microphoneIcon from "@/assets/Microphone.png";
import shieldCheckIcon from "@/assets/ShieldCheck.png";
import cpuIcon from "@/assets/Model selection/Cpu.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETING_RE = /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i;
const THANKS_RE = /\b(thanks|thank you|cheers|appreciate it)\b/i;
const HOW_ARE_YOU_RE = /how('s| is| are)? (it going|you doing|you|things)/i;

function pick(options: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return options[hash % options.length];
}

function reply(userText: string): string {
  const text = userText.trim();
  const lower = text.toLowerCase();

  if (GREETING_RE.test(lower)) {
    return pick(
      [
        "Hey! What are you working on today?",
        "Hi there — what can I help you figure out?",
        "Hello! What's on your mind?",
      ],
      text,
    );
  }

  if (HOW_ARE_YOU_RE.test(lower)) {
    return pick(
      [
        "Running smoothly, thanks for asking. What can I help with?",
        "All good on my end — what are you looking to do?",
      ],
      text,
    );
  }

  if (THANKS_RE.test(lower)) {
    return pick(["Anytime!", "Happy to help.", "Of course — let me know if anything else comes up."], text);
  }

  if (text.endsWith("?")) {
    return pick(
      [
        `Good question. Based on "${text}", here's a quick take: it depends on the specifics, but the short version is it's usually worth testing a couple of approaches before committing.`,
        `That's a fair thing to ask. On "${text}" — I'd start simple, see what breaks, then iterate from there.`,
        `Let me think through that. For "${text}", the main trade-off is speed versus reliability — most teams lean toward reliability first.`,
      ],
      text,
    );
  }

  if (text.split(/\s+/).length <= 3) {
    return pick(
      [
        `Got it — "${text}". Want me to expand on that or take a specific angle?`,
        `Noted: "${text}". Anything specific you'd like me to focus on?`,
      ],
      text,
    );
  }

  return pick(
    [
      `Here's how I'd think about it: "${text.slice(0, 60)}${text.length > 60 ? "…" : ""}" breaks down into a few parts. The core idea seems solid — the main thing I'd flag is making sure the details hold up once you dig in.`,
      `Interesting — reading through what you sent, the key point seems to be around ${lower.split(/\s+/).slice(0, 4).join(" ")}. I'd suggest breaking it into smaller steps and validating each one.`,
      `Thanks for the context. Based on that, I'd approach it in stages: clarify the goal, sketch a rough plan, then refine as you learn more.`,
    ],
    text,
  );
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

    const fullReply = reply(text);
    const assistantId = crypto.randomUUID();
    const thinkingDelay = 400 + Math.random() * 500;

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const words = fullReply.split(" ");
      let count = 0;
      const stream = window.setInterval(() => {
        count += 1;
        const partial = words.slice(0, count).join(" ");
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: partial } : m)),
        );
        if (count >= words.length) window.clearInterval(stream);
      }, 35);
    }, thinkingDelay);
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
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="font-title text-[39px] font-bold leading-[44px] tracking-[-0.78px] text-[#3d3d3d]">
            Good morning, John
          </h1>
          <div className="flex w-full flex-col items-center gap-4">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={send}
              onKeyDown={onKeyDown}
              textareaRef={textareaRef}
            />
            <Reassurance />
          </div>
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
    <div className="flex h-[120px] w-full flex-col justify-between rounded-lg bg-white pb-2 pl-3 pr-2 pt-3 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask anything"
        rows={1}
        className="h-[23px] w-full resize-none bg-transparent text-[16px] leading-6 text-[#3d3d3d] placeholder:text-[#a6a6a6] focus:outline-none"
      />
      <div className="flex w-full items-center justify-between">
        <ModelSelect />
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Attach file">
            <img src={paperclipIcon} alt="" className="size-6" />
          </button>
          <button type="button" aria-label="Improve prompt">
            <img src={magicWandIcon} alt="" className="size-6" />
          </button>
          <button type="button" aria-label="Voice input">
            <img src={microphoneIcon} alt="" className="size-6" />
          </button>
          <button
            onClick={onSend}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex size-8 items-center justify-center rounded bg-[#1c4c42] text-white shadow-[0px_4px_10px_0px_rgba(28,76,66,0.24),0px_4px_8px_0px_rgba(0,0,0,0.16)] transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const SPECIFIC_MODELS = [
  { name: "GLM 5.2", description: "Complex reasoning and coding", price: "€€" },
  { name: "GLM 5.1", description: "Writing and coding", price: "€€€" },
  { name: "Qwen 3.6 27B", description: "Coding and vision", price: "€€" },
  { name: "Mistral Small 4", description: "Fast, everyday tasks", price: "€" },
  { name: "DeepSeek V4 Flash", description: "Fast coding tasks", price: "€€€" },
  { name: "Llama 5 90B", description: "General purpose reasoning", price: "€€" },
  { name: "Command R2", description: "Retrieval and long context", price: "€€€" },
];

function ModelSelect() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "specific">("root");
  const [model, setModel] = useState("Auto");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) setView("root");
  }, [open]);

  const selectModel = (name: string) => {
    setModel(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-[#ebebeb] bg-white px-3 py-2 hover:bg-[#ebebeb]"
      >
        <img src={cpuIcon} alt="" className="size-4" />
        <span className="text-xs font-medium text-[#737373]">Model:</span>
        <span className="text-xs font-semibold text-[#1c4c42]">{model}</span>
        <ChevronDown className="size-3 text-[#1c4c42]" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute bottom-full left-0 mb-2 overflow-clip rounded-xl border border-[#e5e7eb] bg-white shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.3)]",
            "w-[375px]",
          )}
        >
          {view === "root" ? (
            <>
              <button
                type="button"
                onClick={() => selectModel("Auto")}
                className="flex w-full flex-col items-start gap-1 bg-[#daf1ed] p-2 text-left hover:bg-[#cdeae4]"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] font-semibold leading-[18px] text-[#3d3d3d]">
                      Auto
                    </span>
                    <span className="text-[11px] leading-[15px] text-[#737373]">Recommended</span>
                  </div>
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#2c796b]">
                    <Check className="size-3 text-white" />
                  </span>
                </div>
                <p className="text-[12px] leading-[18px] text-[#737373]">
                  Fuses the world's leading open-source models, picking the best one for each
                  prompt, saving energy and money in the process.
                </p>
                <div className="flex items-center gap-1">
                  {["Gemma 4", "GLM 5", "Kimi K3"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgba(28,76,66,0.2)] bg-white px-2.5 py-0.5 text-[12px] leading-none text-[#1c4c42]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <Leaf className="size-4 text-[#2c796b]" />
                    <span className="text-[11px] font-semibold leading-[15px] text-[#2c796b]">
                      Lowest energy
                    </span>
                    <span className="text-[14px] font-semibold leading-[18px] text-[#2c796b]">·</span>
                    <span className="text-[11px] font-semibold leading-[15px] text-[#2c796b]">
                      Just as capable
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold leading-[18px] text-[#2c796b]">€</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setView("specific")}
                className="flex w-full flex-col items-start gap-1 border-b border-[#ebebeb] bg-white px-3 py-1 text-left hover:bg-[#f2f2f2]"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[14px] font-semibold leading-[18px] text-[#3d3d3d]">
                    Choose a specific model
                  </span>
                  <ChevronRight className="size-4 text-[#3d3d3d]" />
                </div>
                <div className="flex w-full items-start justify-between gap-2">
                  <span className="text-[12px] leading-[18px] text-[#737373]">
                    7 models · usually more energy than Auto
                  </span>
                  <span className="shrink-0 text-[14px] font-semibold leading-[18px] text-[#2c796b]">
                    €€
                  </span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setView("root")}
                className="flex w-full items-center gap-1 border-b border-[rgba(61,61,61,0.2)] bg-white py-1 pl-2 pr-3 text-left hover:bg-[#f2f2f2]"
              >
                <ChevronLeft className="size-4 text-[#3d3d3d]" />
                <span className="text-[14px] font-semibold leading-[18px] text-[#3d3d3d]">Back</span>
              </button>

              <div className="thin-scrollbar max-h-[270px] w-full overflow-y-auto">
                {SPECIFIC_MODELS.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => selectModel(m.name)}
                    className="flex w-full flex-col items-start gap-1 border-b border-[#ebebeb] bg-white px-3 py-1 text-left hover:bg-[#f2f2f2]"
                  >
                    <span className="w-full text-[14px] font-semibold leading-[18px] text-[#3d3d3d]">
                      {m.name}
                    </span>
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-[12px] leading-[18px] text-[#737373]">
                        {m.description}
                      </span>
                      <span className="shrink-0 text-[14px] font-semibold leading-[18px] text-[#2c796b]">
                        {m.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex w-full items-center gap-2 bg-[#ebebeb] px-4 py-1 text-[12px] leading-[18px] text-[#3d3d3d]">
            <span className="font-semibold">🇪🇺</span>
            <span>All models hosted in Europe</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Reassurance() {
  return (
    <div className="flex items-center gap-2">
      <img src={shieldCheckIcon} alt="" className="size-5" />
      <span className="text-sm leading-[22px] text-[#737373]">End-to-end encrypted</span>
      <span className="text-sm leading-[22px] text-[#737373]">·</span>
      <span className="text-sm leading-[22px] text-[#737373]">Data stays in Europe</span>
      <span className="text-sm leading-[22px] text-[#737373]">·</span>
      <span className="text-sm leading-[22px] text-[#737373]">Never used to train models</span>
    </div>
  );
}
