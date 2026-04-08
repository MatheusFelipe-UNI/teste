const CustomError = require("./CustomError.js");

class NotFoundError extends CustomError {
   constructor(message, details = "") {
      super(message, 404, {
         code: "DATA_NOT_FOUND",
         details
      })
   }
}

module.exports = NotFoundError;