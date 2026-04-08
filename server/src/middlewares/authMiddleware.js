const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
   const authHeader = req.headers.authorization;

   if(!authHeader) {
      return res.status(401).json({
         code: "UNKNOWN_TOKEN",
         message: "Token não informado"
      })
   }
   const parts = authHeader.split(" ");
   const [scheme, token] = parts;

   if(parts.length !== 2 || !/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
         code: "INVALID_TOKEN",
         message: "Token inválido"
      })
   }

   try {
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      
      if(!decoded.id) {
         return res.status(401).json({
            code: "INVALID_TOKEN", 
            message: "Token inválido"
         })
      }

      const { id } = decoded;

      req.userInfo = { id };
      next();
      
   } catch (error) {
      return res.status(401).json(error);

   }


}

module.exports = authMiddleware;