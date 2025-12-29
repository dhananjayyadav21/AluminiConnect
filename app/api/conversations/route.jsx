import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
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

// GET - Get all user conversations
export async function GET(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find all conversations where user is a participant
        const conversations = await Conversation.find({
            participants: decoded.userId,
        })
            .populate("participants", "fullName email profilePic position company")
            .sort({ lastMessageTime: -1 });

        // Format conversations to include the other participant
        const formattedConversations = conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
                (p) => p._id.toString() !== decoded.userId
            );
            return {
                _id: conv._id,
                participant: otherParticipant,
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                createdAt: conv.createdAt,
            };
        });

        return NextResponse.json({ conversations: formattedConversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

// POST - Create a new conversation
export async function POST(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { participantId } = await request.json();

        if (!participantId) {
            return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
        }

        if (participantId === decoded.userId) {
            return NextResponse.json({ error: "Cannot create conversation with yourself" }, { status: 400 });
        }

        await connectDB();

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [decoded.userId, participantId] },
        });

        if (existingConversation) {
            return NextResponse.json({ conversation: existingConversation });
        }

        // Verify both users exist and are friends
        const [user1, user2] = await Promise.all([
            User.findById(decoded.userId),
            User.findById(participantId),
        ]);

        if (!user1 || !user2) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if they are friends
        if (!user1.friends.includes(participantId)) {
            return NextResponse.json({ error: "Can only message friends" }, { status: 403 });
        }

        // Create new conversation
        const conversation = await Conversation.create({
            participants: [decoded.userId, participantId],
        });

        const populatedConversation = await Conversation.findById(conversation._id).populate(
            "participants",
            "fullName email profilePic position company"
        );

        return NextResponse.json({ conversation: populatedConversation });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}

