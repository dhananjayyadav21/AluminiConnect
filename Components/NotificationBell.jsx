"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
    const [count, setCount] = useState(0);
    const [requests, setRequests] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const getToken = () => localStorage.getItem("token-edunet");

    useEffect(() => {
        fetchRequests();
        // Poll for new requests every 30 seconds
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch("/api/friend-requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data.received || []);
                setCount(data.received?.length || 0);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 hover:bg-gray-800 rounded-full transition"
            >
                <Bell size={22} />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                        {count}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="font-semibold text-lg">Friend Requests</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {requests.length > 0 ? (
                                requests.slice(0, 5).map((req) => (
                                    <div
                                        key={req._id}
                                        className="p-4 border-b border-gray-800 hover:bg-gray-800 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={req.sender.profilePic || "/assets/img/placeholder-profile.avif"}
                                                alt={req.sender.fullName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{req.sender.fullName}</p>
                                                <p className="text-sm text-gray-400">
                                                    {req.sender.position} at {req.sender.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    No pending requests
                                </div>
                            )}
                        </div>
                        {requests.length > 0 && (
                            <Link
                                href="/friend-requests"
                                onClick={() => setShowDropdown(false)}
                                className="block p-3 text-center bg-purple-600 hover:bg-purple-700 transition font-medium"
                            >
                                View All Requests
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
