const productmodel = require('../Models/productmodel')

//add product

exports.addproduct = async(req,res)=>{
    if(req.filevaildation){
        return res.status(406).send('Only png and jpg...!')
    }
    const  {name,ptype,price,description} = req.body
    const productimg = req.file.filename
     console.log(name,ptype);
     

    try{
        if(!name || !ptype || !price || !description || !productimg ){
        res.status(400).send({message:'Please Enter All Felids'})

    }else{
        const newproduct = new productmodel({
            productname:name,
            producttype:ptype,
            price:price,
            description:description,
            image:productimg
        })
        await newproduct.save()
        res.status(200).send({message:'Product Added',newproduct})
    }
}catch(err){
    res.status(500).send({message:'Internal Server Error'})
    console.log(err);
    }

}

//get product

exports.getproduct = async(req,res)=>{

    try{
        const products = await productmodel.find()
    res.status(200).send({products})
}catch(err){
    res.status(500).send({message:'Internl Server Error'})
    console.log(err);
}
}

//delete product

exports.deleteproduct = async(req,res)=>{
    try {
        const {id} = req.params
    
        const product = await productmodel.findByIdAndDelete(id)
        res.status(200).send({message:'Product Deleted.....!',product})
    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error);
    }
}

//edit product

exports.editproduct = async(req,res)=>{
    if(req.filevaildation){
        return res.status(406).send('Only png and jpg...!')
    }
    const {id} = req.params
    const {productname,producttype,price,description,productImage} = req.body
    const updateimg = req.file ? req.file.filename : productImage

   try {
     const updateproduct = await productmodel.findByIdAndUpdate(id,{
         productname,
         producttype,
         price,
         description,
         image:updateimg
     },{new:true})
     res.status(200).send({message:'Product Updated...!',updateproduct})
    
   } catch (error) { 
    res.status(500).send('Internal Server Error')
   } 
}

//get product based on catgory
exports.getcatgory = async(req,res)=>{
    const {producttype} = req.params

    try {
        const product= await productmodel.find({producttype})
        res.status(200).send({product})
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

