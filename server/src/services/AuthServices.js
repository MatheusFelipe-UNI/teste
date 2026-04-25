const NotFoundError = require("../classes/NotFoundError.js");
const { findUserByName } = require("../repositories/UserRepository.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(id) {
   return jwt.sign({ id: id }, process.env.SECRET_TOKEN, { expiresIn: 604800 });
}

async function loginService(userName, password) {
   const existsUser = await findUserByName(userName.toLowerCase());

   if (!existsUser) {
      throw new NotFoundError("Usuário não encontrado", {
         status: "error",
         message: "Usuário incorreto ou não existe",
      });
   }

   const { id, usuario, nivel_acesso } = existsUser;

   const isValidPassword = await bcrypt.compare(password, existsUser.senha);

   if (!isValidPassword) {
      throw new NotFoundError("Senha incorreta", {
         status: "error",
         message: "Senha incorreta ou usuário não existe",
      });
   }

   const token = generateToken(id);

   return {
      token,
      usuario,
      nivel_acesso,
   };
}

module.exports = { loginService };
