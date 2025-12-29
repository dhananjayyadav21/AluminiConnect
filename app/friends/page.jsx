"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle, UserX, Users } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/Components/ProtectedRoute";
import toast from "react-hot-toast";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token-edunet");

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/friends", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setFriends(data.friends || []);
            } else {
                toast.error("Failed to fetch friends");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleUnfriend = async (friendId) => {
        if (!confirm("Are you sure you want to remove this friend?")) return;

        try {
            const res = await fetch(`/api/friends?friendId=${friendId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                toast.success("Friend removed");
                setFriends(friends.filter((f) => f._id !== friendId));
            } else {
                toast.error("Failed to remove friend");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const filteredFriends = friends.filter((friend) =>
        friend.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="min-h-screen bg-black text-white pt-16">
                {/* Hero Section */}
                <section className="min-h-[40vh] text-center flex flex-col justify-center items-center bg-gradient-to-r from-black via-purple-950/30 to-black py-12 px-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-12 h-12 text-purple-400" />
                        <h1 className="text-4xl md:text-5xl font-bold text-with-primary-outline">
                            My Friends
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg mb-8">
                        Connect and collaborate with your network
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl w-full mx-auto flex items-center bg-gray-900 rounded-xl border border-gray-700 hover:border-purple-600 transition-all shadow-lg">
                        <input
                            type="text"
                            placeholder="Search friends by name..."
                            className="w-full bg-transparent px-4 py-3 text-gray-300 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="px-4 text-purple-600 hover:text-white transition">
                            <Search size={24} />
                        </button>
                    </div>
                </section>

                {/* Friends Grid */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {filteredFriends.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredFriends.map((friend) => (
                                <div
                                    key={friend._id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-6 box-shadow-primary transition-all duration-300 hover:scale-105"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={friend.profilePic || "/assets/img/placeholder-profile.avif"}
                                            alt={friend.fullName}
                                            className="w-24 h-24 rounded-full border-4 border-purple-500 mb-4 hover:scale-110 transition-transform duration-300"
                                        />
                                        <h3 className="text-xl font-bold mb-1">{friend.fullName}</h3>
                                        <p className="text-gray-400 text-sm mb-1">
                                            {friend.position || "Position"} at {friend.company || "Company"}
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {friend.batch} • {friend.department}
                                        </p>

                                        <div className="flex gap-2 w-full">
                                            <Link href={`/chatbox?userId=${friend._id}`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-[0_0_10px_rgba(164,49,213,0.3)]">
                                                    <MessageCircle size={18} />
                                                    Message
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleUnfriend(friend._id)}
                                                className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
                                                title="Unfriend"
                                            >
                                                <UserX size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-400 mb-2">
                                {searchTerm ? "No friends found" : "No friends yet"}
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {searchTerm
                                    ? "Try a different search term"
                                    : "Start connecting with alumni from the directory"}
                            </p>
                            <Link
                                href="/directory"
                                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-[0_0_15px_rgba(164,49,213,0.4)]"
                            >
                                Browse Directory
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
