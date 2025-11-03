import axios from "axios";
import type { Message } from "../types/message";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

type MessagesResponse = {
    messages: Message[];
};

export async function fetchMessages(): Promise<Message[]> {
    const res = await api.get<MessagesResponse>("/messages");
    return res.data.messages;
}

export async function sendMessage(msg: Message): Promise<void> {
    await api.post("/messages", msg);
}
