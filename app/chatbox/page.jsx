"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

export default function AlumniChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([
        {
            id: 1,
            name: "John Doe",
            img: "https://randomuser.me/api/portraits/men/32.jpg",
            lastMessage: "Looking forward to our meetup!",
            online: true,
            messages: [
                { sender: "John Doe", text: "Hey, how are you?", time: "10:45 AM" },
                { sender: "You", text: "I'm good! You?", time: "10:46 AM" },
            ],
        },
        {
            id: 2,
            name: "Sophia Lee",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
            lastMessage: "Thanks for the update!",
            online: false,
            messages: [
                { sender: "Sophia Lee", text: "Any updates on the alumni event?", time: "9:20 AM" },
            ],
        },
    ]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedChat) return;
        const updatedChats = chats.map((chat) => {
            if (chat.id === selectedChat.id) {
                return {
                    ...chat,
                    lastMessage: message,
                    messages: [
                        ...chat.messages,
                        { sender: "You", text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    ],
                };
            }
            return chat;
        });
        setChats(updatedChats);
        setMessage("");
    };

    return (
        <div className="bg-black text-white min-h-screen pt-17 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center bg-gray-950 rounded-lg px-3 py-2">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search alumni..."
                            className="ml-2 bg-transparent text-gray-300 w-full focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-950 transition ${selectedChat?.id === chat.id ? "bg-gray-950 border-l-4 border-purple-600" : ""
                                }`}
                        >
                            <div className="relative">
                                <img src={chat.img} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                {chat.online && (
                                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{chat.name}</h3>
                                <p className="text-sm text-gray-400 truncate w-40">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-950">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedChat.img}
                                    alt={selectedChat.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h2 className="font-semibold text-lg">{selectedChat.name}</h2>
                                    <p className="text-sm text-gray-400">{selectedChat.online ? "Online" : "Offline"}</p>
                                </div>
                            </div>
                            <MoreVertical className="text-gray-400 cursor-pointer" />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-black">
                            {selectedChat.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-xl shadow ${msg.sender === "You"
                                            ? "bg-gradient-to-r from-purple-400 to-purple-500 text-black"
                                            : "bg-gray-950 text-gray-200"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <span className="text-xs block mt-1 text-gray-300">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Bar */}
                        <div className="p-4 border-t border-gray-700 bg-gray-950 flex items-center gap-3">
                            <button className="text-gray-400 hover:text-white">
                                <Paperclip size={22} />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="input-control"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-purple-600 text-black px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </main>
        </div>
    );
}
