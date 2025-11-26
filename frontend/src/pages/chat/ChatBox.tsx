import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

interface ChatMessage {
    sender: string;
    text: string;
    timestamp?: string;
}

export default function ChatBox() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const stompClientRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        fetch("http://localhost:9999/chat/init");
    }, []);

    useEffect(() => {
        const socket = new SockJS("http://localhost:9999/ws-chat");
        const client = Stomp.over(socket);
        let subscription: any = null;
        client.connect({}, () => {
            subscription = client.subscribe("/topic/messages", (msg: any) => {
                const message: ChatMessage = JSON.parse(msg.body);
                setMessages(prev => [...prev, message]);
            });

            stompClientRef.current = client;
            setConnected(true);
            
        });

        return () => {
            if (subscription) subscription.unsubscribe();
            if (client && connected) client.disconnect(() => { });
        }
    }, []);

    useEffect(() => {
    if (connected) {
        fetch("http://localhost:9999/chat/init");
    }
}, [connected]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !stompClientRef.current) return;

        const timestamp = new Date().toLocaleTimeString();
        const userMessage: ChatMessage = { sender: "user", text: input, timestamp };
        setMessages(prev => [...prev, userMessage]);

        stompClientRef.current.send("/app/send", {}, JSON.stringify(userMessage));
        setInput("");
    };

    const highlightKeyword = (text: string) => {
        const keywords = ["giá", "giờ"];
        let highlighted = text;
        keywords.forEach(k => {
            const regex = new RegExp(`(${k})`, "gi");
            highlighted = highlighted.replace(regex, "<mark>$1</mark>");
        });
        return highlighted;
    };

    return (
        <div style={{ width: "400px", margin: "0 auto" }}>
            <div
                style={{
                    border: "1px solid #ccc",
                    height: "400px",
                    overflowY: "scroll",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "220px",
                }}
            >
                {messages
                    .filter((msg, index, self) =>
                        index === self.findIndex(m =>
                            m.text === msg.text && m.sender === msg.sender && m.timestamp === msg.timestamp
                        )
                    )
                    .map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                backgroundColor: msg.sender === "user" ? "#d1ffd1" : "#f0f0f0",
                                padding: "5px 10px",
                                borderRadius: "10px",
                                margin: "5px",
                                maxWidth: "70%",
                            }}
                            dangerouslySetInnerHTML={{ __html: highlightKeyword(msg.text) + ` <small>${msg.timestamp}</small>` }}
                        />
                    ))
                }
                <div ref={messagesEndRef} />
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                style={{ width: "80%", padding: "5px", marginTop: "5px" }}
            />
            <button onClick={sendMessage} style={{ padding: "5px", marginLeft: "5px" }}>Gửi</button>
        </div>

    );
}
