import React from "react";
import Chat, { type Message } from "./Chat";

interface ChatClientProps {
    title: string;
    messages: Message[];
    currentUser: string;
}

const ChatClient: React.FC<ChatClientProps> = ({ title, messages, currentUser }) => {
    return (
        <div style={{ flex: 1 }}>
            <h2>{title}</h2>
            <Chat messages={messages} currentUser={currentUser} />
        </div>
    );
};

export default ChatClient;
