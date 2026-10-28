const Item = require("./models/Item");

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
       return res.json({
            message:"You are not LoggedIn"
        })
    }
    next();
}


const isOwner=async(req,res,next)=>{
    const {id}=req.params;
    console.log("Reached in the middleware");
    let item=await Item.findOne({_id:id});
    console.log(item);
    if(!req.user._id.equals(item.postedBy)){
        return res.json({
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
    alreadyLoggedIn,
    isOwner
};