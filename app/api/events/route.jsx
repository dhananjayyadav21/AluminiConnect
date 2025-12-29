import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().populate("organizer", "fullName role").sort({ createdAt: -1 });
        return NextResponse.json(events);
    } catch (err) {
        console.error("Fetch Events Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
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

        if (decoded.role !== "Alumni" && decoded.role !== "Admin") {
            return NextResponse.json({ error: "Only Alumni can create events" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, date, time, link } = body;

        if (!title || !description || !date || !time || !link) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newEvent = await Event.create({
            title,
            description,
            date,
            time,
            link,
            organizer: decoded.userId,
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (err) {
        console.error("Create Event Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
