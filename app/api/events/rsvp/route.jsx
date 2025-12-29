import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

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

        const { eventId } = await req.json();
        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const userId = decoded.userId;
        const index = event.attendees.indexOf(userId);

        if (index === -1) {
            // Add user to attendees
            event.attendees.push(userId);
            await event.save();
            return NextResponse.json({ message: "RSVP successful", rsvp: true });
        } else {
            // Remove user from attendees (Toggle off)
            event.attendees.splice(index, 1);
            await event.save();
            return NextResponse.json({ message: "RSVP removed", rsvp: false });
        }
    } catch (err) {
        console.error("RSVP Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
