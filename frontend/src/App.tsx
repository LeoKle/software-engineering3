import { useEffect, useState } from "react";
import "./App.css";
import 'primeicons/primeicons.css';

import ChatClient from "./components/Client";
import type { Message } from "./types/message";
import { fetchMessages, sendMessage } from "./services/message";
import { connectWebSocket, disconnectWebSocket, wsSendMessage } from "./services/websocket";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function App() {
    /* REST Client */
    const [restSender, setRestSender] = useState("REST");
    const [restMessages, setRestMessages] = useState<Message[]>([]);
    const [restText, setRestText] = useState("");
    const [restLoading, setRestLoading] = useState<boolean>(false);

    /* WS Client */
    const [wsMessages, setWsMessages] = useState<Message[]>([]);
    const [wsSender, setWsSender] = useState("WS");
    const [wsText, setWsText] = useState("");

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const load = async (): Promise<void> => {
            setRestLoading(true);

            await new Promise<void>(res => setTimeout(res, 2000));

            const data = await fetchMessages();
            setRestMessages(data);
            setRestLoading(false);

            timeoutId = setTimeout(load, 2500);
        };

        load();

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        connectWebSocket((msg) => {
            setWsMessages((prev) => [...prev, msg]);
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
                <div style={{ flex: 1 }}>
                    <ChatClient
                        title="REST Client"
                        messages={restMessages}
                        currentUser={restSender}
                    />

                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <InputText value={restSender} onChange={(e) => setRestSender(e.target.value)} />
                        <InputText value={restText} placeholder="Message..." onChange={(e) => setRestText(e.target.value)} />
                        <Button label="Send REST" icon={restLoading ? "pi pi-spinner" : "pi pi-send"} onClick={handleRestSend} severity={restLoading ? "warning" : "success"} />
                    </div>
                </div>

                {/* WebSocket Client */}
                <div style={{ flex: 1 }}>
                    <ChatClient
                        title="WebSocket Client"
                        messages={wsMessages}
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
