const mongoose=require("mongoose");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/LostLink");
}

main().then(()=>{
    console.log("Database Connected Successfully...");
}).catch((err)=>{
    console.log(err);
})

module.exports=main;