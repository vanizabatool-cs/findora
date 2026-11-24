if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express=require("express");
const app=express();
const db=require("./config/db.js");
const ensureAdmin=require("./utils/ensureAdmin");
const mongoose=require("mongoose");
const UserRoute=require("./routes/User.js");
const User=require("./models/User.js");
const session=require("express-session");
const { MongoStore }=require("connect-mongo");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const ItemRoute=require("./routes/Items.js");
const cors=require("cors");
const path=require("path");
const port=Number(process.env.PORT)||5000;
const isProduction = process.env.NODE_ENV === "production";
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/findora";
const sessionSecret = process.env.SESSION_SECRET || "findora-dev-secret-change-me";

if (!process.env.SESSION_SECRET && !isProduction) {
    console.warn("Using a development SESSION_SECRET fallback. Set SESSION_SECRET in your .env for production safety.");
}

const configuredFrontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
app.use(cors({
    origin: (origin, callback) => {
        const isLocalDevelopmentOrigin = process.env.NODE_ENV !== "production" &&
            /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):\d+$/.test(origin || "");
        const isAllowedOrigin = !origin ||
            origin === "http://localhost:5000" ||
            origin === "http://localhost:5173" ||
            origin === "http://127.0.0.1:5173" ||
            origin === "http://0.0.0.0:5173" ||
            origin === "https://findora-full-stack-application.vercel.app" ||
            origin === configuredFrontendUrl ||
            isLocalDevelopmentOrigin;

        if (isAllowedOrigin) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("trust proxy", 1);
app.use(session({
    secret: sessionSecret,
    store: MongoStore.create({
        mongoUrl,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 3
    }),
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*60*24*3,
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction ? "none" : "lax"
    }
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/user",UserRoute);
app.use("/item",ItemRoute);

app.use((err,req,res,next)=>{
    const isUploadError = err.name === "MulterError";
    const status = isUploadError
        ? err.code === "LIMIT_FILE_SIZE" ? 413 : 400
        : err.name === "ValidationError" || err.name === "CastError"
        ? 400
        : err.status || 500;
    if (status >= 500) {
        console.error("REQUEST_FAILED:", err.http_code || err.code || err.name || "SERVER_ERROR");
    }
    return res.status(status).json({
        message: isUploadError
            ? err.code === "LIMIT_FILE_SIZE"
                ? "The image is too large to upload."
                : "The uploaded file could not be processed."
            : status >= 500
                ? "Something went wrong while processing the request."
                : err.message
    });
})

const startServer = async () => {
    console.log("Starting Findora backend...");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", process.env.PORT);
    console.log("Listening port:", port);

    await db();
    console.log("MongoDB initialization completed.");

    await ensureAdmin();
    console.log("Admin initialization completed.");

    app.listen(port, "0.0.0.0", () => {
        console.log(`Findora listening on 0.0.0.0:${port}`);
    });
};

startServer().catch(async(error)=>{
    console.error("SERVER_STARTUP_FAILED:",error.message);
    await mongoose.disconnect();
    process.exitCode=1;
});
