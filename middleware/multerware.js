const multer = require('multer')

const storage = multer.diskStorage({
    destination:(res,file,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        const filename = `Images${Date.now()}_${file.originalname}`
        callback(null,filename)
    }
})

const fileFilter = (req,file,callback)=>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        return callback(null,true)
    }
    req.filevaildation = 'only png added jpg file are allowed'
    callback(null,false)
}
const multerConfig = multer({storage,fileFilter})

module.exports = multerConfig