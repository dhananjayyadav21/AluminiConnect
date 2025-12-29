import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        resumeContent: { type: String, required: true },
        coverLetter: { type: String },
        status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

export default mongoose.models.JobApplication || mongoose.model("JobApplication", JobApplicationSchema);
