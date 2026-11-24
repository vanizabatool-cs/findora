const Item = require("./models/Item");
const mongoose = require("mongoose");

const checkUniversityMail=(req,res,next)=>{
    let {email}=req.body;
    if(email.toLowerCase().endsWith("khp@iba-suk.edu.pk")){
        next();
    }else{
        return res.json({
            message:"Please LoggedIn With Your Univeristy Mail"}
        )
    }
}


const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       return res.status(401).json({
            message:"You are not LoggedIn"
        })
    }
    next();
}

const isAdmin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.status(401).json({ message:"You are not logged in" });
    }
    if(req.user.role !== "admin"){
        return res.status(403).json({ message:"Admin access required" });
    }
    next();
}


const isOwner=async(req,res,next)=>{
    const {id}=req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({message:"Invalid item ID"});
    }
    let item=await Item.findById(id);
    if(!item){
        return res.status(404).json({message:"Item not found"});
    }
    if(!req.user._id.equals(item.postedBy)){
        return res.status(403).json({
            message:"You are not the owner"
        })
     }
     next();
}


const alreadyLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
    return res.json({
        message:"You are already LoggedIn"
    })}
    next();
}



module.exports = {
    checkUniversityMail,
    isLoggedIn,
    isAdmin,
    alreadyLoggedIn,
    isOwner
};