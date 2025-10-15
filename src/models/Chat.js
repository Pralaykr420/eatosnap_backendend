import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
    lastMessage: {
      text: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
