import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { endpoints } from "../utils/axios";
import axiosInstance from "../utils/axios";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
}

const EnhancedChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [suggestedQuestions] = useState([
    "How can I improve my grades?",
    "tell me about an historical story.",
    "what is the meaning of this word or sentence?",
    "Can you explain this topic?",
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToBottom(), [messages, loading]);

  const handleSend = async (suggestedText?: string) => {
    const messageText = suggestedText || input;
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    // update local state immediately
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare payload with new + previous messages
      const payload = {
        messages: [
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: "user", content: messageText },
        ],
      };

      // Make the API call
      const { data } = await axiosInstance.post(
        endpoints.chatbot.send,
        payload 
      );

      // change this based on the chatbot model used on the backend
      if (data && data.choices) {
        const botMessage: Message = {
          id: Date.now() + 1,
          role: "bot",
          content: data.choices[0].message.content,
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error("Chatbot API error:", err);
      // Optional: show fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content:
            "Sorry, I’m having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="">
      {/* Main container */}
      <div className="max-w-dvw mx-auto h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-4 md:p-6 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <FaRobot className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                Study Assistant
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                AI-powered learning companion
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <motion.button
              onClick={clearChat}
              className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Chat
            </motion.button>
          )}
        </motion.div>

        {/* Chat container */}
        <motion.div
          className="flex-1 overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Messages area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white to-blue-50/30"
          >
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 md:py-12 h-full flex flex-col justify-center items-center"
              >
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                  Welcome!{" "}
                  <motion.span
                    animate={{ rotate: [0, 14, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👋
                  </motion.span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-md md:max-w-2xl mx-auto leading-relaxed">
                  I'm your AI-powered study companion, ready to help you excel
                  in your academic journey.
                </p>

                {/* Suggested questions grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="p-3 md:p-4 bg-white text-gray-700 rounded-xl text-sm md:text-base font-medium hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ${
                      msg.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <motion.div
                      className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                          : "bg-gradient-to-r from-gray-100 to-gray-200"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {msg.role === "user" ? (
                        <FaUser className="text-white w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <FaRobot className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </motion.div>

                    <motion.div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md"
                          : "bg-white border border-gray-200 rounded-bl-md text-gray-800"
                      }`}
                    >
                      <div className="prose prose-sm md:prose-base max-w-none leading-relaxed whitespace-pre-wrap">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-[80%] md:max-w-[70%]">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 shadow">
                      <FaRobot className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl shadow-sm bg-white border border-gray-200">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="p-4 md:p-6 bg-white ">
            <div className="flex flex-col space-y-3 md:space-y-4">
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 2).map((question, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 rounded-xl bg-gray-50 border border-gray-400 px-4 py-3 md:px-5 md:py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                />
                <motion.button
                  disabled={loading || !input.trim()}
                  onClick={() => handleSend()}
                  className={`flex items-center justify-center px-4 py-3 md:px-6 md:py-4 rounded-xl font-medium shadow-sm transition-all duration-200 ${
                    loading || !input.trim()
                      ? "bg-gray-300 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                  }`}
                  whileHover={
                    !(loading || !input.trim()) ? { scale: 1.05 } : {}
                  }
                  whileTap={!(loading || !input.trim()) ? { scale: 0.95 } : {}}
                >
                  <FaPaperPlane className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedChatbot;
