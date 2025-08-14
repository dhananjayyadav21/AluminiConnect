"use client";

import { useState } from "react";
import { Search, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function AlumniDirectory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        batch: "",
        department: "",
        location: "",
    });

    const alumniData = [
        {
            id: 1,
            name: "John Doe",
            position: "Software Engineer",
            company: "Google",
            batch: "2018",
            department: "Computer Science",
            location: "New York",
            profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            id: 2,
            name: "Jane Smith",
            position: "Data Scientist",
            company: "Amazon",
            batch: "2019",
            department: "Information Technology",
            location: "San Francisco",
            profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
            id: 3,
            name: "Michael Brown",
            position: "UI/UX Designer",
            company: "Adobe",
            batch: "2020",
            department: "Design",
            location: "Austin",
            profilePic: "https://randomuser.me/api/portraits/men/48.jpg",
        },
    ];

    const filteredAlumni = alumniData.filter(
        (alumni) =>
            alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedFilters.batch === "" || alumni.batch === selectedFilters.batch) &&
            (selectedFilters.department === "" ||
                alumni.department === selectedFilters.department) &&
            (selectedFilters.location === "" || alumni.location === selectedFilters.location)
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans pt-16">
            {/* Hero Section */}
            <section className="text-center bg-gradient-to-r from-black via-gray-900 to-black py-12 px-6 shadow-md">
                <h1 className=" text-3xl md:text-4xl font-extrabold text-[#32a8a8] mb-3 tracking-wide drop-shadow-lg animate-pulse">
                    Find and Connect with Alumni Worldwide
                </h1>
                <p className="text-gray-400 text-lg">
                    Search and filter alumni to build strong professional networks.
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-2xl mx-auto flex items-center bg-gray-900 rounded-xl border border-gray-700 hover:border-[#32a8a8] transition-all shadow-lg">
                    <input
                        type="text"
                        placeholder="Search by name, batch, location..."
                        className="w-full bg-transparent px-4 py-3 text-gray-300 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="px-4 text-[#32a8a8] hover:text-white transition">
                        <Search size={24} />
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-12">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                    <h2 className="text-xl font-semibold text-[#32a8a8] mb-6 border-b border-gray-700 pb-3">
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
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#32a8a8]"
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
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#32a8a8]"
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
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#32a8a8]"
                            >
                                <option value="">All</option>
                                <option value="New York">New York</option>
                                <option value="San Francisco">San Francisco</option>
                                <option value="Austin">Austin</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Alumni Grid */}
                <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAlumni.length > 0 ? (
                        filteredAlumni.map((alumni) => (
                            <div
                                key={alumni.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#32a8a8] hover:scale-105 hover:shadow-[0_0_20px_#32a8a8] transition-all duration-300 shadow-md"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={alumni.profilePic}
                                        alt={alumni.name}
                                        className="w-24 h-24 rounded-full border-4 border-[#32a8a8] mb-4 hover:scale-110 transition-transform duration-300"
                                    />
                                    <h3 className="text-xl font-bold">{alumni.name}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {alumni.position} at {alumni.company}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {alumni.batch} • {alumni.department}
                                    </p>
                                    <div className="flex gap-4 mt-5">

                                        <Link href="/profile"><button className="flex items-center gap-2 bg-[#32a8a8] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#289494] transition-all">
                                            <Eye size={18} /> Profile
                                        </button></Link>

                                        <Link href="/chatbox"><button className="flex items-center gap-2 border border-[#32a8a8] text-[#32a8a8] px-4 py-2 rounded-lg hover:bg-[#1a1a1a]">
                                            <MessageCircle size={18} /> Message
                                        </button></Link>

                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 col-span-full text-center">
                            No alumni found with selected filters.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
