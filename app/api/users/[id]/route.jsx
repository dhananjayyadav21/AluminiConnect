import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET user by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (Update user by ID)
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updatedUser = await User.findByIdAndUpdate(id, body, {
            new: true, // return updated doc
            runValidators: true,
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
