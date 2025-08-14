"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
    const [role, setRole] = useState("Student");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#1a1a1a] relative overflow-hidden">

            <div className=" pt-20 px-3 pb-5">
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

                {/* Signup Form */}
                <div className="bg-[#0d0d0d] bg-opacity-95 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg z-10 border border-[#2b2b2b]">
                    <h2 className="text-3xl font-bold text-center text-with-secondary-outline mb-6">Sign Up</h2>

                    {/* Role Toggle */}
                    <div className="flex justify-center space-x-4 mb-6">
                        {["Student", "Alumni"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setRole(option)}
                                className={`btn btn-outline-secondary transition ${role === option ? "bg-gradient-to-l to-amber-300 from-amber-50 text-amber-700" : "bg-[#1a1a1a] text-amber-500"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-control"
                        />
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
                        <select
                            className="input-control"
                        >
                            <option>Department</option>
                            <option>Computer Science</option>
                            <option>IT</option>
                            <option>Electronics</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Skills (comma separated)"
                            className="input-control"
                        />
                        <button
                            type="submit"
                            className="btn btn-full btn-gradient-secondary"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-gray-400 text-center mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="text-with-secondary-outline hover:underline  underline-offset-4 transition duration-1000 ease-in">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
