import React from "react";
import Chat from "./Chat";
import type { Message } from "../types/message";

interface ChatClientProps {
    title: string;
    messages: Message[];
    currentUser: string;
}

const ChatClient: React.FC<ChatClientProps> = ({ title, messages, currentUser }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",   // Stack vertically
                alignItems: "center",      // Center horizontally
                gap: "1rem",               // Space between title and chat
                width: "100%",             // Optional: ensure full width for centering
            }}
        >
            <h2>{title}</h2>
            <Chat messages={messages} currentUser={currentUser} />
        </div>
    );
};

export default ChatClient;
