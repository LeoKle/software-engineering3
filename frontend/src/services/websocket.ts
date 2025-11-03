import type { Message } from "../types/message";

let socket: WebSocket | null = null;

export function connectWebSocket(
    onMessage: (msg: Message) => void
) {
    socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = () => console.log("✅ WebSocket connected");

    socket.onmessage = (event) => {
        try {
            const msg: Message = JSON.parse(event.data);
            onMessage(msg);
        } catch {
            console.warn("Received non-JSON WS message:", event.data);
        }
    };

    socket.onclose = () => console.log("❌ WebSocket disconnected");
    socket.onerror = (err) => console.error("WebSocket error:", err);
}

export function wsSendMessage(msg: Message) {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    } else {
        console.warn("⚠️ WebSocket not open.");
    }
}

export const disconnectWebSocket = () => socket?.close();
