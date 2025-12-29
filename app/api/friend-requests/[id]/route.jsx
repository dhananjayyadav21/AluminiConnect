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

// PUT - Accept a friend request
export async function PUT(request, { params }) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const friendRequest = await FriendRequest.findById(id);

        if (!friendRequest) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
        }

        // Verify the user is the receiver
        if (friendRequest.receiver.toString() !== decoded.userId) {
            return NextResponse.json({ error: "Unauthorized to accept this request" }, { status: 403 });
        }

        if (friendRequest.status !== "pending") {
            return NextResponse.json({ error: "Request already processed" }, { status: 400 });
        }

        // Update friend request status
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add to friends list for both users
        await Promise.all([
            User.findByIdAndUpdate(friendRequest.sender, {
                $addToSet: { friends: friendRequest.receiver },
                $pull: { friendRequestsSent: friendRequest.receiver },
            }),
            User.findByIdAndUpdate(friendRequest.receiver, {
                $addToSet: { friends: friendRequest.sender },
                $pull: { friendRequestsReceived: friendRequest.sender },
            }),
        ]);

        return NextResponse.json({
            message: "Friend request accepted",
            friendRequest,
        });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return NextResponse.json({ error: "Failed to accept friend request" }, { status: 500 });
    }
}

// DELETE - Reject or cancel a friend request
export async function DELETE(request, { params }) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const friendRequest = await FriendRequest.findById(id);

        if (!friendRequest) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
        }

        // Verify the user is either sender or receiver
        const isSender = friendRequest.sender.toString() === decoded.userId;
        const isReceiver = friendRequest.receiver.toString() === decoded.userId;

        if (!isSender && !isReceiver) {
            return NextResponse.json({ error: "Unauthorized to delete this request" }, { status: 403 });
        }

        // Update status to rejected
        friendRequest.status = "rejected";
        await friendRequest.save();

        // Remove from user arrays
        await Promise.all([
            User.findByIdAndUpdate(friendRequest.sender, {
                $pull: { friendRequestsSent: friendRequest.receiver },
            }),
            User.findByIdAndUpdate(friendRequest.receiver, {
                $pull: { friendRequestsReceived: friendRequest.sender },
            }),
        ]);

        return NextResponse.json({
            message: "Friend request rejected",
        });
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return NextResponse.json({ error: "Failed to reject friend request" }, { status: 500 });
    }
}
