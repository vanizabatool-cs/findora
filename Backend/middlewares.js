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

module.exports=checkUniversityMail;


const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       return res.json({
            message:"You are not LoggedIn"
        })
    }
    next();
}

module.exports=isLoggedIn;