import multer from "multer"

const storage = multer.diskStorage({
    destination: "./media/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()} ${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`${file.mimetype} is'nt supported by server`), false)
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter
}).array('pictures')

module.exports = upload