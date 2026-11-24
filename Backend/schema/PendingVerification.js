const mongoose = require("mongoose");

const pendingVerificationSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    otpHash: {
        type: String,
        required: true
    },

    otpExpiresAt: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model(
    "PendingVerification",
    pendingVerificationSchema
);