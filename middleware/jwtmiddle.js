const jwt = require('jsonwebtoken')

const jwtmiddleware = (req,res,next)=>{
    
    
    try{
        const token = req.headers['authorization'].split(' ')[1]
        // console.log(token);
        const jwtreponse = jwt.verify(token,'supersimplekey')
        // console.log(jwtreponse);
        
            req.playload = jwtreponse.id
            next()
        
        
    }catch(err){
        res.status(401).send('Authorization Failed.....Please Login')
    }
}

module.exports = jwtmiddleware