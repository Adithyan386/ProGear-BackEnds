const express = require('express')

const router  = new express.Router()
const UserControl = require('../Controls/UserControl')
const jwtmiddleware = require('../middleware/jwtmiddle')
const adminware = require('../middleware/adminware')
const multerConfig = require('../middleware/multerware')
const productController = require('../Controls/productController')

//user register
router.post('/register',UserControl.register)

//user login
router.post('/login',UserControl.login)

//addproduct
router.post('/productadd',jwtmiddleware,adminware,multerConfig.single("productImage"),productController.addproduct)

//viewproduct
router.get('/viewProduct',jwtmiddleware,adminware,productController.getproduct)

//delete product

router.delete('/deleteproduct/:id',jwtmiddleware,adminware,productController.deleteproduct)

//edit product 
router.put('/editproduct/:id',jwtmiddleware,adminware,multerConfig.single("productImage"),productController.editproduct)

//product cat
router.get('/getproduct/:producttype',productController.getcatgory)


module.exports = router

