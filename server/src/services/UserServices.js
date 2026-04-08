const { hash } = require("bcrypt");
const {
   findAllUsers,
   findAllDefaultUsers,
   findUserById,
   findUserByName,
   findUserLoggedInfoById,
   createNewUser,
   updateUserStatus,
   updateUser,
   findAndCountAllUsers,
} = require("../repositories/UserRepository.js");

const ExistsDataError = require("../classes/ExistsDataError.js");
const NotFoundError = require("../classes/NotFoundError.js");
const CannotUpdateError = require("../classes/CannotUpdateError.js");
const { removeAllAcentsForString } = require("../utils/DataFormatUtil.js");
const bcrypt = require("bcrypt");

async function getAllUsersService() {
   const users = await findAllUsers();
   return users;
}

async function getAllDefaultUsersService() {
   const defaultUsers = await findAllDefaultUsers();
   return defaultUsers;
}

async function getUserByIdService(idUser) {
   const user = await findUserById(Number(idUser));
   return user;
}

async function getUserLoggedByIdService(idUser) {
   const user = await findUserLoggedInfoById(Number(idUser));
   return user;
}

async function createUserService(userInfo) {
   const { usuario, senha, nivel_acesso } = userInfo;
   const formattedUser = usuario && String(removeAllAcentsForString(usuario)).trim();
   const existsUser = await findUserByName(formattedUser);

   if(existsUser) {
      throw new ExistsDataError("Usuário já existe", "USER_EXISTS", {
         user_informado: formattedUser,
         user_existente: existsUser.usuario 
      })
   }

   const hashedPassword = await hash(senha, 10);
   const createdUser = await createNewUser({
      usuario: formattedUser,
      senha: hashedPassword,
      nivel_acesso: Number(nivel_acesso)
   });
   return createdUser;
}

async function createFirstUserService(userInfo) {
   const { usuario, senha } = userInfo;
   const formattedUser = String(removeAllAcentsForString(usuario)).trim();
   const { total_users } = await findAndCountAllUsers();

   if(total_users > 0) {
      throw new ExistsDataError("Já existe um usuário cadastrado!", "USER_EXISTS", {
         total_users: total_users
      })
   }

   const hashedPassword = await hash(senha, 10);
   const createdUser = await createNewUser({
      usuario: formattedUser,
      senha: hashedPassword,
   });
   
   return createdUser;   
}

async function changeStatusUserService(idUser, newStatus) {
   const formattedNewStatus = newStatus.toUpperCase();
   const user = await getUserByIdService(idUser);

   if(!user) {
      throw new NotFoundError("Usuário não cadastrado!");
   }

   const currStatus = user.status.toUpperCase();

   if (formattedNewStatus !== "ATIVO" && formattedNewStatus !== "INATIVO") {
      throw new ExistsDataError("Status inexistente", "STATUS_UNKNOWN", {
         status_passado: newStatus,
         status_esperado: ["ATIVO", "INATIVO"],
      });
   }
   if (currStatus === formattedNewStatus) {
      throw new ExistsDataError(`O Usuário já está ${newStatus.toUpperCase()}`, "STATUS_EQUAL", {
         status_passado: newStatus,
         status_atual: currStatus,
      });
   }

   const updatedUser = await updateUserStatus(idUser, formattedNewStatus);
   return updatedUser;
}

async function changePasswordUserService(idUser, currPassword, newPassword) {
   const existsUser = await findUserById(Number(idUser));
   const { senha } = existsUser;

   if(!existsUser) {
      throw new NotFoundError("Usuário não encontrado");
   }

   const isValidPassword = await bcrypt.compare(String(currPassword), senha);

   if(!isValidPassword) {
      throw new CannotUpdateError("A senha atual está incorreta!");
   }

   const hashedPassword = await hash(newPassword, 10);

   const updatedUser = await updateUser(idUser, { senha: hashedPassword });
   
   return updatedUser;

}

module.exports = {
   getAllUsersService,
   getAllDefaultUsersService,
   getUserByIdService,
   getUserLoggedByIdService,
   createUserService,
   createFirstUserService,
   changeStatusUserService,
   changePasswordUserService
};
