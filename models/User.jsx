import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
    year: String,
    degree: String,
    institution: String,
});

const WorkSchema = new mongoose.Schema({
    year: String,
    position: String,
    company: String,
});

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Student", "Alumni"], default: "Student" },

        // Profile fields
        profilePic: {
            type: String,
        },
        position: String,
        company: String,
        batch: String,
        department: String,
        location: String,
        bio: String,

        // Extra fields
        phone: String,
        linkedin: String,
        github: String,
        website: String,

        // Add arrays
        education: [EducationSchema],
        work: [WorkSchema],

        // Skills
        skills: [{ type: String }],

        // Friend management
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
