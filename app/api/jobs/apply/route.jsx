import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

export async function GET(req) {
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

        const applications = await JobApplication.find({ applicantId: decoded.userId }).select("jobId");
        return NextResponse.json(applications);
    } catch (err) {
        console.error("Fetch Applied Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

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

        const body = await req.json();
        const { jobId, fullName, email, resumeContent, coverLetter } = body;

        if (!jobId || !fullName || !email || !resumeContent) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        // Check if already applied
        const existingApp = await JobApplication.findOne({ jobId, applicantId: decoded.userId });
        if (existingApp) {
            return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });
        }

        const application = await JobApplication.create({
            jobId,
            applicantId: decoded.userId,
            fullName,
            email,
            resumeContent,
            coverLetter,
        });

        return NextResponse.json(application, { status: 201 });
    } catch (err) {
        console.error("Apply Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
