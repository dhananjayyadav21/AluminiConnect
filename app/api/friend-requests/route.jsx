import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";
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

// GET - Get all friend requests (sent and received)
export async function GET(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Get received requests with sender details
        const receivedRequests = await FriendRequest.find({
            receiver: decoded.userId,
            status: "pending",
        })
            .populate("sender", "fullName email profilePic position company batch department")
            .sort({ createdAt: -1 });

        // Get sent requests with receiver details
        const sentRequests = await FriendRequest.find({
            sender: decoded.userId,
            status: "pending",
        })
            .populate("receiver", "fullName email profilePic position company batch department")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            received: receivedRequests,
            sent: sentRequests,
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
    }
}

// POST - Send a friend request
export async function POST(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { receiverId } = await request.json();

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
        }

        if (receiverId === decoded.userId) {
            return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 });
        }

        await connectDB();

        // Check if users exist
        const [sender, receiver] = await Promise.all([
            User.findById(decoded.userId),
            User.findById(receiverId),
        ]);

        console.log("Sender ID from token:", decoded.userId);
        console.log("Receiver ID from request:", receiverId);
        console.log("Sender found:", sender ? "Yes" : "No");
        console.log("Receiver found:", receiver ? "Yes" : "No");

        if (!sender || !receiver) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already friends
        if (sender.friends.includes(receiverId)) {
            return NextResponse.json({ error: "Already friends" }, { status: 400 });
        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: decoded.userId, receiver: receiverId },
                { sender: receiverId, receiver: decoded.userId },
            ],
            status: "pending",
        });

        if (existingRequest) {
            return NextResponse.json({ error: "Friend request already exists" }, { status: 400 });
        }

        // Create friend request
        const friendRequest = await FriendRequest.create({
            sender: decoded.userId,
            receiver: receiverId,
        });

        // Update user arrays
        await Promise.all([
            User.findByIdAndUpdate(decoded.userId, {
                $addToSet: { friendRequestsSent: receiverId },
            }),
            User.findByIdAndUpdate(receiverId, {
                $addToSet: { friendRequestsReceived: decoded.userId },
            }),
        ]);

        return NextResponse.json({
            message: "Friend request sent successfully",
            friendRequest,
        });
    } catch (error) {
        console.error("Error sending friend request:", error);
        return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
    }
}

