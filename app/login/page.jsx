"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [role, setRole] = useState("Student");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                localStorage.setItem("token-edunet", data?.token);
                localStorage.setItem("userRole-edunet", data?.user?.role);
                localStorage.setItem("userId-edunet", data?.user?.id);

                // Update Navbar immediately
                window.dispatchEvent(new Event("auth-status-change"));

                router.push("/");
                setFormData({ email: "", password: "" });
                toast.success(" Login successful!");
            } else {
                toast.error(data.error || "Invalid credentials");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    return (

        <>
            {/* 🔥 Full-screen Loader Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#1a1a1a] relative overflow-hidden pt-16 px-2">
                {/* Background */}
                <Image
                    src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
                    alt="Collaboration"
                    fill
                    className="object-cover opacity-10"
                    priority
                />

                {/* Floating Icons */}
                <div className="absolute top-10 left-10 text-[#32a8a8] opacity-40 text-6xl animate-bounce pt-24">💻</div>
                <div className="absolute bottom-10 right-10 text-[#32a8a8] opacity-40 text-6xl animate-pulse">🌐</div>

                {/* Login Box */}
                <div className="bg-[#0d0d0d]/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-[#2b2b2b]">
                    <h2 className="text-3xl font-bold text-center text-with-secondary-outline mb-6">Login</h2>

                    {/* Role Toggle */}
                    <div className="flex justify-center space-x-4 mb-6">
                        {["Student", "Alumni"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setRole(option)}
                                type="button"
                                className={`btn btn-outline-yellow transition ${role === option
                                    ? "bg-gradient-to-l to-amber-300 from-amber-50 text-amber-700"
                                    : "bg-[#1a1a1a] text-amber-500"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input-control"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="input-control"
                        />
                        <button type="submit" className="btn-full btn-gradient-secondary">
                            Login
                        </button>
                    </form>

                    <p className="text-gray-400 text-center mt-4">
                        Don’t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-with-secondary-outline hover:underline underline-offset-4 transition duration-1000 ease-in"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
