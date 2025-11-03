import React from "react";
import type { Message } from "../types/message";

interface ChatProps {
    messages: Message[];
    currentUser: string;
}

const Chat: React.FC<ChatProps> = ({ messages, currentUser }) => {
    return (
        <div
            style={{
                minWidth: "300px",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}
        >
            {messages.map((msg, index) => {
                const isCurrentUser = msg.sender === currentUser;

                return (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: isCurrentUser ? "#3b82f6" : "#e5e7eb",
                                color: isCurrentUser ? "white" : "black",
                                padding: "0.75rem 1rem",
                                borderRadius: isCurrentUser
                                    ? "15px 15px 0 15px"
                                    : "15px 15px 15px 0",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                                boxShadow: isCurrentUser
                                    ? "0 2px 8px rgba(0,0,0,0.2)"
                                    : "none",
                            }}
                        >
                            {!isCurrentUser && <strong>{msg.sender}: </strong>}
                            {msg.message}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Chat;
