const CustomError = require("./CustomError.js");

class CannotDeleteError extends CustomError {
   constructor(message, code, details) {
      super(message, 400, {
         code,
         details
      })
   }
}


module.exports = CannotDeleteError;