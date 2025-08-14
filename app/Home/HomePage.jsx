"use client";

import { Users, Briefcase, MessageSquare, Calendar, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Typed from "typed.js";


export default function HomePage() {

  const typedElement = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Connecting Alumni & Students for a Brighter Future",
        "Building Strong Alumni Networks",
        "Empowering Students with Mentorship",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="bg-gray-950 text-gray-100 h-screen flex flex-col">

      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-l from-black via-gray-950 to-black py-32 px-6 text-center min-h-full flex flex-col justify-center items-center">
        <h1 className="text-bold text-4xl sm:text-[100px] font-edu-custom text-with-yellow-outline">A modern platform</h1>
        <p className="my-4 sm:my-8 max-w-2xl mx-auto text-md sm:text-2xl">
          To build alumni-student connections, mentorship, and career growth opportunities.
        </p>
        {/* ✅ Animated Typing Text */}
        <div className="text-md sm:text-2xl text-purple-400 font-semibold flex justify-center">
          <span ref={typedElement}></span>
        </div>

        <div className="flex space-x-7 justify-center items-center my-10 md:my-15 md:text-xl text-bold">
          <Link
            href="/signup"
            className="flex items-center gap-3 bg-gradient-to-l btn btn-gradient-yellow "
          >
            <span>Join Now</span> <span><Users className="w-5 h-5 text-amber-800 mx-auto" /></span>
          </Link>

          <Link
            href="/about"
            className="btn btn-outline-hover-yellow"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-[#ffffff] text-shadow-[0_0_6px_#a431d5] underline underline-offset-10 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-12 h-12 text-[#a431d5] mx-auto" />}
            title="Alumni Directory"
            desc="Easily find and connect with alumni from your institution."
          />
          <FeatureCard
            icon={<GraduationCap className="w-12 h-12 text-[#a431d5] mx-auto" />}
            title="Mentorship Pairing"
            desc="Get matched with alumni mentors based on your career goals."
          />
          <FeatureCard
            icon={<Briefcase className="w-12 h-12 text-[#a431d5] mx-auto" />}
            title="Job & Internship Board"
            desc="Access exclusive job postings and internship opportunities."
          />
          <FeatureCard
            icon={<MessageSquare className="w-12 h-12 text-[#a431d5] mx-auto" />}
            title="Discussion Forum"
            desc="Engage in technical discussions and share knowledge."
          />
          <FeatureCard
            icon={<Calendar className="w-12 h-12 text-[#a431d5] mx-auto" />}
            title="Event Scheduling"
            desc="Join webinars, alumni meets, and reunions easily."
          />
        </div>
      </section>

      {/* ✅ About Section */}
      <section className=" max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-with-yellow-outline mb-4">About Alumni Hub VDT</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Alumni Hub VDT (Virtual Discussion Table) bridges the gap between alumni and students,
            enabling knowledge sharing, mentorship, and professional networking for technical education.
            We focus on building a connected community that empowers future professionals.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="About Alumni Hub"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-gray-950 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Alumni Hub VDT. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-3">
          <a href="#" className="hover:text-[#a431d5] transition">Facebook</a>
          <a href="#" className="hover:text-[#a431d5] transition">LinkedIn</a>
          <a href="#" className="hover:text-[#a431d5] transition">Twitter</a>
        </div>
      </footer>
    </div>

  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-950 border border-gray-700 shadow-[0_0_5px_#a431d5] rounded-lg p-6  hover:shadow-[0_0_10px_#a431d5] hover:border-[#a431d5fd] transition duration-1000 transform hover:scale-105">
      {icon}
      <h3 className="text-xl font-semibold mt-4 text-[#ffffff] text-shadow-[0_0_6px_#a431d5]">{title}</h3>
      <p className="text-gray-400 mt-2">{desc}</p>
    </div>
  );
}
