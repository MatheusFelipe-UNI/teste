const CustomError = require("./CustomError.js");

class CannotCreateError extends CustomError {
   constructor(message, details) {
      super(message, 500, {
         code: "CANNOT_CREATE_DATA",
         details
      })
   }
}

module.exports = CannotCreateError;