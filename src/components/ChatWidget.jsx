import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  User,
  ChevronDown,
  Minimize2,
  Maximize2,
  Paperclip,
  Loader2,
} from "lucide-react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

const FIXONIC_SYSTEM_PROMPT = `You are the Fixonic support assistant. Fixonic is a device repair and services platform (mobile, laptop, tablet repairs, accessories store).

Keep replies short (2-4 sentences), friendly, and in the same language the user writes (Urdu/Roman Urdu or English).
Only answer about: booking repairs, pricing, becoming a vendor/technician, accessories store, orders, contact support, or general Fixonic info. If asked something off-topic, politely bring the user back to Fixonic services.
Do not make up prices or URLs. Say "check the Services page" or "contact us" when needed.`;

const getFallbackReply = (userText) => {
  const t = userText.toLowerCase().trim();
  if (/\b(hi|hello|hey|salam)\b/.test(t)) return "Hello! Welcome to Fixonic. How can I help you today?";
  if (/\b(thank|thanks|bye)\b/.test(t)) return "You're welcome! Have a great day.";
  return "I can help with repairs, booking, pricing, vendors, or accessories. What do you need?";
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can we help you today?",
      sender: "support",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const fetchGroqReply = async (userMsg, conversationHistory) => {
    const apiKey = groqApiKey.trim();
    if (!apiKey) return null;

    const messagesForApi = [
      { role: "system", content: FIXONIC_SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: userMsg },
    ];

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messagesForApi,
          max_tokens: 256,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("Groq API error:", err);
        return null;
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      return reply || null;
    } catch (err) {
      console.warn("Groq fetch error:", err);
      return null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    const userMessageData = {
      id: Date.now(),
      text: userMsg,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessageData]);
    setMessage("");
    setLoading(true);

    const conversationHistory = messages.filter(
      (m) => m.sender === "user" || m.sender === "support"
    );

    const reply =
      (await fetchGroqReply(userMsg, conversationHistory)) ||
      getFallbackReply(userMsg);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: reply,
        sender: "support",
        timestamp: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end selection:bg-lime-500/30">
      {/* Chat Window */}
      <div
        className={`
          transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] origin-bottom-right
          mb-4 w-[calc(100vw-2rem)] max-w-[400px] sm:max-w-[500px]
          ${isExpanded ? "sm:w-[500px] w-[calc(100vw-2rem)]" : "sm:w-[400px]"}
          bg-white/95 sm:bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-4 pointer-events-none absolute bottom-0 right-0"
          }
        `}
      >
        {/* Header */}
        <div className="bg-navy-500 p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <User className="w-5 h-5 text-lime-400" />
              </div>
              <span
                className="absolute bottom-0 right-0 w-3 h-3 border-2 border-navy-500 rounded-full bg-green-500"
              ></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">
                Support Team
              </h3>
              <p className="text-navy-200 text-xs flex items-center gap-1">
                We are online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-navy-200 relative z-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`${
          isExpanded ? "h-[70vh] sm:h-[500px]" : "h-[50vh] sm:h-[400px] min-h-[280px]"
        } overflow-y-auto p-3 sm:p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white/50 transition-all duration-300`}>
          <div className="text-center text-xs text-gray-400 my-4 flex items-center justify-center gap-2 before:h-px before:w-12 before:bg-gray-200 after:h-px after:w-12 after:bg-gray-200">
            Today
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`
                  max-w-[80%] p-3.5 rounded-2xl text-sm relative shadow-sm
                  ${
                    msg.sender === "user"
                      ? "bg-navy-500 text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }
                `}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[10px] mt-1 block w-full text-right ${
                    msg.sender === "user" ? "text-navy-200" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3.5 rounded-2xl rounded-tl-none bg-white text-gray-500 border border-gray-100 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span className="text-sm">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 border-t border-gray-100 backdrop-blur-sm">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-full border border-gray-200 focus-within:border-navy-500 focus-within:ring-1 focus-within:ring-navy-500/20 transition-all shadow-inner"
          >
            <button
              type="button"
              className="p-2.5 text-gray-400 hover:text-navy-500 hover:bg-white rounded-full transition-all"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 min-w-0"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`
                p-2.5 rounded-full flex items-center justify-center transition-all duration-200
                ${
                  message.trim()
                    ? "bg-lime-500 text-navy-900 shadow-md shadow-lime-500/20 hover:bg-lime-400 transform hover:scale-105 active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
              Powered by{" "}
              <span className="font-bold text-navy-500">Fixonic AI</span>
              {groqApiKey && (
                <>
                  {" · "}
                  <span className="text-gray-400">Groq</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
          className={`
          group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl shadow-navy-500/30 transition-all duration-300 z-50 overflow-hidden
          ${
            isOpen
              ? "bg-navy-400 rotate-90"
              : "bg-navy-500 hover:bg-navy-600 hover:scale-110 rotate-0"
          }
        `}
      >
        <span
          className={`absolute inset-0 bg-lime-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center`}
        ></span>

        {isOpen ? (
          <ChevronDown className="w-7 h-7 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
