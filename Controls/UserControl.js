const bcyrypt = require('bcrypt')
const userModel = require('../Models/usermodel')
const jwt = require('jsonwebtoken')

exports.register = async(req,res)=>{
    const {fname,sname,email,password} = req.body

    if(!fname || !sname || !email || !password){
        res.status(400).send('Fill The Form')
    }else{
       try{
        const prevoisusers = await userModel.findOne({email})
        if(prevoisusers){
            res.status(400).send("email already Exist")
        }else{
            const saltRounds  = 10
            const hashPassword = await bcyrypt.hash(password,saltRounds)
    
            const newUser = await new userModel({
                firstname:fname,secondname:sname,email,password:hashPassword,phone:'',address:'',gender:'',profilepic:''
            })
    
            newUser.save()
            res.status(200).send({message:'New Use Added',newUser})
    
        }
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
    }
}

//login

exports.login = async(req,res)=>{
    const {email,password} = req.body
    
  try {
      const prevoisusers = await userModel.findOne({email})
    //   console.log(prevoisusers);
          if(prevoisusers){
              const result = await bcyrypt.compare(password,prevoisusers.password)
              if(result){
                //genatring tokens
                  const token = jwt.sign({id:prevoisusers._id},'supersimplekey')
                  console.log(token);
                  res.status(200).send({token,prevoisusers})
              }else{
                  res.status(404).send({message:'Invaild Email or Password'})
              }
          }else{
              res.status(404).send({message:'Account Not found'})
          }
  } catch (error) {
    res.status(500).send({message:'Internal Server Error'})
    console.log(error);
  }
} 