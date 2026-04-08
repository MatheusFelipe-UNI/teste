class CustomError extends Error {
   constructor(message, statusCode, options = {}) {
      super(message);
      this.statusCode = statusCode;
      this.code = options.code || "";
      this.details = options.details || {};

      // Define o nome da classe (aparece no stack trace)
      this.name = this.constructor.name;

      // Preserva a stack trace (importante para debug)
      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, CustomError);
      }
   }
}

module.exports = CustomError;
