const express=require("express");
const app=express();
const db=require("./config/db.js");
const UserRoute=require("./routes/User.js");
const User=require("./models/User.js");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const ItemRoute=require("./routes/Items.js");
const port=8080;

app.listen(port,(req,res)=>{
    console.log("Server is Listening....");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:"supersecretkeyoflostlinkproject",
    saveUninitialized:true,
    resave:false,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpsOnly:true
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
    res.status(500).json({err:err.message||"Internal Server Error"})
})