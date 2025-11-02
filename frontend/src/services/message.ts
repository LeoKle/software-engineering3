import axios from "axios";
import type { Message } from "../types/message";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

export async function fetchMessages(): Promise<Message[]> {
    const res = await api.get<Message[]>("/messages");
    return res.data;
}

export async function sendMessage(msg: Message): Promise<void> {
    await api.post("/messages", msg);
}
