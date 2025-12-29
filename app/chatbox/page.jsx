"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreVertical, Menu, X, Users, MessageSquare } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";

export default function AlumniChatPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const router = useRouter();

    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState("chats"); // "chats" or "friends"
    const [conversations, setConversations] = useState([]);
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);

    const getToken = () => localStorage.getItem("token-edunet");

    useEffect(() => {
        const initChat = async () => {
            await Promise.all([fetchConversations(), fetchFriends()]);
        };
        initChat();
    }, []);

    // Handle userId from query param
    useEffect(() => {
        if (userId && conversations.length >= 0) {
            const handleUserIdParam = async () => {
                // Check if we already have a conversation with this user
                const existingConv = conversations.find(
                    (c) => c.participant._id === userId
                );

                if (existingConv) {
                    setSelectedChat(existingConv);
                } else if (!loading) {
                    // Try to create/get conversation
                    await createConversation(userId);
                }
            };
            handleUserIdParam();
        }
    }, [userId, conversations, loading]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat._id);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/conversations", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
                return data.conversations;
            } else {
                toast.error("Failed to fetch conversations");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
        return [];
    };

    const fetchFriends = async () => {
        try {
            const res = await fetch("/api/friends", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setFriends(data.friends || []);
            }
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        }
    };

    const createConversation = async (participantId) => {
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ participantId }),
            });

            if (res.ok) {
                const data = await res.json();
                const latestConvs = await fetchConversations();
                const newConv = latestConvs.find(c => c.participant._id === participantId);
                if (newConv) {
                    setSelectedChat(newConv);
                }
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to start conversation");
                // Clear the query param if it's invalid
                router.replace("/chatbox");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedChat) return;

        const messageContent = message.trim();
        setMessage("");

        const tempMessage = {
            _id: Date.now().toString(),
            content: messageContent,
            sender: { fullName: "You", _id: "temp-me" },
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMessage]);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    conversationId: selectedChat._id,
                    receiverId: selectedChat.participant._id,
                    content: messageContent,
                }),
            });

            if (res.ok) {
                fetchMessages(selectedChat._id);
                fetchConversations();
            } else {
                toast.error("Failed to send message");
                // Rollback or show error state
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFriends = friends.filter(f =>
        f.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute>
            {loading && conversations.length === 0 && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="bg-black text-white min-h-screen flex flex-col md:flex-row pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed md:static top-16 left-0 h-[calc(100vh-64px)] w-80 bg-gray-950 border-r border-gray-800 flex flex-col transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                >
                    {/* Sidebar Header & Search */}
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                                Messages
                            </h2>
                            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex bg-gray-900 rounded-xl px-3 py-2 border border-gray-800 focus-within:border-purple-500/50 transition">
                            <Search size={18} className="text-gray-500 mt-1" />
                            <input
                                type="text"
                                placeholder={sidebarTab === "chats" ? "Search chats..." : "Search friends..."}
                                className="ml-2 bg-transparent text-gray-300 w-full focus:outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                            <button
                                onClick={() => setSidebarTab("chats")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${sidebarTab === "chats"
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                        : "text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <MessageSquare size={16} />
                                Chats
                            </button>
                            <button
                                onClick={() => setSidebarTab("friends")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${sidebarTab === "friends"
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                        : "text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <Users size={16} />
                                Friends
                            </button>
                        </div>
                    </div>

                    {/* List Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {sidebarTab === "chats" ? (
                            filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => (
                                    <div
                                        key={conv._id}
                                        onClick={() => {
                                            setSelectedChat(conv);
                                            setSidebarOpen(false);
                                        }}
                                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-900 transition-all border-l-4 ${selectedChat?._id === conv._id
                                                ? "bg-gray-900 border-purple-600"
                                                : "border-transparent"
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={conv.participant.profilePic || "/assets/img/placeholder-profile.avif"}
                                                alt={conv.participant.fullName}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold truncate text-gray-200">{conv.participant.fullName}</h3>
                                                {conv.lastMessageTime && (
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-0.5">
                                                {conv.lastMessage || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                                        <MessageSquare size={32} />
                                    </div>
                                    <p className="font-medium text-gray-400">No active chats</p>
                                    <p className="text-xs mt-1">Start a conversation from your friends list!</p>
                                </div>
                            )
                        ) : (
                            filteredFriends.length > 0 ? (
                                filteredFriends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => {
                                            createConversation(friend._id);
                                            setSidebarTab("chats");
                                            setSidebarOpen(false);
                                        }}
                                        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-900 transition-all border-l-4 border-transparent"
                                    >
                                        <img
                                            src={friend.profilePic || "/assets/img/placeholder-profile.avif"}
                                            alt={friend.fullName}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate text-gray-200">{friend.fullName}</h3>
                                            <p className="text-xs text-gray-500 truncate capitalize">
                                                {friend.role} • {friend.department}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-purple-600/10 text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                                            <Send size={14} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                                        <Users size={32} />
                                    </div>
                                    <p className="font-medium text-gray-400">No friends found</p>
                                    <p className="text-xs mt-1">Visit the directory to find alumini!</p>
                                </div>
                            )
                        )}
                    </div>
                </aside>

                {/* Chat Window */}
                <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                    {selectedChat ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/50 backdrop-blur-md z-10">
                                <div className="flex items-center gap-3">
                                    <button className="md:hidden p-2 hover:bg-gray-800 rounded-lg" onClick={() => setSidebarOpen(true)}>
                                        <Menu size={20} />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={selectedChat.participant.profilePic || "/assets/img/placeholder-profile.avif"}
                                            alt={selectedChat.participant.fullName}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-950"></div>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-lg hover:text-purple-400 transition cursor-pointer">
                                            {selectedChat.participant.fullName}
                                        </h2>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            Online • {selectedChat.participant.position} at {selectedChat.participant.company}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] custom-scrollbar">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => {
                                        const isOwn = msg.sender.fullName === "You" || (msg.sender._id !== selectedChat.participant._id && msg.sender._id !== "temp-me");
                                        const showDate = index === 0 ||
                                            new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                                        return (
                                            <div key={msg._id || index} className="space-y-4">
                                                {showDate && (
                                                    <div className="flex justify-center my-6">
                                                        <span className="bg-gray-900 text-gray-500 text-[10px] px-3 py-1 rounded-full border border-gray-800 uppercase tracking-widest font-bold">
                                                            {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-scaleIn`}>
                                                    <div className={`flex gap-3 max-w-[80%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                                                        {!isOwn && (
                                                            <img
                                                                src={selectedChat.participant.profilePic || "/assets/img/placeholder-profile.avif"}
                                                                className="w-8 h-8 rounded-full flex-shrink-0 mt-auto"
                                                                alt=""
                                                            />
                                                        )}
                                                        <div
                                                            className={`relative px-4 py-2.5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.01] ${isOwn
                                                                    ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-tr-none border border-purple-400/20"
                                                                    : "bg-gray-900 text-gray-100 rounded-tl-none border border-gray-800 hover:border-gray-700"
                                                                }`}
                                                        >
                                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                                            <div className={`flex items-center gap-1 mt-1 justify-end opacity-60`}>
                                                                <span className="text-[9px] uppercase font-bold tracking-tighter">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                                {isOwn && <div className="w-1 h-1 bg-white/40 rounded-full"></div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                        <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
                                            <MessageSquare size={48} className="text-purple-500" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-300">New Conversation</h3>
                                            <p className="text-sm max-w-[200px]">Send a message to start chatting with {selectedChat.participant.fullName}</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Bar */}
                            <div className="p-4 bg-gray-950 border-t border-gray-800">
                                <div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-900 p-2 rounded-2xl border border-gray-800 focus-within:border-purple-600/50 transition shadow-2xl shadow-purple-900/10">
                                    <button className="p-2.5 text-gray-500 hover:text-purple-400 hover:bg-gray-800 rounded-xl transition">
                                        <Paperclip size={20} />
                                    </button>
                                    <textarea
                                        placeholder="Type your message..."
                                        rows="1"
                                        className="flex-1 bg-transparent text-gray-200 py-2.5 focus:outline-none text-sm resize-none custom-scrollbar"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                        className={`p-3 rounded-xl transition-all duration-300 ${message.trim()
                                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:scale-110 active:scale-95 translate-y-0"
                                                : "bg-gray-800 text-gray-600 cursor-not-allowed"
                                            }`}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-center text-gray-600 mt-2 uppercase tracking-widest font-bold">
                                    Press Enter to send, Shift + Enter for new line
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 bg-[#0a0a0a]">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-purple-600 blur-[80px] opacity-20 animate-pulse"></div>
                                <div className="relative p-10 rounded-full bg-gray-900 border border-gray-800 shadow-3xl">
                                    <MessageSquare size={80} className="text-purple-500 opacity-80" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-200 mb-2">Connect with Alumini</h2>
                            <p className="text-gray-500 text-center max-w-md text-lg">
                                Select a conversation or choose a friend from the sidebar to start a real-time conversation.
                            </p>

                            <button
                                onClick={() => setSidebarTab("friends")}
                                className="mt-8 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 px-8 py-3 rounded-full text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-600/20"
                            >
                                <Users size={18} />
                                Browse Friends
                            </button>

                            <button
                                className="md:hidden mt-4 text-purple-400 font-bold"
                                onClick={() => setSidebarOpen(true)}
                            >
                                Open Sidebar
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
