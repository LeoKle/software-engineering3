import { useEffect, useState } from "react";
import "./App.css";
import ChatClient from "./components/Client";
import type { Message } from "./types/message";
import { fetchMessages, sendMessage } from "./services/message";
import { connectWebSocket, disconnectWebSocket, wsSendMessage } from "./services/websocket";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function App() {
    const [messages1, setMessages1] = useState<Message[]>([]);
    const [messages2, setMessages2] = useState<Message[]>([]);

    const [restSender, setRestSender] = useState("REST");
    const [restText, setRestText] = useState("");

    const [wsSender, setWsSender] = useState("WS");
    const [wsText, setWsText] = useState("");

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
            setMessages2((prev) => [...prev, msg]);
        });
        return () => disconnectWebSocket();
    }, []);

    const handleRestSend = async () => {
        if (!restText.trim()) return;
        await sendMessage({ sender: restSender, message: restText });
        setRestText("");
    };

    const handleWsSend = () => {
        if (!wsText.trim()) return;
        wsSendMessage({ sender: wsSender, message: wsText });
        setWsText("");
    };

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
                {/* REST Client */}
                <div>
                    <ChatClient
                        title="REST Client"
                        messages={messages1}
                        currentUser={restSender}
                    />

                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <InputText value={restSender} onChange={(e) => setRestSender(e.target.value)} />
                        <InputText value={restText} placeholder="Message..." onChange={(e) => setRestText(e.target.value)} />
                        <Button label="Send REST" icon="pi pi-send" onClick={handleRestSend} />
                    </div>
                </div>

                {/* WebSocket Client */}
                <div>
                    <ChatClient
                        title="WebSocket Client"
                        messages={messages2}
                        currentUser={wsSender}
                    />

                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <InputText value={wsSender} onChange={(e) => setWsSender(e.target.value)} />
                        <InputText value={wsText} placeholder="Message..." onChange={(e) => setWsText(e.target.value)} />
                        <Button label="Send WS" icon="pi pi-send" onClick={handleWsSend} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
