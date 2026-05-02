import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Terminal, Zap } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant" | "thinking";
  content: string;
};

const SAMPLE_MESSAGES: Message[] = [
  { id: 1, role: "user", content: "What files are in the calculator directory?" },
  {
    id: 2,
    role: "assistant",
    content:
      "I'll look into the calculator directory for you.\n\n**Found these files:**\n- `calculator.py` — main calculator logic\n- `test_calculator.py` — unit tests\n- `README.md` — documentation\n\nThe calculator supports add, subtract, multiply, and divide operations with proper operator precedence.",
  },
  { id: 3, role: "user", content: "Fix the operator precedence bug in calculator.py" },
  {
    id: 4,
    role: "assistant",
    content:
      "I found the bug. The `+` operator had precedence `3` instead of `1`, which caused `3 + 7 * 2` to evaluate as `20` instead of `17`.\n\n**Fixed:** Set addition precedence back to `1`. Running tests now...\n\n✅ All tests pass. The expression `3 + 7 * 2` now correctly returns `17`.",
  },
];

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    const thinkingMsg: Message = { id: Date.now() + 1, role: "thinking", content: "" };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1800));

    const reply: Message = {
      id: Date.now() + 2,
      role: "assistant",
      content: `I received your prompt: **"${text}"**\n\nIn a live deployment, I would send this to the \`POST /run\` API endpoint and stream back the agent's response here. The agent can read files, write code, and execute Python within its working directory.`,
    };
    setMessages((prev) => prev.filter((m) => m.role !== "thinking").concat(reply));
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f13] text-white font-['Inter']">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#0f0f13]/80 backdrop-blur-sm">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30">
          <Zap className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white leading-none">AI Code Agent</h1>
          <p className="text-xs text-white/40 mt-0.5">Powered by Gemini 2.5 Flash</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/40">Connected</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium">Ask the agent anything</p>
              <p className="text-white/40 text-sm mt-1">It can read, write, and run code in your project</p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.role === "thinking") {
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-white/40">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-xs">Agent is thinking…</span>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-white/60" />
                </div>
                <div className="bg-violet-600 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                  <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <MarkdownMessage content={msg.content} />
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-5">
        <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
          <Terminal className="w-4 h-4 text-white/30 flex-shrink-0 mb-1" />
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask the agent to read files, write code, run tests…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed min-h-[24px] max-h-[160px]"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-0.5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-center text-xs text-white/20 mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function MarkdownMessage({ content }: { content: string }) {
  const parts = content.split(/(\*\*.*?\*\*|`[^`]+`|\n)/g);
  return (
    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="bg-white/10 text-violet-300 text-xs px-1.5 py-0.5 rounded font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part === "\n") return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
