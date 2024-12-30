const Razorpay = require("razorpay");
const PaymentModel = require("../Models/OrderPayModel");
const PDFDocument = require('pdfkit');

exports.payementController = async(req,res)=>{
    const {amount} = req.body
    // console.log(amount);
    try {
        const razorpay = new  Razorpay({
            key_id : process.env.KEY_ID,
    
            key_secret : process.env.KEY_SECRET
    
        })
    
        const options = {
            amount,
            currency:'INR'
        }
    
        const response = await razorpay.orders.create(options)
        res.status(200).send(response)
    
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}

//order

exports.OrderPayment = async(req,res)=>{
    const userID = req.payload
    // console.log(userID);
    
    const {
        productID,
        ShippingAddress,
        City,
        Status,
        Pincode,
        State,
        phone,
        amount,
        PaymentID
    } = req.body
    // console.log(req.body);
    

    if(!userID || !productID || !ShippingAddress || !City  || !Pincode || !State || !phone || !amount || !PaymentID){
        return res.status(400).send({message:'All Feilds Are Required'})
    }

    try {
        const newPayment = new PaymentModel({
            userID,
            productID,
            ShippingAddres:ShippingAddress,
            City,
            Status,
            Pincode,
            State,
            phone,
            Amount: amount,
            PaymentID
        })
    
        const savedPayment = await newPayment.save()
        res.status(201).send({savedPayment})
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}

//get order
exports.ViewOrders = async(req,res)=>{
    // console.log(

    //     "inside"
    // );
    
    const userID = req.payload

    try {
        const UserOrder = await PaymentModel.find({userID}).populate('productID','productname image').populate('userID','firstname email')
        if(!UserOrder || UserOrder.length === 0){
            return res.status(404).send({message:'Order Not Found'})
        }
        res.status(200).send(UserOrder)
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}

//get order admin
exports.OrderViewAdmin = async(req,res)=>{

    const userID = req.payload

 try {
       const getOrderAdmin = await PaymentModel.find().populate('productID','productname image')
         if(!getOrderAdmin || getOrderAdmin.length === 0){
       return res.status(404).send({message:'Order Not Found'})
   }
   
   res.status(200).send(getOrderAdmin)
   
 } catch (error) {
    res.status(500).send('Internal Server Error')
    console.log(error);

 }
}

//pdf generation

exports.pdfgenerator = async(req,res)=>{
    const {id} = req.body

    try {
        const orderdetails = await PaymentModel.findById(id).populate('userID','email')
    
         // Generate PDF in memory using PDFKit
         const doc = new PDFDocument();
            
         // Set response headers to indicate file download
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);
     
         // Pipe the PDF directly to the response
         doc.pipe(res);
     
         // Add content to the PDF
         doc.fontSize(20).text('Payment Receipt', { align: 'center' });
         doc.moveDown();
         doc.fontSize(12).text(`Order ID: ${orderdetails._id}`);
         doc.text(`Payment ID: ${orderdetails.PaymentID}`);
         doc.text(`Amount: ₹${orderdetails.Amount / 100}`); // Razorpay stores amount in paise
         doc.text(`Method: ${orderdetails.ShippingAddres}`);
         doc.text(`Status: ${orderdetails.Status}`);
         doc.text(`Email: ${orderdetails.userID.email}`);
         doc.text(`Contact: ${orderdetails.phone}`);
         doc.text(`Date: ${orderdetails.date}`);
    
     
         // Finalize the PDF and end the stream
         doc.end();
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);

    }

}

