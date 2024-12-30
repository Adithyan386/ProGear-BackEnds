const express = require('express')

const router  = new express.Router()
const UserControl = require('../Controls/UserControl')
const jwtmiddleware = require('../middleware/jwtmiddle')
const adminware = require('../middleware/adminware')
const multerConfig = require('../middleware/multerware')
const productController = require('../Controls/productController')
const cartController = require('../Controls/CartController')
const userCart = require('../Models/cartModel')
const OrderPay = require('../Controls/OrderPayControl')

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

//get productdetails
router.get('/productdetails/:id',productController.getprouctdetails)

//add to cart
router.post('/add-cart/:userid',jwtmiddleware,cartController.addcart)

//get from cart
router.get('/getCart/:userid',jwtmiddleware,cartController.getproducts)

//delete cart
router.delete('/deletecart/:productId',jwtmiddleware,cartController.deleteCartProduct)

//get all product 
router.get('/showproduct',productController.ShowallProducts)

//otpverifiy
router.post('/otpverify',UserControl.otpVerification)

//otpresend
router.post('/resendotp',UserControl.otpResend)

//forgotpassword(mail)
router.post('/ResetPass',UserControl.forgottpassword)

//resetpassword
router.put('/password',UserControl.updatedpassword)

//google Sgin
router.post('/googlesign',UserControl.googleSign)

//orderpay
router.post('/orderpay',jwtmiddleware,OrderPay.payementController)

//orderproduct
router.post('/orderproduct',jwtmiddleware,OrderPay.OrderPayment)

//userOrder
router.get('/userOrder',jwtmiddleware,OrderPay.ViewOrders)

//admin order
router.get('/adminOrder',jwtmiddleware,adminware,OrderPay.OrderViewAdmin)

//pdf
router.post('/pdfgen',jwtmiddleware,OrderPay.pdfgenerator)

//getUser
router.get('/viewUserAdmin',jwtmiddleware,adminware,UserControl.getuserAdmins)

//product-review
router.put('/Review',jwtmiddleware,productController.Review)

//feedback
router.post('/Feedback',jwtmiddleware,UserControl.FeedBack)

///admin-feedback
router.get('/adminfeed',jwtmiddleware,adminware,UserControl.feedAdmin)

module.exports = router

