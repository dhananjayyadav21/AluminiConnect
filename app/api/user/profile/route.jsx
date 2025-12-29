import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

// GET logged-in user
export async function GET(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PUT update logged-in user
export async function PUT(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const body = await req.json();

        const updatedUser = await User.findByIdAndUpdate(decoded.userId, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

