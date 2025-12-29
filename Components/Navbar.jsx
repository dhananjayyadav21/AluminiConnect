"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/directory", label: "Directory" },
    { href: "/friends", label: "Friends" },
    { href: "/jobs", label: "Jobs" },
    { href: "/eventspage", label: "Events" },
    { href: "/myprofile", label: "My Profile" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check login on client-side only and on route change
    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem("token-edunet");
            setIsLoggedIn(!!token);
            setIsMounted(true);
        };

        checkLogin();

        // Listen to changes in localStorage for multi-tab support
        window.addEventListener("storage", checkLogin);
        // Custom event for immediate updates within the same tab
        window.addEventListener("auth-status-change", checkLogin);

        return () => {
            window.removeEventListener("storage", checkLogin);
            window.removeEventListener("auth-status-change", checkLogin);
        };
    }, [pathname]);

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.removeItem("token-edunet");
            localStorage.removeItem("userId-edunet");
            localStorage.removeItem("userRole-edunet");

            // Dispatch custom event to update Navbar immediately
            window.dispatchEvent(new Event("auth-status-change"));

            setIsLoggedIn(false);
            setLoading(false);
            toast.success("Logged out successfully");
            router.push("/login");
        }, 1000); // Reduced delay for smoother feel
    };

    const renderLinks = (closeMenu = false) =>
        NAV_LINKS.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#a431d5] transition hover:underline hover:underline-offset-5"
                onClick={() => closeMenu && setIsOpen(false)}
            >
                {link.label}
            </Link>
        ));

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                </div>
            )}

            <nav className="bg-black/80 backdrop-blur-md text-white shadow-lg border-b border-gray-800 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-purple-400 text-2xl font-bold">
                            <span className="text-with-primary-outline">EduNet</span> Nexus{" "}
                            <span className="text-gray-400 text-sm hidden xl:inline">
                                | Find Your Next Opportunity
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {renderLinks()}
                            {isMounted && (
                                <>
                                    {isLoggedIn && <NotificationBell />}
                                    {isLoggedIn ? (
                                        <button
                                            onClick={handleLogout}
                                            className="btn-sm btn-outline-hover-red flex items-center justify-center min-w-[80px]"
                                            disabled={loading}
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link href="/login" className="btn-sm btn-outline-hover-secondary">
                                            Login
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button onClick={() => setIsOpen(true)} aria-label="Open Menu">
                                <Menu size={28} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fadeIn">
                        <div className="absolute top-4 left-4 text-primary text-2xl font-bold">
                            EduNet Nexus
                        </div>
                        <button
                            className="absolute top-4 right-4 text-white hover:text-[#a431d5] transition"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        <div className="flex flex-col items-center space-y-8 text-xl mt-10">
                            {renderLinks(true)}
                            {isMounted && (
                                <>
                                    {isLoggedIn && <NotificationBell />}
                                    {isLoggedIn ? (
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="btn btn-outline-hover-red flex items-center justify-center min-w-[100px]"
                                            disabled={loading}
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="btn btn-outline-hover-secondary"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
