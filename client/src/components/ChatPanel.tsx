import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Message } from "@shared/schema";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isGenerating: boolean;
  editingSlide?: number;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isGenerating,
  editingSlide,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  const getPlaceholder = () => {
    if (editingSlide !== undefined) {
      return `Editing Slide ${editingSlide + 1}. Describe your changes...`;
    }
    return messages.length === 0
      ? "Message AI Slide Generator..."
      : "Send a message...";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-base font-semibold text-gray-900"
              data-testid="text-app-title"
            >
              AI Slide Generator
            </h1>
            <p className="text-xs text-gray-500">
              Create presentations instantly
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="gap-2 text-gray-600 hover:text-gray-900"
          data-testid="button-new-conversation"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to AI Slide Generator
            </h2>
            <p className="text-sm text-gray-600 max-w-md mb-8">
              Tell me what presentation you'd like to create, and I'll generate
              professional slides for you in seconds.
            </p>

            {/* Suggested Prompts */}
            <div className="space-y-2 w-full max-w-md">
              <p className="text-xs font-medium text-gray-500 text-left mb-3">
                TRY ASKING:
              </p>
              {[
                "Create a presentation about Artificial Intelligence",
                "Make slides on Digital Marketing strategies",
                "Generate a pitch deck for a startup",
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-gray-700 hover:text-gray-900"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            {messages
              .filter((m) => m && m.id)
              .map((message, index) => (
                <div
                  key={message.id}
                  className="flex gap-4"
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === "assistant" ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {message.role === "assistant" ? "AI Assistant" : "You"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap m-0">
                        {message.content}
                      </p>
                    </div>

                    {/* Divider after assistant messages except last one */}
                    {message.role === "assistant" &&
                      index < messages.length - 1 && (
                        <div className="h-px bg-gray-100 my-4" />
                      )}
                  </div>
                </div>
              ))}

            {/* Generating Indicator */}
            {isGenerating && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      AI Assistant
                    </span>
                    <span className="text-xs text-gray-400">Generating...</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white">
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder()}
                  className="resize-none pr-4 py-3 min-h-[52px] max-h-[200px] rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isGenerating}
                  data-testid="input-chat-message"
                  rows={1}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
                disabled={!input.trim() || isGenerating}
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-400 mt-3 text-center">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
