const cartModel = require('../Models/cartModel')

//add to cart

exports.addcart = async(req,res)=>{
    const {userid} = req.params
    const {id,count} = req.body

   try {
     const exisitingUser = await cartModel.findOne({userid})

     if(exisitingUser){
        const product =  exisitingUser.product.find(p=>p.productId == id)
        if(product){
            product.count +=1
        }else{
            exisitingUser.product.push({productId:id,count})
        }
        await exisitingUser.save()
         res.status(200).send({message:'Product Added to Cart...!',exisitingUser})
     }else{
         const CartData =  new cartModel({
             userid,
             product:{productId:id,count}
         })
         await CartData.save()
         res.status(200).send('Product Added to Cart')
     }
   } catch (error) {
        res.status(500).send('Internal Server Error...!')
        console.log(error);
   }
}

//get cart

exports.getproducts = async(req,res)=>{
    const {userid} = req.params

    try {
        const products = await cartModel.findOne({userid}).populate('product.productId','productname image price')
        console.log(products);
    
        if(!products){
            return res.status(404).send('Cart Not Found')
        }
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }
}

//delete cart

exports.deleteCartProduct = async(req,res)=>{
    const userid = req.payload
    
    // console.log(userid);
    
    const {productId} = req.params

    try {
        const Cartdata = await cartModel.findOne({userid:userid})
        // console.log(Cartdata);
        
        if(!Cartdata){
            return res.status(404).send({message:'Cart Not Found For This User..!'})
        }
        Cartdata.product = Cartdata.product.filter((p=>p.productId!=productId))
        await Cartdata.save()
        res.status(200).send({message:'items Removed',Cartdata})
    
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log(error);
    }}