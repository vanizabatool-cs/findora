const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    lostItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    foundItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    similarity: {
        type: Number,
        required: true,
        min: 70,
        max: 100
    },
    status: {
        type: String,
        enum: ["open", "claimed", "closed"],
        default: "open",
        required: true
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    claimedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: { createdAt: true, updatedAt: true }
});

matchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
