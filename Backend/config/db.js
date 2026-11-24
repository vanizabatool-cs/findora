const mongoose=require("mongoose");

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/findora";

async function main(){
    await mongoose.connect(mongoUrl);
    console.log("Database Connected Successfully...");
}

module.exports=main;