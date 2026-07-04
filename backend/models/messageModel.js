import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    sender: { type: String, enum: ['user', 'doctor'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Number, required: true }
})

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema)
export default messageModel;
