"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserX, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function FriendRequestButton({ userId, initialStatus = "none" }) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const getToken = () => localStorage.getItem("token-edunet");

    const sendFriendRequest = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/friend-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ receiverId: userId }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("sent");
                toast.success("Friend request sent!");
            } else {
                toast.error(data.error || "Failed to send request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async (requestId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/friend-requests/${requestId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("friends");
                toast.success("Friend request accepted!");
            } else {
                toast.error(data.error || "Failed to accept request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const rejectFriendRequest = async (requestId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/friend-requests/${requestId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                setStatus("none");
                toast.success("Friend request rejected");
            } else {
                toast.error("Failed to reject request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const unfriend = async () => {
        if (!confirm("Are you sure you want to remove this friend?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/friends?friendId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (res.ok) {
                setStatus("none");
                toast.success("Friend removed");
            } else {
                toast.error("Failed to remove friend");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (status === "friends") {
        return (
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                    <UserCheck size={18} />
                    Already Friends
                </span>
                <button
                    onClick={unfriend}
                    disabled={loading}
                    className="px-3 py-2 text-red-400 hover:text-red-300 transition"
                    title="Unfriend"
                >
                    <UserX size={18} />
                </button>
            </div>
        );
    }

    if (status === "sent") {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
            >
                <Clock size={18} />
                Request Sent
            </button>
        );
    }

    if (status === "received") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => acceptFriendRequest(userId)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                >
                    <UserCheck size={18} />
                    Accept
                </button>
                <button
                    onClick={() => rejectFriendRequest(userId)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                >
                    <UserX size={18} />
                    Reject
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={sendFriendRequest}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 shadow-[0_0_10px_rgba(164,49,213,0.3)] hover:shadow-[0_0_15px_rgba(164,49,213,0.5)]"
        >
            <UserPlus size={18} />
            {loading ? "Sending..." : "Add Friend"}
        </button>
    );
}
