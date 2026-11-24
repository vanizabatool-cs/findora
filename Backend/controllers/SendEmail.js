
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const nodemailer = require("nodemailer");

const getMailer = () => {
    const user = process.env.SMTP_USER || process.env.USEREMAIL;
    const password = process.env.SMTP_PASSWORD || process.env.PASSWORD;

    if (!user || !password) {
        throw new Error("SMTP email is not configured. Check SMTP_USER and SMTP_PASSWORD in .env");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 30000,
        auth: {
            user,
            pass: password
        }
    });

    return {
        from: process.env.SMTP_FROM || user,
        transporter
    };
};

// Verify SMTP connection
const verifyMailer = async () => {
    try {
        const { transporter } = getMailer();
        await transporter.verify();
        console.log("Gmail SMTP connection successful!");
        return true;
    } catch (error) {
        console.error("SMTP verification failed:", error.message);
        return false;
    }
};

// Common email sender
const sendEmail = async (message) => {
    try {
        const { from, transporter } = getMailer();

        const info = await transporter.sendMail({
            from,
            ...message
        });

        console.log("Email sent successfully:", info.messageId);

        return info;
    } catch (error) {
        console.error("Email sending failed:", {
            message: error.message,
            code: error.code,
            response: error.response
        });

        throw error;
    }
};

// OTP verification email
const sendOtpEmail = async (email, otp) => {
    return sendEmail({
        to: email,
        subject: "Findora - Email Verification OTP",
        text: `Your Findora verification OTP is: ${otp}. It expires in 5 minutes. Never share your OTP with anyone.`
    });
};

// Lost item match notification
const sendMatchFoundEmail = async ({
    email,
    lostItem,
    foundItem,
    similarity,
    matchId
}) => {
    const appUrl = (
        process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    return sendEmail({
        to: email,
        subject: "A Possible Match Has Been Found for Your Lost Item – Findora",
        text: [
            "Hello,",
            "",
            "Good news! A possible match has been found for your lost item on Findora.",
            "",
            `Your lost item: ${lostItem.name}`,
            `Possible found item: ${foundItem.name}`,
            `Match similarity: ${similarity}%`,
            "",
            `Please log in to Findora and review the match: ${appUrl}/my-reports?match=${matchId}`,
            "",
            "Thank you for using Findora!"
        ].join("\n")
    });
};

// Found item claim notification
const sendClaimEmail = async ({
    email,
    finderName,
    claimantName,
    claimantEmail,
    foundItem
}) => {
    return sendEmail({
        to: email,
        subject: "Someone Has Claimed Your Found Item – Findora",
        text: [
            `Hello ${finderName || "Finder"},`,
            "",
            "Someone has submitted a claim for an item you reported as found on Findora.",
            "",
            `Claimant name: ${claimantName}`,
            `Claimant email: ${claimantEmail}`,
            `Found item: ${foundItem.name}`,
            "",
            "The claimant believes this item belongs to them. Please contact them using the email address above to verify ownership and coordinate its return.",
            "",
            "Thank you for helping reunite people with their belongings!"
        ].join("\n")
    });
};

module.exports = {
    sendOtpEmail,
    sendMatchFoundEmail,
    sendClaimEmail,
    verifyMailer
};
