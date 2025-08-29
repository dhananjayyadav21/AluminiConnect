"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function AlumniDirectory() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setloading] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        batch: "",
        department: "",
        location: "",
    });

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setloading(true);
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data);
                setloading(false);
            } catch (err) {
                setloading(false);
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    // Apply filters
    const filteredUsers = users.filter(
        (user) =>
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
                <section className="min-h-[60vh] text-center flex flex-col justify-center items-center bg-gradient-to-l from-black via-purple-950/30 to-black py-12 px-6 shadow-md">
                    <h1 className="text-3xl md:text-5xl font-serif text-with-primary-outline mb-3 tracking-wide drop-shadow-lg animate-pulse">
                        Find and Connect with Alumni Worldwide
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Search and filter alumni to build strong professional networks.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl mx-auto flex items-center bg-gray-900 rounded-xl border border-gray-700 hover:border-purple-600 transition-all shadow-lg">
                        <input
                            type="text"
                            placeholder="Search by name, batch, location..."
                            className="w-full bg-transparent px-4 py-3 text-gray-300 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="px-4 text-purple-600 hover:text-white transition">
                            <Search size={24} />
                        </button>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 max-h-100 bg-gray-950 rounded-xl p-6 border border-gray-800 shadow-lg">
                        <h2 className="text-xl font-semibold text-with-secondary-outline mb-6 border-b border-gray-700 pb-3">
                            Filters
                        </h2>
                        <div className="space-y-6">
                            {/* Batch */}
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Batch Year</label>
                                <select
                                    value={selectedFilters.batch}
                                    onChange={(e) =>
                                        setSelectedFilters({ ...selectedFilters, batch: e.target.value })
                                    }
                                    className="select-control"
                                >
                                    <option value="">All</option>
                                    <option value="2018">2018</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                </select>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Department</label>
                                <select
                                    value={selectedFilters.department}
                                    onChange={(e) =>
                                        setSelectedFilters({ ...selectedFilters, department: e.target.value })
                                    }
                                    className="select-control"
                                >
                                    <option value="">All</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Location</label>
                                <select
                                    value={selectedFilters.location}
                                    onChange={(e) =>
                                        setSelectedFilters({ ...selectedFilters, location: e.target.value })
                                    }
                                    className="select-control"
                                >
                                    <option value="">All</option>
                                    <option value="New York">New York</option>
                                    <option value="San Francisco">San Francisco</option>
                                    <option value="Austin">Austin</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Users Grid */}
                    <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-6 box-shadow-primary transition-all duration-300 flex justify-center items-center"
                                >
                                    <div className="flex flex-col items-center text-center my-auto">
                                        <img
                                            src={user.profilePic || "/assets/img/placeholder-profile.avif"}
                                            alt={user.fullName}
                                            className="w-24 h-24 rounded-full border-4 border-purple-500 mb-4 hover:scale-110 transition-transform duration-300"
                                        />
                                        <h3 className="text-xl font-bold">{user.fullName}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {user.position} at {user.company}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {user.batch} • {user.department}
                                        </p>
                                        <div className="flex gap-4 mt-5">
                                            <Link href={`/profile/${user._id}`}>
                                                <button className="flex items-center gap-2 btn bg-purple-500 rounded-md transition-all">
                                                    <Eye size={18} /> Profile
                                                </button>
                                            </Link>
                                            <Link href={`/chatbox/${user._id}`}>
                                                <button className="flex items-center gap-2 btn btn-outline-primary rounded-md">
                                                    <MessageCircle size={18} /> Message
                                                </button>
                                            </Link>
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
