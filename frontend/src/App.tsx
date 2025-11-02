import { useState } from 'react'
import './App.css'
import type { Message } from './components/Chat';
import Chat from './components/Chat';


function App() {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "Alice", message: "Hello!" },
        { sender: "me", message: "Hi Alice, how are you?" },
        { sender: "Alice", message: "I'm good, thanks!" },
    ]);

    return (
        <div className="App">
            <h1>Chat</h1>
            <Chat messages={messages} currentUser="Alice" />
        </div>
    );
}

export default App
