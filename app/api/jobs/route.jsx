import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

// GET all jobs
export async function GET(req) {
    try {
        await connectDB();
        const jobs = await Job.find().populate("postedBy", "fullName role email");
        return NextResponse.json(jobs, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST a new job (Alumni only)
export async function POST(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        console.log(token)
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        console.log(decoded)


        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.role !== "Alumni") return NextResponse.json({ error: "Only Alumni can post jobs" }, { status: 403 });

        const body = await req.json();
        const job = await Job.create({ ...body, postedBy: user._id });

        return NextResponse.json(job, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

