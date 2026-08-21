import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { KeyboardEvent, TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/utils";
import { useTheme } from '@/theme/AppThemeProvider';
import {
  Bot,
  LoaderIcon,
  Paperclip,
  SendIcon,
  User,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import MarkdownPreview from "../markdown/markdown";
import { debounce } from "../../utils/performance";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = debounce(() => adjustHeight(), 120);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-violet-500/30 ring-offset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export type AnimatedChatMessage = {
  id: number;
  role: "user" | "bot";
  content: string;
};

interface AnimatedAIChatProps {
  onSendMessage?: (prompt: string, history: AnimatedChatMessage[]) => Promise<string>;
}

export function AnimatedAIChat({ onSendMessage }: AnimatedAIChatProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AnimatedChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [inputFocused, setInputFocused] = useState(false);
  const requestInFlightRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const getBotResponse = useCallback(
    async (prompt: string, history: AnimatedChatMessage[]) => {
      if (onSendMessage) {
        return onSendMessage(prompt, history);
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 1200);
      });
      return "I received your message. Connect this component with your chatbot API using the onSendMessage prop.";
    },
    [onSendMessage],
  );

  const handleSendMessage = useCallback(async () => {
    const prompt = value.trim();
    if (!prompt || requestInFlightRef.current || isTyping || isPending) {
      return;
    }

    const userMessage: AnimatedChatMessage = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setValue("");
    setAttachments([]);
    adjustHeight(true);

    requestInFlightRef.current = true;
    setIsTyping(true);

    startTransition(() => {
      setIsTyping(true);
    });

    try {
      const botText = await getBotResponse(prompt, nextHistory);
      const botMessage: AnimatedChatMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: botText?.trim() || "Sorry, I could not generate a response right now.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content: "Sorry, I am having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
      requestInFlightRef.current = false;
    }
  }, [adjustHeight, getBotResponse, isPending, isTyping, messages, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isTyping || isPending || requestInFlightRef.current) {
        return;
      }
      void handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    if (isTyping || isPending || requestInFlightRef.current) {
      return;
    }
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    if (isTyping || isPending || requestInFlightRef.current) {
      return;
    }
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendingLocked = isTyping || isPending || requestInFlightRef.current;

  return (
    <div
      className={cn(
        "lab-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6",
        isDark ? "bg-transparent text-white" : "bg-slate-100 text-slate-900",
      )}
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div
          className={cn(
            "absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full blur-[128px]",
            isDark ? "bg-violet-500/10" : "bg-indigo-400/25",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full blur-[128px] delay-700",
            isDark ? "bg-indigo-500/10" : "bg-sky-400/20",
          )}
        />
        <div
          className={cn(
            "absolute right-1/3 top-1/4 h-64 w-64 animate-pulse rounded-full blur-[96px] delay-1000",
            isDark ? "bg-fuchsia-500/10" : "bg-cyan-300/20",
          )}
        />
      </div>

      <div className="relative  w-full scrollbar-hide ">
        <motion.div
          className="relative z-10 space-y-8 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block scrollbar-hide"
            >
              <h1
                className={cn(
                  "bg-clip-text pb-1 text-3xl font-medium tracking-tight text-transparent",
                  isDark ? "bg-linear-to-r from-white/90 to-white/40" : "bg-linear-to-r from-slate-900 to-indigo-700",
                )}
              >
                How can I help today?
              </h1>
              <motion.div
                className={cn(
                  "h-px bg-linear-to-r from-transparent to-transparent",
                  isDark ? "via-white/20" : "via-indigo-300/80",
                )}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p
              className={cn("text-sm", isDark ? "text-white/40" : "text-slate-600")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Type a message to start chatting
            </motion.p>
          </div>

          <motion.div
            className={cn(
              "relative rounded-2xl shadow-2xl backdrop-blur-2xl scrollbar-hide",
              isDark ? "border border-white/5 bg-white/2" : "border border-slate-200 bg-white/80",
            )}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="max-h-[45vh] min-h-30 space-y-3 overflow-y-auto px-4 pt-4 scrollbar-hide">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={cn("flex items-end gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.role === "bot" && (
                      <div
                        className={cn(
                          "rounded-full border p-1.5",
                          isDark ? "border-white/10 bg-white/5 text-white/70" : "border-slate-300 bg-white text-slate-700",
                        )}
                      >
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md backdrop-blur-sm",
                        msg.role === "user"
                          ? isDark
                            ? "rounded-br-md bg-slate-800/80 text-white shadow-indigo-950/40"
                            : "rounded-br-md border border-slate-200 bg-transparent text-slate-900 shadow-slate-200/60"
                          : isDark
                            ? "rounded-bl-md border border-slate-700 bg-slate-900/70 text-slate-100 pl-4 shadow-black/30"
                            : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-800 pl-4 shadow-slate-200/60",
                      )}
                    >
                      {msg.role === "bot" && (
                        <span
                          className={cn(
                            "absolute left-2 top-3 bottom-3 w-0.5 rounded-full",
                            isDark ? "bg-cyan-400/40" : "bg-indigo-400/40",
                          )}
                        />
                      )}
                      <MarkdownPreview content={msg.content} />
                    </div>

                    {msg.role === "user" && (
                      <div
                        className={cn(
                          "rounded-full border p-1.5",
                          isDark ? "border-white/10 bg-white/10 text-white/80" : "border-slate-900 bg-slate-900 text-white",
                        )}
                      >
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs text-white/60"
                >
                  <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
                  Bot is thinking...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  if (sendingLocked) {
                    return;
                  }
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={sendingLocked ? "Wait for bot response..." : "Type your message..."}
                containerClassName="w-full"
                className={cn(
                  "min-h-15 w-full resize-none px-4 py-3",
                  "border-none bg-transparent text-sm",
                  isDark ? "text-white/90 placeholder:text-white/20" : "text-slate-800 placeholder:text-slate-400",
                  "focus:outline-none",
                )}
                style={{ overflow: "hidden" }}
                showRing={false}
                disabled={sendingLocked}
              />
            </div>

            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 px-4 pb-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={file}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs",
                        isDark ? "bg-white/3 text-white/70" : "bg-slate-200 text-slate-700",
                      )}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <span>{file}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        disabled={sendingLocked}
                        className="text-white/40 transition-colors hover:text-white disabled:opacity-50"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn("flex items-center justify-between gap-4 border-t p-4", isDark ? "border-white/5" : "border-slate-200")}>
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={handleAttachFile}
                  whileTap={{ scale: 0.94 }}
                  disabled={sendingLocked}
                  className={cn(
                    "group relative rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    isDark ? "text-white/40 hover:text-white/90" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  <Paperclip className="h-4 w-4" />
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={() => {
                  void handleSendMessage();
                }}
                whileHover={{ scale: value.trim() && !sendingLocked ? 1.01 : 1 }}
                whileTap={{ scale: value.trim() && !sendingLocked ? 0.98 : 1 }}
                disabled={sendingLocked || !value.trim()}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  value.trim() && !sendingLocked
                    ? isDark
                      ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                      : "bg-slate-900 text-white shadow-lg shadow-slate-300/60"
                    : isDark
                      ? "bg-white/5 text-white/40"
                      : "bg-slate-200 text-slate-500",
                )}
              >
                {sendingLocked ? (
                  <LoaderIcon className="h-4 w-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span>Send</span>
              </motion.button>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {inputFocused && (
        <motion.div
          className={cn(
            "pointer-events-none fixed z-0 h-200 w-200 rounded-full bg-linear-to-r blur-[96px]",
            isDark
              ? "from-violet-500 via-fuchsia-500 to-indigo-500 opacity-[0.02]"
              : "from-sky-300 via-indigo-300 to-cyan-300 opacity-20",
          )}
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  );
}

export default AnimatedAIChat;
