const mongoose=require("mongoose");

let itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },description:{
        type:String,
        required:true
    },category:{
        type:String,
        required:true,
        enum:["Laptop", "Mobile", "Books", "Accessories", "Other"]
    },color:{
        type:String,
        required:true
    },location:{
        type:String,
        required:true
    },type:{
        type:String,
        required:true,
        enum: {
            values:["lost", "found"],
            message:"Invalid Response"
        }
    },craetedAt:{
        type:String,
        required:true
    },status:{
        type:String,
        required:true,
        enum:["resolved","active"]
    },date:{
        type:Date,
        default:Date.now()
    },postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})


let Item=mongoose.model("Item",itemSchema);


module.exports=Item;
