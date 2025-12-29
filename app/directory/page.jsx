"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Plus } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/Components/ProtectedRoute";
import FriendRequestButton from "@/Components/FriendRequestButton";

export default function AlumniDirectory() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        batch: "",
        department: "",
        location: "",
    });

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token-edunet");
            const res = await fetch("/api/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Apply filters
    const filteredUsers = users.filter(
        (user) =>
            (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.position?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedFilters.batch === "" || user.batch === selectedFilters.batch) &&
            (selectedFilters.department === "" ||
                user.department === selectedFilters.department) &&
            (selectedFilters.location === "" || user.location === selectedFilters.location)
    );

    return (
        <ProtectedRoute>
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="min-h-screen bg-black text-white font-sans pt-16">
                {/* Hero Section */}
                <section className="relative min-h-[50vh] flex flex-col justify-center items-center overflow-hidden">
                    {/* Abstract background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                    <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-amber-400 mb-6 leading-tight">
                            Global Alumni Network
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Connect with professionals, mentors, and friends who share your alma mater roots.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto group">
                            <div className="flex items-center bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1 focus-within:border-purple-500/50 transition-all duration-300 shadow-2xl">
                                <Search size={20} className="ml-4 text-gray-500 group-focus-within:text-purple-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name, company, or role..."
                                    className="w-full bg-transparent px-4 py-4 text-gray-200 focus:outline-none placeholder:text-gray-600"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-6 py-16">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 space-y-8">
                        <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                                Refinery
                            </h2>

                            <div className="space-y-8">
                                {/* Batch */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Graduation Year</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedFilters.batch}
                                            onChange={(e) =>
                                                setSelectedFilters({ ...selectedFilters, batch: e.target.value })
                                            }
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 appearance-none transition-all group-hover:border-white/20"
                                        >
                                            <option value="">All Batches</option>
                                            <option value="2018">Class of 2018</option>
                                            <option value="2019">Class of 2019</option>
                                            <option value="2020">Class of 2020</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-purple-500 transition-colors">
                                            <Plus size={16} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Department</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedFilters.department}
                                            onChange={(e) =>
                                                setSelectedFilters({ ...selectedFilters, department: e.target.value })
                                            }
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 appearance-none transition-all group-hover:border-white/20"
                                        >
                                            <option value="">All Departments</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Design">Design</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-purple-500 transition-colors">
                                            <Plus size={16} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Work Location</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedFilters.location}
                                            onChange={(e) =>
                                                setSelectedFilters({ ...selectedFilters, location: e.target.value })
                                            }
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 appearance-none transition-all group-hover:border-white/20"
                                        >
                                            <option value="">Worldwide</option>
                                            <option value="New York">New York</option>
                                            <option value="San Francisco">San Francisco</option>
                                            <option value="Austin">Austin</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-purple-500 transition-colors">
                                            <Plus size={16} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Users Grid */}
                    <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-6 box-shadow-primary transition-all duration-300 hover:scale-105"
                                >
                                    <div className="relative flex flex-col items-center text-center">
                                        {user.friendStatus === "friends" && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/20 z-10">
                                                ALREADY FRIEND
                                            </div>
                                        )}
                                        <img
                                            src={user.profilePic || "/assets/img/placeholder-profile.avif"}
                                            alt={user.fullName}
                                            className={`w-24 h-24 rounded-full border-4 ${user.friendStatus === 'friends' ? 'border-green-500' : 'border-purple-500'} mb-4 hover:scale-110 transition-transform duration-300 object-cover`}
                                        />
                                        <h3 className="text-xl font-bold text-white mb-1">{user.fullName}</h3>
                                        <p className="text-gray-400 text-sm font-medium">
                                            {user.position}
                                        </p>
                                        <p className="text-purple-400/80 text-[11px] font-bold uppercase tracking-wider mb-2">
                                            {user.company}
                                        </p>
                                        <p className="text-gray-500 text-xs mb-6">
                                            Class of {user.batch} • {user.department}
                                        </p>

                                        <div className="flex flex-col gap-3 w-full">
                                            <Link href={`/profile/${user._id}`} className="w-full">
                                                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5 text-sm font-semibold">
                                                    <Eye size={16} /> Profile
                                                </button>
                                            </Link>
                                            <FriendRequestButton userId={user._id} initialStatus={user.friendStatus || "none"} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full text-center">
                                No users found with selected filters.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </ProtectedRoute>
    );
}
