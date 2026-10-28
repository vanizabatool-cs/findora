const Items=require("./models/Item");

const matchingAlgo=async(otherItem)=>{
    const Items=await Item.find({type:"found"});
    const matches=[];    
    for(let item of Items){
        const score=matchingScore(item,OtherItem);
        matches.push({
            item:
            otherItem,
            score:score
        })
    }
    }



const matchingScore=(item,OtherItem)=>{
    let score=0;
    if(item.name==OtherItem.name)
        score+=16.6;
    else if(item.descripiton==OtherItem.description)
        score+=16.6;
    else if(item.category==OtherItem.category)
        score+=16.6;
    else if(item.color==OtherItem.color)
        score+=16.6;
    else if(item.location==OtherItem.location)
        score+=16.6;
    else if(item.type!=OtherItem.type)
        score+=16.6;
    return int(score);
}




module.exports={
    matchingScore,
    matchingAlgo
}

