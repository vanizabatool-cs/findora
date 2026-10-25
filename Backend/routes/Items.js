const express=require("express");
const router=express.Router();
const Item=require("../models/Item");
const wrapAsync=require("../utils/wrapAsync")
const {isLoggedIn}=require("../middlewares");

router.route("/").get(wrapAsync(async(req,res)=>{
    let Items=await Item.find({});
    res.json({
        Items
    })
}))


.post(isLoggedIn,wrapAsync(async(req,res)=>{
    let itemData=req.body;
    itemData.postedBy=req.user._id;
   await Item.insertOne(itemData);
   res.json({
    message:"Posted Successfully"
   })
}));    

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    const item=await Item.findById(id);
    res.json({item});  
}));





module.exports=router;