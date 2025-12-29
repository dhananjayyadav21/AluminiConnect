import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageTime: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Ensure exactly 2 participants and prevent duplicates
ConversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
