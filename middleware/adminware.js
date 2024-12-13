const userModel = require("../Models/usermodel")

const adminware = async(req,res,next)=>{
    const id  = req.playload
    const user = await userModel.findById(id)
    if(user.role === 1){
        return next()
    }
    return res.status(409).send("Access Deined")
}

module.exports = adminware