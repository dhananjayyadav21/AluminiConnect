import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import Job from "@/models/Job";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "YOUR_SECRET_KEY_HERE";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id: jobId } = await params;

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

        // Verify the job exists and belongs to the authenticated user
        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.postedBy.toString() !== decoded.userId) {
            return NextResponse.json({ error: "Unauthorized access to applications" }, { status: 403 });
        }

        const applications = await JobApplication.find({ jobId }).populate("applicantId", "fullName email profilePic position company");

        return NextResponse.json(applications, { status: 200 });
    } catch (err) {
        console.error("Fetch Applications Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
