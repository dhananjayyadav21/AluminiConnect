"use client";

import Image from "next/image";
import Link from "next/link";
import { Target, Users, Lightbulb } from "lucide-react";

export default function AboutPage() {

    return (
        <div className="bg-black text-gray-100 min-h-screen font-sans">


            {/*  Hero Section */}
            <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/assets/img/about.jpeg"
                    alt="Alumni Interaction"
                    fill
                    className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-950/50 to-black backdrop-blur-xs"></div>


                <div className="relative z-10 min-h-full text-center px-4">
                    <h1 className="text-4xl md:text-7xl font-edu-custom text-with-secondary-outline animate-fadeIn drop-shadow-lg">
                        About EduNet Nexus
                    </h1>
                    <p className="my-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fadeIn delay-200">
                        Building strong connections between alumni and students through mentorship, networking, and career opportunities.
                    </p>
                    <div className="mt-10 flex justify-center items-center space-x-6">
                        <Link
                            href="/directory"
                            className="flex items-center gap-3 bg-gradient-to-l btn btn-gradient-secondary "
                        >
                            <span>Join Now</span> <span><Target className="w-5 h-5 text-amber-800 mx-auto" /></span>
                        </Link>

                        <Link
                            href="/directory"
                            className="flex items-center gap-3 btn btn-outline-hover-secondary "
                        >
                            <span>View members</span> <span><Users className="w-5 h-5 text-amber-800 mx-auto" /></span>
                        </Link>
                    </div>
                </div>
            </section>

            {/*  About Section */}
            <section className="bg-gradient-to-l to-black via-black from-purple-950 max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-with-secondary-outline mb-6 border-l-4 border-amber-200 pl-4">
                        Who We Are
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Alumni Hub VDT (Virtual Discussion Table) is a community-driven platform designed to
                        foster collaboration between alumni and students. Our goal is to empower learners with
                        real-world insights, professional guidance, and lifelong connections.
                    </p>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-xl hover:translate-x-10 hover:shadow-[0_0_20px_#d5d231] transition-transform duration-500 ">
                    <Image
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
                        alt="About Alumni"
                        width={600}
                        height={400}
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            </section>

            {/*  Mission Section */}
            <section className=" py-20 px-6 text-center relative">
                <h2 className="text-4xl font-extrabold text-with-primary-outline mb-15 tracking-wide underline underline-offset-10">
                    Our Mission
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { icon: Target, title: "Bridge the Gap", text: "Connecting alumni and students for knowledge sharing and career guidance." },
                        { icon: Users, title: "Build Community", text: "Create an engaging space for discussions, networking, and mutual growth." },
                        { icon: Lightbulb, title: "Empower Learners", text: "Provide insights, mentorship, and opportunities to shape future leaders." }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="box-shadow-primary transform hover:-translate-y-3 transition duration-300 backdrop-blur-sm border border-gray-800"
                        >
                            <item.icon className="text-primary w-14 h-14 mx-auto mb-5 drop-shadow-md" />
                            <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                            <p className="text-gray-400 mt-3 text-sm">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/*  Why Choose Us Section */}
            <section className="bg-gradient-to-l to-black via-purple-950 from-black max-w-7xl mx-auto py-20 px-6">
                <h2 className="text-4xl font-extrabold text-center text-with-secondary-outline mb-14">
                    Why Choose Us?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { emoji: "🤝", title: "Strong Network", text: "Access a growing community of alumni and professionals." },
                        { emoji: "🎓", title: "Mentorship Programs", text: "Get guidance from industry experts and alumni mentors." },
                        { emoji: "💼", title: "Career Opportunities", text: "Explore jobs, internships, and exclusive career events." }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="text-center box-shadow-secondary hover:-translate-x-3 transition transform duration-300 border border-gray-800"
                        >
                            <div className="text-6xl mb-4">{item.emoji}</div>
                            <h3 className="text-xl font-semibold text-secondary">{item.title}</h3>
                            <p className="text-gray-400 mt-3">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
