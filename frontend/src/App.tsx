import { useEffect, useState } from "react";
import "./App.css";
import ChatClient from "./components/Client";
import type { Message } from "./types/message";
import { fetchMessages } from "./services/message";
import { connectWebSocket, disconnectWebSocket } from "./services/websocket";

function App() {
    const restUser: string = "Alice";
    const wsUser: string = "Alice";

    const [messages1, setMessages1] = useState<Message[]>([]);

    const [messages2, setMessages2] = useState<Message[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchMessages();
            setMessages1(data);
        };

        load();

        const interval = setInterval(load, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        connectWebSocket((msg) => {
            console.log("WS message:", msg);
            setMessages2((prev) => [...prev, msg]);
        });

        return () => disconnectWebSocket();
    }, []);

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
