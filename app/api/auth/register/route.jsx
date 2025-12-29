import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        await connectDB();

        const { fullName, email, password, role, department, skills } = await req.json();

        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            department,
            skills,
        });

        return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
    } catch (err) {
        console.error("Register Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

