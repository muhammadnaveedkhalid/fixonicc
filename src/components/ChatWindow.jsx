import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send, User, MoreVertical } from "lucide-react";
import { useAuth } from "../context/AuthContextHooks";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const SOCKET_URL = API_BASE ? API_BASE.replace("/api", "") : "";
const socket = SOCKET_URL ? io(SOCKET_URL) : null;

const ChatWindow = ({ repairId, customerId, vendorId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;
    // Join room
    socket.emit("join_room", repairId);

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/${repairId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      // socket.emit("leave_room", repairId); // Optional if needed
    };
  }, [repairId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      repairId,
      room: repairId,
      senderId: { _id: user._id, name: user.name, role: user.role }, // Optimistic update structure
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Emit to socket (for others)
    if (socket) {
      socket.emit("send_message", messageData);
    }
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    // Save to DB
    try {
      if (API_BASE) {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ repairId, message: messageData.message })
        });
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold border border-lime-200">
            {/* Logic to show other person's initial */}
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-navy-900 text-sm">Repair Chat</h3>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              #{repairId}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
            <p className="text-[10px]">Start the conversation...</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm font-medium ${isMe
                  ? "bg-navy-900 text-white rounded-tr-none"
                  : "bg-white text-navy-900 border border-gray-100 rounded-tl-none"
                  }`}
              >
                {!isMe && (
                  <div className="text-[10px] font-black opacity-50 mb-1 uppercase tracking-wider">
                    {msg.senderId?.name || 'User'}
                  </div>
                )}
                <p>{msg.message}</p>
                <div className={`text-[9px] mt-2 font-bold uppercase tracking-wider opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none transition-all font-bold text-navy-900 placeholder:text-gray-400 text-sm"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-navy-900 text-white rounded-xl shadow-lg shadow-navy-900/20 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
