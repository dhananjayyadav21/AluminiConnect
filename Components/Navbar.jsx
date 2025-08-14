"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black text-white shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* ✅ Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-[#a431d5] text-2xl font-bold">
                            EduNet Nexus <span className="text-gray-400 text-sm hidden md:inline">| Find Your Next Opportunity</span>
                        </Link>
                    </div>

                    {/* ✅ Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="hover:text-[#a431d5] hover:underline hover:underline-offset-5 transition duration-500 ease-in-out">Home</Link>
                        <Link href="/about" className="hover:text-[#a431d5] hover:underline hover:underline-offset-5 transition duration-500 ease-in-out">About</Link>
                        <Link href="/directory" className="hover:text-[#a431d5] hover:underline hover:underline-offset-5 transition duration-500 ease-in-out">Directory</Link>
                        <Link href="/jobs" className="hover:text-[#a431d5] hover:underline hover:underline-offset-5 transition duration-500 ease-in-out">Jobs</Link>
                        <Link href="/eventspage" className="hover:text-[#a431d5] hover:underline hover:underline-offset-5 transition duration-500 ease-in-out">Events</Link>

                        <Link
                            href="/login"
                            className="btn-sm btn-outline-hover-yellow"
                        >
                            Login
                        </Link>
                    </div>

                    {/* ✅ Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(true)}
                            aria-label="Open Menu"
                            className="focus:outline-none"
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Fullscreen Mobile Menu with Blur */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fadeIn">
                    {/* ✅ Top Section with Logo & Close Button */}
                    <div className="absolute top-4 left-4 text-[#a431d5] text-2xl font-bold">
                        EduNet Nexus
                    </div>
                    <button
                        className="absolute top-4 right-4 text-white hover:text-[#a431d5] transition"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={32} />
                    </button>

                    {/* ✅ Menu Links */}
                    <div className="flex flex-col items-center space-y-8 text-xl mt-10">
                        <Link href="/" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link href="/about" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>About</Link>
                        <Link href="/directory" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>Directory</Link>
                        <Link href="/jobs" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>Jobs</Link>
                        <Link href="/eventspage" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>Events</Link>
                        <Link href="/forum" className="hover:text-[#a431d5]" onClick={() => setIsOpen(false)}>Forum</Link>
                        <Link
                            href="/login"
                            className="btn btn-outline-hover-yellow"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
