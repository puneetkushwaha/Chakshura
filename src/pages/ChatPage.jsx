import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ChatPage (single-file)
 * - API_KEY left unchanged
 * - Sends user input + strict Gemini formatting prompt (with \\n markers)
 * - Renders multi-line bot output using `white-space: pre-wrap`
 * - Modern UI, full-width chat (no sidebar)
 */

// NOTE: API key intentionally kept exactly as you provided.
const API_KEY = "AIzaSyAKIHGHOx-GUtFLzoVBIO1-C498g7_GqBw";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Chakra AI.", sender: "bot", time: new Date().toISOString() }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (msg) => setMessages(prev => [...prev, { ...msg, id: Date.now() }]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input.trim();
        addMessage({ text: userText, sender: "user", time: new Date().toISOString() });
        setInput("");
        setIsLoading(true);

        try {
            const resp = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: `${userText}

---------------------------
🔧 STRICT INSTRUCTION:
Write the response in clean human-readable sections using REAL line breaks.
Add \\n after every heading and after every bullet so formatting appears properly.

FORMAT EXACTLY LIKE THIS (including line breaks):

Title: <name>\\n

Summary:\\n
<2–4 line explanation>\\n

Category:\\n
• <category>\\n

Sub-category:\\n
• <sub-category>\\n

Sub-sub-category:\\n
• <sub-sub-category>\\n

Evolution Path:\\n
1. <milestone>\\n
2. <milestone>\\n
3. <milestone>\\n

Technologies Replaced:\\n
• <tech1>\\n
• <tech2>\\n

Future Scope (Next 10 Years):\\n
• <prediction1>\\n
• <prediction2>\\n
• <prediction3>\\n

Notes:\\n
<text or “None”>\\n

RULES:
• Use \\n after every line.
• Do NOT remove the blank lines.
• No markdown, no JSON, no code blocks.
---------------------------`
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
            addMessage({ text: botReply, sender: "bot", time: new Date().toISOString() });
        } catch (err) {
            addMessage({
                text: `⚠️ Error: ${err.message}`,
                sender: "bot",
                time: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Styling objects for clean inline styling (easy to paste)
    const styles = {
        page: {
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
                "linear-gradient(180deg, rgba(12,18,28,1) 0%, rgba(18,24,35,1) 40%, rgba(14,20,30,1) 100%)",
            color: "#E6EEF8",
            padding: 24,
            boxSizing: "border-box",
            fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        },
        container: {
            width: "920px",
            maxWidth: "100%",
            height: "86vh",
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(255,255,255,0.03)"
        },
        header: {
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            gap: 12
        },
        title: {
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.2
        },
        subtitle: {
            fontSize: 13,
            color: "rgba(230,238,248,0.7)",
            marginTop: 2
        },
        body: {
            display: "flex",
            flex: 1,
            overflow: "hidden"
        },
        chatArea: {
            flex: 1,
            padding: 20,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12
        },
        messageRow: (isUser) => ({
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            justifyContent: isUser ? "flex-end" : "flex-start",
            marginTop: 6
        }),
        avatar: (isUser) => ({
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isUser ? "linear-gradient(90deg,#1E90FF,#0ABDE3)" : "rgba(255,255,255,0.03)",
            color: isUser ? "#fff" : "#9FB1C8",
            flexShrink: 0
        }),
        bubble: (isUser) => ({
            maxWidth: "78%",
            padding: "12px 16px",
            borderRadius: 14,
            background: isUser ? "linear-gradient(90deg,#0a84ff,#0066ff)" : "rgba(255,255,255,0.02)",
            color: isUser ? "#fff" : "#D9EEF9",
            boxShadow: isUser ? "0 6px 20px rgba(10,132,255,0.12)" : "inset 0 1px 0 rgba(255,255,255,0.01)",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            fontSize: 14,
            border: "1px solid rgba(255,255,255,0.02)"
        }),
        meta: {
            marginTop: 6,
            fontSize: 12,
            color: "rgba(230,238,248,0.6)"
        },
        inputArea: {
            padding: 18,
            borderTop: "1px solid rgba(255,255,255,0.03)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: "linear-gradient(180deg, rgba(255,255,255,0.005), rgba(255,255,255,0.002))"
        },
        textarea: {
            flex: 1,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.04)",
            background: "transparent",
            color: "#E6EEF8",
            resize: "none",
            fontSize: 14,
            outline: "none",
            minHeight: 44,
            maxHeight: 140
        },
        sendBtn: {
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            background: isLoading ? "linear-gradient(90deg,#6fb1ff,#3aa8ff)" : "linear-gradient(90deg,#00C6FF,#0072FF)",
            boxShadow: "0 8px 20px rgba(0,114,255,0.18)",
            color: "#fff",
            transition: "transform .12s ease"
        },
        sendBtnDisabled: {
            opacity: 0.6,
            cursor: "not-allowed",
            transform: "none"
        },
        smallText: { fontSize: 12, color: "rgba(230,238,248,0.6)" },
        emptyState: { textAlign: "center", color: "rgba(230,238,248,0.55)", marginTop: 20 }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(90deg,#6EE7B7,#60A5FA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bot color="#042331" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={styles.title}>Chakra AI</div>
                        <div style={styles.subtitle}>Clean, structured tech intelligence — powered by Gemini</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={styles.smallText}>Status</div>
                        <div style={{ fontWeight: 700, color: isLoading ? "#FFD166" : "#9EE493" }}>{isLoading ? "Thinking..." : "Ready"}</div>
                    </div>
                </div>

                {/* FULL WIDTH CHAT AREA (NO SIDEBAR) */}
                <div style={{ ...styles.body, paddingRight: 0 }}>
                    <div style={{ ...styles.chatArea, width: "100%" }} aria-live="polite">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.emptyState}>
                                    Say hi to Chakra AI — ask about any technology.
                                </motion.div>
                            )}

                            {messages.map((m) => {
                                const isUser = m.sender === "user";
                                return (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        style={styles.messageRow(isUser)}
                                    >
                                        {!isUser && (
                                            <div style={styles.avatar(false)} title="Chakra AI">
                                                <Bot size={18} />
                                            </div>
                                        )}

                                        <div>
                                            <div style={styles.bubble(isUser)}>
                                                {m.text}
                                            </div>
                                            <div style={styles.meta}>
                                                {new Date(m.time).toLocaleString()} • {isUser ? "You" : "Chakra AI"}
                                            </div>
                                        </div>

                                        {isUser && (
                                            <div style={styles.avatar(true)} title="You">
                                                <User size={18} />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div style={styles.inputArea}>
                    <textarea
                        ref={inputRef}
                        aria-label="Type your message"
                        placeholder="Ask about a technology (e.g., 'Lithium-ion battery') — Shift+Enter for newline"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        style={styles.textarea}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        style={{
                            ...styles.sendBtn,
                            ...(isLoading ? styles.sendBtnDisabled : {})
                        }}
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <svg width="18" height="18" viewBox="0 0 50 50" style={{ display: "block" }}>
                                    <path fill="white" d="M25 5A20 20 0 1 0 45 25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="0">
                                        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                                Thinking...
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Send size={16} />
                                <span style={{ fontWeight: 700 }}>Send</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
