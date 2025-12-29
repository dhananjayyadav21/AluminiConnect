import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        link: { type: String, required: true },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
