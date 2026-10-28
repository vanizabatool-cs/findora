const express=require("express");
const router=express.Router();
const Item=require("../models/Item");
const wrapAsync=require("../utils/wrapAsync")
const {isLoggedIn,isOwner}=require("../middlewares");
const {matchingAlgo}=require("../Alogirthms");

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


router.get("/myposted/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const {id,category}=req.params;
    const postedItems=await Item.find({postedBy:id});
    console.log(postedItems);
    res.json({
        postedItems
    })
}));


router.delete("/delete/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Item.findByIdAndDelete(id);
    res.json({
        message:"Deleted Successfully"
    })
}))


router.get("/matchedItems/:id",wrapAsync(async(req,res)=>{
    let item=await Item.find({_id:req.params.id});
    let result=matchingAlgo(item);
    console.log(result);
    
    
}))

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    const item=await Item.findById(id);
    res.json({item});  
}));





module.exports=router;