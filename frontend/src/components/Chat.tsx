import React from "react";
import { classNames } from "primereact/utils";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { Message } from "../types/message";

interface ChatProps {
    messages: Message[];
    currentUser: string;
}

const Chat: React.FC<ChatProps> = ({ messages, currentUser }) => {
    return (
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "1rem" }}>
            {messages.map((msg, index) => {
                const isCurrentUser = msg.sender === currentUser;
                return (
                    <div
                        key={index}
                        className={classNames("p-mb-3 d-flex", {
                            "justify-content-end": isCurrentUser,
                            "justify-content-start": !isCurrentUser,
                        })}
                    >
                        <div
                            className={classNames("p-d-inline-block p-p-3", {
                                "bg-blue-500 text-white": isCurrentUser,
                                "bg-gray-200 text-black": !isCurrentUser,
                            })}
                            style={{
                                borderRadius: isCurrentUser
                                    ? "15px 15px 0 15px"
                                    : "15px 15px 15px 0",
                                maxWidth: "70%",
                                boxShadow: isCurrentUser
                                    ? "0 2px 8px rgba(0,0,0,0.2)"
                                    : "none",
                            }}
                        >
                            {!isCurrentUser && (
                                <strong>{msg.sender}: </strong>
                            )}
                            {msg.message}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Chat;
