function errorResponse(error, res) {
   console.error(error);
   const errMessage = error.message;
   if (error.statusCode) {
      return res.status(error.statusCode).json({...error, errMessage});
   } else {
      if(error.name === "SequelizeConnectionRefusedError") {
         return res.status(500).json({...error, errMessage: "Não foi possível estabelecer a conexão com o Banco de dados"});
      }
      return res.status(500).json({...error, errMessage: "Erro inesperado"});
      
   }
}

module.exports = errorResponse;