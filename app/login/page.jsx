"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [role, setRole] = useState("Student");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#1a1a1a] relative overflow-hidden pt-16 px-2">
            {/* Background */}
            <Image
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
                alt="Collaboration"
                fill
                className="object-cover opacity-10"
                priority
            />

            {/* Floating Tech Icons */}
            <div className="absolute top-10 left-10 text-[#32a8a8] opacity-40 text-6xl animate-bounce pt-24">💻</div>
            <div className="absolute bottom-10 right-10 text-[#32a8a8] opacity-40 text-6xl animate-pulse">🌐</div>

            {/* Login Form */}
            <div className="bg-[#0d0d0d]/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-[#2b2b2b]">
                <h2 className="text-3xl font-bold text-center text-[#32a8a8] mb-6">Login</h2>

                {/* Toggle Buttons */}
                <div className="flex justify-center space-x-4 mb-6">
                    {["Student", "Alumni"].map((option) => (
                        <button
                            key={option}
                            onClick={() => setRole(option)}
                            className={`px-4 py-2 rounded-full font-semibold transition ${role === option ? "bg-[#32a8a8] text-black" : "bg-[#1a1a1a] text-white"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#2b2b2b] focus:ring-2 focus:ring-[#32a8a8]"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#2b2b2b] focus:ring-2 focus:ring-[#32a8a8]"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#32a8a8] text-black font-bold py-3 rounded-lg hover:bg-[#2b9494] transition transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-[#32a8a8] hover:underline">
                        Sign Up
                    </Link>
                </p>

                <p className="text-gray-400 text-center mt-4">
                    Verify email via recieve code{" "}

                    <Link href="/verifyemail" className="text-[#32a8a8] hover:underline">
                        verify
                    </Link>
                </p>
            </div>
        </div>
    );
}
