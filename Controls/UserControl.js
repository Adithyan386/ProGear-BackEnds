const bcyrypt = require('bcrypt')
const userModel = require('../Models/usermodel')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const otpSending = require('../Helpers/otpSending')
const forgotpassword = require('../Helpers/Forgetpassword')
const { jwtDecode } = require('jwt-decode')
const { default: axios } = require('axios')
const ReviewModel = require('../Models/ReviewModel')


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
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets:false });
            const otpexpries = new Date(Date.now()+60*1000)
    
            const newUser = await new userModel({
                firstname:fname,
                secondname:sname,
                email,
                password:hashPassword,
                phone:'',
                address:'',
                gender:'',
                profilepic:'',
                otp,
                otpexpries
            })
    
            await newUser.save()
            await otpSending(email,otp)
            res.status(200).send({message:'New Use Added',newUser})
        }
    }catch(err){
        res.status(500).send('Internal Server Error')
        console.log(err);
    }
    }
}

//otpVerification
exports.otpVerification = async(req,res)=>{
    const {email,otp} = req.body
    try {
        if(!email || !otp){
            return res.status(400).send({message:'Invalid Email or OTP'})
        }
            const verifyUser = await userModel.findOne({email})

            if(!verifyUser){
                return res.status(404).send('User Not Founded')
            }
            if(verifyUser.otp!=otp){
                return res.status(400).send('Invaild OTP...Try Again..!')
            }
                const date = new Date(Date.now())
                if(verifyUser.otpexpries<date){
                    return res.status(410).send({message:'Time Expired'})
                }
                verifyUser.idVerified = true
                verifyUser.otp = null
                verifyUser.otpexpries = null
                await verifyUser.save()
                res.status(200).send({message:'Account Verified...'})
            
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
    }

    //otp resend
    exports.otpResend = async(req,res)=>{
        const {email,otp} = req.body

        try {
            const verifyUser = await userModel.findOne({email})
            if(!verifyUser){
                return res.status(404).send('User Not Founded')
            }
    
            const date = new Date(Date.now())
            if(verifyUser.otpexpries>date){
                return res.status(400).send({message:'OTP Not Expired'})
            }
    
            const newotp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets:false });
            const otpexpries = new Date(Date.now()+60*1000)
            verifyUser.otp = newotp
            verifyUser.otpexpries = otpexpries
            await verifyUser.save()
            await otpSending(email,newotp)
            res.status(200).send({message:'New OTP Sented'})
    
        } catch (error) {
            res.status(500).send('Internal Server Error')
            console.log(error);
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

//forgot password Mail
exports.forgottpassword = async(req,res)=>{
    // console.log('insidec forgot');
    
    const {email} = req.body
    console.log(req.body);

    try {
        const prevoisusers = await userModel.findOne({email})
        if(!prevoisusers){
            return res.status(404).send('Account Not Found')
        }else{
            const token = jwt.sign({id:prevoisusers._id},'supersimplekey',{expiresIn:'30m'})
            const base_URL = process.env.BASE_URL
            const restLink = `${base_URL}/ResetPass/${token}`
    
            await forgotpassword(email,restLink,prevoisusers.firstname,prevoisusers.secondname)
            res.status(200).send('Reset Link Sended...!')
        }
    } catch (err) {
        res.status(500).send('internal Server Error')
        console.log(err)
        
    }        
}

//reset password

exports.updatedpassword =async(req,res)=>{
    const {password,token} = req.body
    console.log(password);
    try {
        const Tokendecode = jwtDecode(token)
    
        const prevoisusers = await userModel.findById(Tokendecode.id)
    
        if(!prevoisusers){
            return res.status(404).send('Account Not Founded')
        }else{
            const saltRounds  = 10
            const hashPassword = await bcyrypt.hash(password,saltRounds)
            prevoisusers.password = hashPassword
            await prevoisusers.save()
            res.status(200).send('Password Changed...You Can Login Your Account')
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}

//google sgin

exports.googleSign = async(req,res)=>{
    const {GoogleToken} = req.body
    // console.log(GoogleToken);
    try {
        if(!GoogleToken){
            return res.status(400).send({message:'Token is Required'})
        }
    
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${GoogleToken}`)
    
        if(response.data.aud != process.env.CLINT_ID){
            return res.status(403).send({message:'Invaild Token'})
        }
    
        const firstname = response.data.given_name 
        const secondname = response.data.family_name
        const email = response.data.email
        const profilepic = response.data.profilepic
    
        const prevoisusers = await userModel.findOne({email})
    
        if(!prevoisusers){
            const newUser = new userModel({
                firstname,secondname,email,password:'',address:'',phone:'',gender:'',profilepic,otp:'',otpexpries:'',idVerified:true
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id},'supersimplekey')
            res.status(200).send({token,User:newUser})
        }
        const token = jwt .sign({id:prevoisusers._id},'supersimplekey')
        res.status(200).send({token,User:prevoisusers})
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);

    }
}

//get users
exports.getuserAdmins = async(req,res)=>{
    try {
        const userss = await userModel.find({role:0})
        res.status(200).send(userss)
    
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }}


//feedback
exports.FeedBack = async(req,res)=>{
    try {
        const {review,username,email} = req.body
        if(!review || !username || !email){
            return res.status(400).send('Fill All Feilds')
        }
        else{
            const newReview = await ReviewModel({
                review,username,email
            })
            await newReview.save()
            res.status(200).send(newReview)
        }
    } catch (error) {
        res.status(500).send({Message:'Internal Server Error'})
        console.log(error);
    }
}

//admin feedback view
exports.feedAdmin = async(req,res)=>{
    try {
        const userss = await ReviewModel.find()
        res.status(200).send(userss)
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}