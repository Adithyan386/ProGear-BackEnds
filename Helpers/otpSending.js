const nodemailer = require('nodemailer')

//otp sending
const otpSending = async(email,otp)=>{
   try {
     const transporter = nodemailer.createTransport({
         service:'Gmail',
         auth:{
             user: process.env.EMAIL,
             pass: process.env.PASS
         }
     })
 
     const mailoptions = {
         from: process.env.EMAIL,
         to:email,
         subject:'OTP For Your Account Verification..!',
         html:`Your OTP For Account Verification is ${otp}`
     }
 
     transporter.sendMail(mailoptions,(err,info)=>{
         if(err)
             return err
     })
   } catch (error) {
    console.log(error);
    throw err
   }
}

module.exports = otpSending