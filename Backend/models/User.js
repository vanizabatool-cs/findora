const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

let userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})


userSchema.plugin(passportLocalMongoose);
let User=mongoose.model("Uer",userSchema);

module.exports=User;