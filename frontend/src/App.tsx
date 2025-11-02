import { useState } from "react";
import "./App.css";
import type { Message } from "./components/Chat";
import ChatClient from "./components/Client";

function App() {
    const restUser: string = "Alice";
    const wsUser: string = "Alice";

    const [messages1, setMessages1] = useState<Message[]>([
        { sender: "Alice", message: "Hello!" },
        { sender: "me", message: "Hi Alice, how are you?" },
        { sender: "Alice", message: "I'm good, thanks!" },
    ]);

    const [messages2, setMessages2] = useState<Message[]>([
        { sender: "Bob", message: "Hey there!" },
        { sender: "Alice", message: "Hi Bob, what's up?" },
        { sender: "Bob", message: "Just working on a project." },
    ]);

    return (
        <div className="App" style={{ padding: "1rem" }}>
            <h1>Chats</h1>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2rem",
                    alignItems: "flex-start",
                }}
            >
                <ChatClient
                    title="REST Client"
                    messages={messages1}
                    currentUser={restUser}
                />

                <ChatClient
                    title="WebSocket Client"
                    messages={messages2}
                    currentUser={wsUser}
                />
            </div>
        </div>
    );
}

export default App;
