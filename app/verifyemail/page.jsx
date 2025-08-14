"use client";

import Image from "next/image";
import Link from "next/link";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 bg-black px-2">

            {/* Verify Email Card */}
            <div className="bg-[#0d0d0d]/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg z-10 border border-[#2b2b2b] text-center">
                <h2 className="text-3xl font-bold text-with-secondary-outline mb-4">Verify Your Email</h2>
                <p className="text-gray-300 mb-6">
                    We have sent a verification link to your email address.
                    Please check your inbox and click the link to verify your account.
                </p>

                {/* Illustration */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                        alt="Email Illustration"
                        width={100}
                        height={100}
                        className="opacity-100 bg-purple-300 py-2 px-4 rounded-lg"
                    />
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                    <button
                        className="btn-full btn-gradient-secondary rounded-lg"
                    >
                        Resend Email
                    </button>
                    <Link
                        href="/login"
                        className="block text-with-secondary-outline text-sm"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
