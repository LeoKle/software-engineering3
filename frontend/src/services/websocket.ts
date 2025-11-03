import type { Message } from "../types/message";

let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

export function connectWebSocket(onMessage: (msg: Message) => void) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected");
        return;
    }

    const connect = () => {
        if (socket && socket.readyState === WebSocket.OPEN) return;

        socket = new WebSocket("ws://localhost:8000/ws");

        socket.onopen = () => {
            console.log("✅ WebSocket connected");
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
        };

        socket.onmessage = (event) => {
            try {
                const msg: Message = JSON.parse(event.data);
                onMessage(msg);
            } catch {
                console.warn("Received non-JSON WS message:", event.data);
            }
        };

        socket.onclose = () => {
            console.log("❌ WebSocket disconnected, retrying in 1s");
            reconnectTimeout = setTimeout(connect, 1000);
        };

        socket.onerror = (err) => console.error("WebSocket error:", err);
    };

    connect();
}

export function wsSendMessage(msg: Message) {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    } else {
        console.warn("⚠️ WebSocket not open.");
    }
}

export const disconnectWebSocket = () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    socket?.close();
    socket = null;
};
