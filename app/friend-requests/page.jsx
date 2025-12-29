"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserX, Clock, Users } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import toast from "react-hot-toast";

export default function FriendRequestsPage() {
    const [activeTab, setActiveTab] = useState("received");
    const [requests, setRequests] = useState({ received: [], sent: [] });
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token-edunet");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/friend-requests", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                toast.error("Failed to fetch requests");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            const res = await fetch(`/api/friend-requests/${requestId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                toast.success("Friend request accepted!");
                fetchRequests();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to accept request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleReject = async (requestId) => {
        try {
            const res = await fetch(`/api/friend-requests/${requestId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                toast.success("Friend request rejected");
                fetchRequests();
            } else {
                toast.error("Failed to reject request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const currentRequests = requests[activeTab] || [];

    return (
        <ProtectedRoute>
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="min-h-screen bg-black text-white pt-16">
                {/* Hero Section */}
                <section className="min-h-[35vh] text-center flex flex-col justify-center items-center bg-gradient-to-l from-black via-purple-950/30 to-black py-12 px-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <UserPlus className="w-12 h-12 text-amber-400" />
                        <h1 className="text-3xl md:text-4xl font-semibold text-with-secondary-outline">
                            Friend Requests
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg">
                        Manage your pending friend requests
                    </p>
                </section>

                {/* Tabs */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex gap-4 mb-8 border-b border-gray-800">
                        <button
                            onClick={() => setActiveTab("received")}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === "received"
                                ? "text-purple-400 border-b-2 border-purple-400"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Received ({requests.received?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab("sent")}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === "sent"
                                ? "text-purple-400 border-b-2 border-purple-400"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Sent ({requests.sent?.length || 0})
                        </button>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-4">
                        {currentRequests.length > 0 ? (
                            currentRequests.map((req) => {
                                const user = activeTab === "received" ? req.sender : req.receiver;
                                return (
                                    <div
                                        key={req._id}
                                        className="bg-gray-950 border border-gray-800 rounded-xl p-6 box-shadow-primary transition-all hover:scale-[1.02]"
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <img
                                                src={user.profilePic || "/assets/img/placeholder-profile.avif"}
                                                alt={user.fullName}
                                                className="w-20 h-20 rounded-full border-4 border-purple-500"
                                            />
                                            <div className="flex-1 text-center md:text-left">
                                                <h3 className="text-xl font-bold mb-1">{user.fullName}</h3>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    {user.position || "Position"} at {user.company || "Company"}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {user.batch} • {user.department}
                                                </p>
                                            </div>

                                            {activeTab === "received" ? (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAccept(req._id)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                                    >
                                                        <UserCheck size={18} />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                                    >
                                                        <UserX size={18} />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-400 rounded-lg">
                                                    <Clock size={18} />
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20">
                                <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-400 mb-2">
                                    No {activeTab} requests
                                </h2>
                                <p className="text-gray-500">
                                    {activeTab === "received"
                                        ? "You don't have any pending friend requests"
                                        : "You haven't sent any friend requests"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
