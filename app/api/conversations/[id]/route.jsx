import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";

// Helper to verify JWT token
function verifyToken(request) {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// GET - Get a specific conversation with all messages
export async function GET(request, { params }) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        // Verify user is part of the conversation
        const conversation = await Conversation.findById(id).populate(
            "participants",
            "fullName email profilePic position company"
        );

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isParticipant = conversation.participants.some(
            (p) => p._id.toString() === decoded.userId
        );

        if (!isParticipant) {
            return NextResponse.json({ error: "Unauthorized to access this conversation" }, { status: 403 });
        }

        // Get messages for this conversation
        const messages = await Message.find({ conversationId: id })
            .populate("sender", "fullName profilePic")
            .populate("receiver", "fullName profilePic")
            .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            {
                conversationId: id,
                receiver: decoded.userId,
                read: false,
            },
            { read: true }
        );

        return NextResponse.json({
            conversation,
            messages,
        });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
    }
}
