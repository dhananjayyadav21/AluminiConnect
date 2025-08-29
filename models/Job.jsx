import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String },
        requirements: [{ type: String }],
        tech: [{ type: String }],
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
