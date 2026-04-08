const path = require("path");
const multer = require("multer");
const InvalidTypeError = require("../classes/InvalidTypeError.js");

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/uploads");
   },
   filename: (req, file, cb) => {
      const extFile = path.extname(file.originalname).toLocaleLowerCase();

      cb(null, `${Date.now()}${extFile}`)
   }
})

const fileFilter = (req, file, cb) => {
   const extFile = path.extname(file.originalname).toLowerCase();
   const extValid = new RegExp(/.(jpg|png|jpeg|webp)$/gi);
   if(!extFile.match(extValid)) {
       return cb(new InvalidTypeError("Formato de arquivo inválido", {
         extensao_passada: extFile,
         extensao_esperada: ["jpg", "png", "jpeg", "webp"]
       }));
   }


   cb(null, true);
}

const upload = multer({storage, limits: {fileSize: 1024*1024}, fileFilter});

module.exports = upload;