"use client";

import { useState } from "react";
import { Search, PlusCircle, MessageCircle, X, Edit3, Trash2 } from "lucide-react";

export default function ForumPage() {
    const loggedInUser = "You";

    const [threads, setThreads] = useState([
        {
            id: 1,
            title: "How to prepare for technical interviews?",
            author: "John Doe",
            replies: ["Start with DSA basics", "Practice mock interviews"],
            category: "Career Guidance",
            tags: ["Career", "Interviews"],
            votes: 15,
        },
        {
            id: 2,
            title: "Best resources for learning React",
            author: "You",
            replies: ["React docs are great!", "Try building projects"],
            category: "Web Development",
            tags: ["React", "JavaScript"],
            votes: 25,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedThread, setSelectedThread] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
    const [newThread, setNewThread] = useState({
        title: "",
        category: "",
        tags: "",
        author: loggedInUser,
    });

    const openThread = (thread) => {
        setSelectedThread(thread);
        setIsModalOpen(true);
    };

    const closeThread = () => {
        setIsModalOpen(false);
        setSelectedThread(null);
        setNewComment("");
    };

    const addComment = () => {
        if (!newComment.trim()) return;
        const updatedThreads = threads.map((t) =>
            t.id === selectedThread.id
                ? { ...t, replies: [...t.replies, newComment] }
                : t
        );
        setThreads(updatedThreads);
        setNewComment("");
    };

    const addThread = () => {
        if (!newThread.title.trim() || !newThread.category.trim()) return;
        const newId = threads.length + 1;
        setThreads([
            ...threads,
            {
                ...newThread,
                id: newId,
                replies: [],
                tags: newThread.tags.split(",").map((tag) => tag.trim()),
                votes: 0,
            },
        ]);
        setNewThread({ title: "", category: "", tags: "", author: loggedInUser });
        setIsNewThreadOpen(false);
    };

    const deleteThread = (id) => {
        setThreads(threads.filter((t) => t.id !== id));
        closeThread();
    };

    return (
        <div className="bg-black text-gray-100 min-h-screen">
            {/* Navbar Space */}
            <div className="h-16"></div>

            {/* Hero Section */}
            <section className="text-center bg-gradient-to-r from-black via-gray-900 to-black py-10 px-4 sm:py-14 sm:px-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#32a8a8]">
                    Join Discussions, Share Knowledge
                </h1>
                <p className="text-gray-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg">
                    Explore trending topics, ask questions, and help others.
                </p>

                {/* Search */}
                <div className="mt-6 sm:mt-8 max-w-xl mx-auto flex items-center bg-gray-900 rounded-lg border border-gray-700">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full bg-transparent px-4 py-2 sm:py-3 text-gray-300 focus:outline-none"
                    />
                    <button className="px-3 sm:px-4 text-[#32a8a8] hover:text-white">
                        <Search size={22} />
                    </button>
                </div>
            </section>

            {/* Main Section */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 py-8">
                {/* Threads List */}
                <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#32a8a8]">
                            Latest Discussions
                        </h2>
                        <button
                            onClick={() => setIsNewThreadOpen(true)}
                            className="flex items-center justify-center gap-2 bg-[#32a8a8] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#2b9494] w-full sm:w-auto"
                        >
                            <PlusCircle size={20} /> Ask Question
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {threads.map((thread) => (
                            <div
                                key={thread.id}
                                onClick={() => openThread(thread)}
                                className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-[#32a8a8] transition cursor-pointer"
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-lg sm:text-xl font-semibold">
                                        {thread.title}
                                    </h3>
                                    <span className="text-xs sm:text-sm text-gray-400">
                                        {thread.votes} votes
                                    </span>
                                </div>
                                <div className="text-gray-500 text-xs sm:text-sm mt-1">
                                    {thread.replies.length} answers • by {thread.author}
                                </div>
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {thread.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-[#1a1a1a] border border-[#32a8a8] px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-64 bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-[#32a8a8] mb-4">
                        Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {["React", "Next.js", "Career", "DSA", "AI"].map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-[#1a1a1a] border border-[#32a8a8] px-3 py-1 rounded text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Thread Modal */}
            {isModalOpen && selectedThread && (
                <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-gray-900 rounded-xl w-full max-w-full sm:max-w-2xl p-4 sm:p-6 relative shadow-2xl border border-gray-700">
                        <button
                            onClick={closeThread}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#32a8a8]">
                            {selectedThread.title}
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm mb-4">
                            {selectedThread.category} • By {selectedThread.author}
                        </p>

                        {/* Replies */}
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                            {selectedThread.replies.length > 0 ? (
                                selectedThread.replies.map((reply, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800 p-2 sm:p-3 rounded-md text-gray-300 text-sm"
                                    >
                                        {reply}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No comments yet. Be the first!</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <button
                                onClick={addComment}
                                className="bg-[#32a8a8] text-black px-4 py-2 rounded-lg hover:bg-[#2b9494]"
                            >
                                Send
                            </button>
                        </div>

                        {/* Edit/Delete */}
                        {selectedThread.author === loggedInUser && (
                            <div className="flex justify-end mt-4 space-x-3 text-sm">
                                <button className="flex items-center gap-1 text-yellow-400 hover:underline">
                                    <Edit3 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteThread(selectedThread.id)}
                                    className="flex items-center gap-1 text-red-500 hover:underline"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Thread Modal */}
            {isNewThreadOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-gray-900 rounded-xl w-full max-w-full sm:max-w-lg p-4 sm:p-6 relative shadow-2xl border border-gray-700">
                        <button
                            onClick={() => setIsNewThreadOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#32a8a8] mb-4">
                            Create New Discussion
                        </h2>
                        <input
                            type="text"
                            placeholder="Thread Title"
                            value={newThread.title}
                            onChange={(e) =>
                                setNewThread({ ...newThread, title: e.target.value })
                            }
                            className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={newThread.category}
                            onChange={(e) =>
                                setNewThread({ ...newThread, category: e.target.value })
                            }
                            className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={newThread.tags}
                            onChange={(e) =>
                                setNewThread({ ...newThread, tags: e.target.value })
                            }
                            className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                        />
                        <button
                            onClick={addThread}
                            className="w-full bg-[#32a8a8] text-black font-bold py-3 rounded-lg hover:bg-[#2b9494]"
                        >
                            Add Thread
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
