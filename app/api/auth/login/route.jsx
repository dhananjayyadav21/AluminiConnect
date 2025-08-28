import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password, role } = await req.json();

        const user = await User.findOne({ email, role });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "1h" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
