const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/User");
const Item=require("../models/Item");
const Match=require("../models/Match");
const passport=require("passport");
const generateOtp=require("../utils/generateOtp");
const { sendOtpEmail } = require("../controllers/SendEmail");
const {
    checkUniversityMail,
    isLoggedIn,
    isAdmin,
    alreadyLoggedIn
} = require("../middlewares");

const publicUser = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
});


router.post(
    "/login",
    alreadyLoggedIn,
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json({
                    message: "LoggedIn Successfully!",
                    user: publicUser(req.user)
                });
            });
        })(req, res, next);
    }
);


    

router.get("/",wrapAsync(async(req,res)=>{
    res.json({
        user:req.isAuthenticated() ? publicUser(req.user) : null
    })
}))

router.get("/admin/users", isAdmin, wrapAsync(async (req, res) => {
    const users = await User.find({
        $or: [
            { role: "user" },
            { role: { $exists: false } }
        ]
    })
        .select("username email role")
        .sort({ username: 1 });
    res.json({ users });
}));

router.delete("/admin/users/:id", isAdmin, wrapAsync(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.role === "admin") {
        return res.status(404).json({ message: "User not found" });
    }

    const itemIds = await Item.find({ postedBy: user._id }).distinct("_id");
    if (itemIds.length) {
        await Match.deleteMany({
            $or: [
                { lostItem: { $in: itemIds } },
                { foundItem: { $in: itemIds } }
            ]
        });
        await Item.deleteMany({ _id: { $in: itemIds } });
    }
    await Match.updateMany(
        { claimedBy: user._id },
        { $set: { claimedBy: null, claimedAt: null } }
    );
    await user.deleteOne();

    res.json({ message: "User and their reports deleted successfully" });
}));


const otpStore = new Map();
router.post("/send-otp", async (req, res) => {
    let email;
    try {
        email = req.body.email.trim().toLowerCase();
        const user=await User.findOne({email:email});
        if(user){
             throw new Error("Email is already registered.");
        }
        const otp = generateOtp();

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        await sendOtpEmail(email, otp);

        res.json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        if (email) otpStore.delete(email);
        const isRegisteredEmail = err.message === "Email is already registered.";
        console.error(
            "SEND_OTP_FAILED:",
            err.code || err.name || "ERROR",
            err.message || "Unknown error"
        );

        res.status(isRegisteredEmail ? 409 : 500).json({
            message: isRegisteredEmail
                ? err.message
                : "Unable to send verification email"
        });
    }
});

router.post("/verify-otp", wrapAsync(async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const { otp } = req.body;
    const storedData = otpStore.get(email);
    if (!storedData) {
        return res.status(400).json({
            status: "error",
            message: "OTP not found. Please request a new code."
        });
    }
    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);

        return res.status(400).json({
            status: "error",
            message: "OTP expired. Please request a new code."
        });
    }
    if (storedData.otp !== otp) {
        return res.status(400).json({
            status: "error",
            message: "Invalid OTP."
        });
    }
    otpStore.delete(email);
    res.json({
        status: "success",
        message: "Email verified successfully."
    });
}));

router.post("/signup",
    alreadyLoggedIn
    ,checkUniversityMail,wrapAsync(async(req,res,next)=>{
    let userData=req.body;
    let user=await User.register({
        username:userData.username,
        email:userData.email
    },userData.password);   

    req.login(user,(err)=>{
        if(err)return next(err);
    res.json({
        message:"Signup Successfully",
        user:{
            _id:req.user._id,
            username:req.user.username,
            email:req.user.email,
            role:req.user.role
        }
    })})
}))


router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout((logoutError) => {
        if (logoutError) return next(logoutError);

        req.session.destroy((sessionError) => {
            if (sessionError) return next(sessionError);

            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            });
            res.json({ message: "Logged Out Successfully" });
        });
    });
});

module.exports=router;