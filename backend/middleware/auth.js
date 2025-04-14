// ---clarify the admin or normal user---
const jwt = require('jsonwebtoken');
const secret_key = "my_jwt_secret_key";

//clarify the middleware of jwt
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"no token"});
    }

    //clarify the token usability
    jwt.verify(token,secret_key,(err,userData)=>{
        if(err){
            return res.status(403).json({message:'token unavailable'});
       }
       //add user info excrypted in token to request object
       req.user = userData;
       next();
    });
}



//verify the admin middleware
function isAdmin(req,res,next){
    if(!req.user ||req.user.role!=='admin'){
        return res.status(403).json({message:'no admin priority'});

    }
    next();
}

module.exports = { authenticateToken,isAdmin,secret_key};
