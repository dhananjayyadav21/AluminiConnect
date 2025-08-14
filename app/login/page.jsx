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
                <h2 className="text-3xl font-bold text-center text-with-yellow-outline mb-6">Login</h2>

                {/* Toggle Buttons */}
                <div className="flex justify-center space-x-4 mb-6">
                    {["Student", "Alumni"].map((option) => (
                        <button
                            key={option}
                            onClick={() => setRole(option)}
                            className={`btn btn-outline-yellow transition ${role === option ? "bg-gradient-to-l to-amber-300 from-amber-50 text-amber-700" : "bg-[#1a1a1a] text-amber-500"
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
                        className="input-control"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-control"
                    />
                    <button
                        type="submit"
                        className="btn-full btn-gradient-yellow"
                    >
                        Login
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-with-yellow-outline hover:underline  underline-offset-4 transition duration-1000 ease-in">
                        Sign Up
                    </Link>
                </p>

                <p className="text-gray-400 text-center mt-4">
                    Verify email via recieve code{" "}

                    <Link href="/verifyemail" className="text-with-yellow-outline hover:underline  underline-offset-4 transition duration-1000 ease-in">
                        verify
                    </Link>
                </p>
            </div>
        </div>
    );
}
