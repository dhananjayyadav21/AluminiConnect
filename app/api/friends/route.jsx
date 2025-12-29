import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
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

// GET - Get user's friends list
export async function GET(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(decoded.userId).populate(
            "friends",
            "fullName email profilePic position company batch department location phone linkedin github"
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ friends: user.friends || [] });
    } catch (error) {
        console.error("Error fetching friends:", error);
        return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
    }
}

// DELETE - Remove a friend
export async function DELETE(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const friendId = searchParams.get("friendId");

        if (!friendId) {
            return NextResponse.json({ error: "Friend ID is required" }, { status: 400 });
        }

        await connectDB();

        // Remove from both users' friends lists
        await Promise.all([
            User.findByIdAndUpdate(decoded.userId, {
                $pull: { friends: friendId },
            }),
            User.findByIdAndUpdate(friendId, {
                $pull: { friends: decoded.userId },
            }),
        ]);

        return NextResponse.json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error("Error removing friend:", error);
        return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
    }
}

