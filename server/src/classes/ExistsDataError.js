const CustomError = require("./CustomError.js");


class ExistsDataError extends CustomError {
   constructor(message, codeRef = "", details = {}) {
      super(message, 409, {
         code: codeRef,
         details
      })
   }
}

module.exports = ExistsDataError;