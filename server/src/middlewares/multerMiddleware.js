const multer = require("multer");
const errorResponse = require("../helper/ErrorResponseHelper.js");

function handleMulterErrors(err, req, res, next) {
   if(err instanceof multer.MulterError) {
      if(err.code === "LIMIT_UNEXPECTED_FILE") {
         return res.status(400).json({
            code: err.code,
            message: "Campo IMG não encontrado"
         })
      }
      if(err.code === "LIMIT_FILE_SIZE") {
         return res.status(413).json({
            code: err.code,
            message: "Imagem muito grande! Selecione uma de tamanho igual ou inferior a 1MB"
         })
      }
      else {
         return res.status(500).json({
            code: err.code,
            message: err.message
         })
      }
   } else {
      return errorResponse(err, res);

   }
   
}

module.exports = handleMulterErrors;