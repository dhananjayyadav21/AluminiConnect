import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate requests
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.models.FriendRequest || mongoose.model("FriendRequest", FriendRequestSchema);
