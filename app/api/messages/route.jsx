import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
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

// POST - Send a new message
export async function POST(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { conversationId, receiverId, content } = await request.json();

        if (!conversationId || !receiverId || !content) {
            return NextResponse.json(
                { error: "Conversation ID, receiver ID, and content are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Verify conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isParticipant = conversation.participants.some(
            (p) => p.toString() === decoded.userId
        );

        if (!isParticipant) {
            return NextResponse.json({ error: "Unauthorized to send message in this conversation" }, { status: 403 });
        }

        // Create message
        const message = await Message.create({
            conversationId,
            sender: decoded.userId,
            receiver: receiverId,
            content: content.trim(),
        });

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content.trim().substring(0, 100),
            lastMessageTime: new Date(),
        });

        // Populate sender details
        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "fullName profilePic")
            .populate("receiver", "fullName profilePic");

        return NextResponse.json({
            message: "Message sent successfully",
            data: populatedMessage,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

// GET - Get messages for a conversation
export async function GET(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
        }

        await connectDB();

        // Verify user is part of the conversation
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isParticipant = conversation.participants.some(
            (p) => p.toString() === decoded.userId
        );

        if (!isParticipant) {
            return NextResponse.json({ error: "Unauthorized to access these messages" }, { status: 403 });
        }

        // Get messages
        const messages = await Message.find({ conversationId })
            .populate("sender", "fullName profilePic")
            .populate("receiver", "fullName profilePic")
            .sort({ createdAt: 1 });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

