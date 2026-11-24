const mongoose=require("mongoose");

let itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },description:{
        type:String,
        trim:true,
        default:""
    },category:{
        type:String,
        required:true,
        enum:[
            "Laptop", "Mobile", "Books", "Accessories", "Other",
            "Bags & Accessories", "Electronics", "Personal Items",
            "Books & Stationery", "Clothing", "Keys & Cards", "Documents"
        ]
    },color:{
        type:String,
        trim:true,
        default:""
    },location:{
        type:String,
        required:true
    },type:{
        type:String,
        required:true,
        enum: {
            values:["lost", "found"],
            message:"Invalid Response"
        },
        set:value=>typeof value==="string"?value.toLowerCase():value
    },
    status:{
        type:String,
        required:true,
        default:"active",
        enum:["resolved","active"]
    },date:{
        type:Date,
        default:Date.now
    },postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },imageUrl:{
        type:String,
        default:""
    }
})


let Item=mongoose.model("Item",itemSchema);


module.exports=Item;
