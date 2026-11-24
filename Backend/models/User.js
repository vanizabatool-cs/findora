const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

let userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user",
        required:true
    }
})


userSchema.plugin(passportLocalMongoose);
let User=mongoose.model("User",userSchema);

module.exports=User;