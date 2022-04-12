const JWT = require('jsonwebtoken');


module.exports = (req,res,nxt)=>{
   
    let token , decode;
   
    try{

        token = req.get("Authorization").split(" ")[1];
        decode= JWT.verify(token,process.env.SECRET_KEY);

        // console.log(token)
        // console.log(decode)
    }catch(err){
        err.message = "SORRY YOU AREN'T AUTHORIZED";
        err.status=403;
        nxt(err);
    }

    if(decode !== undefined){
        req.email = decode.email;
        req.check = decode.check;
        req.password = decode.password
        nxt();
    }
}

