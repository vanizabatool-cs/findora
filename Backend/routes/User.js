const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/User");
const checkUniversityMail=require("../middlewares.js");
const passport=require("passport");
const isLoggedIn=require("../middlewares.js");

router.post("/login",
    passport.authenticate("local")
    ,wrapAsync(async(req,res)=>{
    res.json({
        message:"LoggedIn Successfully"
    })
}))

router.get("/",wrapAsync(async(req,res)=>{
    res.json({
        user:req.user
    })
}))

router.post("/signup",checkUniversityMail,wrapAsync(async(req,res,next)=>{
    let userData=req.body;
    let user=await User.register({
        username:userData.username,
        email:userData.email
    },userData.password);   

    req.login(user,(err)=>{
        if(err)return next(err);
    res.json({
        message:"Signup Successfully"
    })})
}))


router.get("/logout",isLoggedIn,wrapAsync(async(req,res)=>{
    req.logout((err)=>{
    if(err)return next(err)
    res.json({
        message:"Logged Out Successfully"
    })
    })
}))

module.exports=router;