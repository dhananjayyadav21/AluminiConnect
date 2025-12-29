"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [role, setRole] = useState("Student");
    const [loading, setloading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        department: "",
        skills: "",
    });
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setloading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role,
                    skills: formData.skills.split(",").map((s) => s.trim()),
                }),
            });

            const data = await res.json();
            setloading(false);

            if (res.ok) {
                setTimeout(() => {
                    router.push("/login");
                }, 1000);
                toast.success("Registered successfully!");
                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    department: "",
                    skills: "",
                });
            } else {
                toast.error(` ${data.error}`);
            }
        } catch (err) {
            toast.error("⚠️ Something went wrong");
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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#1a1a1a] relative overflow-hidden">
                <div className="pt-20 px-3 pb-5">
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

                    {/* Signup Box */}
                    <div className="bg-[#0d0d0d] bg-opacity-95 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg z-10 border border-[#2b2b2b]">
                        <h2 className="text-2xl font-semibold text-center text-with-secondary-outline mb-6">Sign Up</h2>

                        {/* Role Toggle */}
                        <div className="flex justify-center space-x-4 mb-6">
                            {["Student", "Alumni"].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setRole(option)}
                                    type="button"
                                    className={`btn btn-outline-secondary transition ${role === option
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
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="input-control"
                            />
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
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="input-control"
                            >
                                <option value="">Select Department</option>
                                <option>Computer Science</option>
                                <option>IT</option>
                                <option>Electronics</option>
                            </select>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="Skills (comma separated)"
                                className="input-control"
                            />
                            <button type="submit" className="btn btn-full btn-gradient-secondary">
                                Sign Up
                            </button>
                        </form>

                        <p className="text-gray-400 text-center mt-4">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-with-secondary-outline hover:underline underline-offset-4 transition duration-1000 ease-in"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
