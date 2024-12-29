import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatbotApp.css";

const ChatbotApp = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI("AIzaSyAHE-0n6oXuTV1AnwNo6Esuj0RMrOlYhuo");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [chat] = useState(
    model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    })
  );

  const systemPrompt = `You are a movie and TV show expert. Maintain context of the conversation and reference previous messages when relevant.

  When discussing movies or TV shows:
  1. Remember the show/movie being discussed
  2. Provide relevant information based on the context
  3. Answer follow-up questions using the established context
  
  Format responses clearly and maintain conversation continuity.`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { type: "user", message: inputValue };
    setMessages((prev) => [...prev, userMessage]);

    const contextualPrompt = `${systemPrompt}\n\nPrevious conversation context:\n${conversationHistory.join("\n")}\n\nUser Question: ${inputValue}`;

    setInputValue("");
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(contextualPrompt);
      const response = await result.response;

      const botMessage = {
        type: "bot",
        message: response.text(),
      };

      const newConversationHistory = [
        ...conversationHistory,
        `User: ${inputValue}`,
        `Assistant: ${response.text()}`,
      ];
      setConversationHistory(newConversationHistory);

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        type: "bot",
        message: "I apologize for the inconvenience. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  return (
    <>
      <button
        className="chatbot-icon"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Toggle chat"
      >
        {/* 💬 */}🎬
      </button>

      {isChatOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h2 className="chatbot-title">FilmDB Assistant</h2>
            <button onClick={() => setIsChatOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="chat-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.type}-message`}
              >
                {msg.message}
              </div>
            ))}

            {isLoading && (
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about movies or TV shows..."
              aria-label="Chat input"
            />
            <button 
              type="submit" 
              className="chat-send-button"
              disabled={isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>

          <button className="chat-clear-button" onClick={clearChat} aria-label="Clear chat">
            Clear Chat
          </button>
        </div>
      )}
    </>
  );
};

export default ChatbotApp;
