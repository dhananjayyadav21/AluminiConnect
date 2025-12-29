import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

export async function GET(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        let requester = null;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                requester = await User.findById(decoded.userId);
            } catch (err) {
                console.error("Token verification failed in users API:", err);
            }
        }

        const query = requester ? { _id: { $ne: requester._id } } : {};
        const users = await User.find(query).select("-password").sort({ createdAt: -1 });

        // Add friend status if requester exists
        const usersWithStatus = users.map(user => {
            let friendStatus = "none";

            if (requester) {
                const userIdStr = user._id.toString();

                if (requester.friends.some(id => id.toString() === userIdStr)) {
                    friendStatus = "friends";
                } else if (requester.friendRequestsSent.some(id => id.toString() === userIdStr)) {
                    friendStatus = "sent";
                } else if (requester.friendRequestsReceived.some(id => id.toString() === userIdStr)) {
                    friendStatus = "received";
                }
            }

            return {
                ...user.toObject(),
                friendStatus
            };
        });

        return NextResponse.json(usersWithStatus, { status: 200 });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
