const {
   getAllUsersService,
   getAllDefaultUsersService,
   getUserByIdService,
   createUserService,
   changeStatusUserService,
   getUserLoggedByIdService,
   createFirstUserService,
   changePasswordUserService,
} = require("../services/UserServices.js");
//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const AccessLevelError = require("../classes/AccessLevelError.js");

async function getAllUsers(req, res) {
   try {
      const allUsers = await getAllUsersService();
      return res.status(200).json(allUsers);

   } catch (error) {
      errorResponse(error, res);

   }
}

async function getAllDefaultUsers(req, res) {
   try {
      /*
      =============================================
              Verificação de nível de acesso
      =============================================
      */
      const { id } = req.userInfo;

      const existsUser = await getUserByIdService(id);

      if(!existsUser) {
         throw new NotFoundError("Usuário não encontrado", {
            fields: {
               id
            }
         })
      }

      const { nivel_acesso } = existsUser;
      
      if(nivel_acesso > 1) {
         throw new AccessLevelError("É necessário ser um Administrador para executar a ação", {
            fields: {
               nivel_acesso
            }
         })
      }

      const allDefaultUsers = await getAllDefaultUsersService();
      return res.status(200).json(allDefaultUsers);
      
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getUserById(req, res) {
   try {
      const id = Number(req.params.id);

      if(!id) {
         throw new FieldUndefinedError("Campo ID não identificado");
      }

      const user = await getUserByIdService(id);
      if (!user) {
         throw new NotFoundError("Usuário não encontrado!");
      }
      return res.status(200).json(user);

   } catch (error) {
      errorResponse(error, res);

   }
}

async function getUserLoggedById(req, res) {
   try {
      const { id } = req.userInfo;

      if(!id) {
         throw new FieldUndefinedError("Campo ID não identificado");
      }

      const user = await getUserLoggedByIdService(id);
      if (!user) {
         throw new NotFoundError("Usuário não encontrado!");
      }
      return res.status(200).json(user);

   } catch (error) {
      errorResponse(error, res);

   }
}

async function createUser(req, res) {
   try {
      /*
      =============================================
              Verificação de nível de acesso
      =============================================
      */
      const { id } = req.userInfo;

      const existsUser = await getUserByIdService(id);

      if(!existsUser) {
         throw new NotFoundError("Usuário não encontrado", {
            fields: {
               id
            }
         })
      }

      const { nivel_acesso } = existsUser;
      
      if(nivel_acesso > 1) {
         throw new AccessLevelError("É necessário ser um Administrador para executar a ação", {
            fields: {
               nivel_acesso
            }
         })
      }

      /*
      =============================================
                     Cadastro efetivo
      =============================================
      */
      const { 
         usuario: newUser_usuario, 
         senha: newUser_senha, 
         nivel_acesso: newUser_nivel_acesso 
      } = req.body;

      if(!newUser_usuario || !newUser_senha) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               usuario: newUser_usuario,
               senha: newUser_senha && "Senha encontrada"
            }
         })
      }

      const createdUser = await createUserService({ 
         usuario: newUser_usuario, 
         senha: newUser_senha, 
         nivel_acesso: newUser_nivel_acesso 
      });
      
      return res.status(201).json({
         status: "success",
         message: "Usuário cadastrado com sucesso!",
         data: createdUser
      });

   } catch (error) {
      errorResponse(error, res);
   }
}

async function createFirstUser(req, res) {
   try {
      const { usuario, senha } = req.body;

      if(!usuario || !senha) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               usuario,
               senha: senha && "Senha encontrada"
            }
         })
      }

      const createdUser = await createFirstUserService({ usuario, senha, nivel_acesso: 1 });

      if(createdUser) {
         return res.status(201).json({
            status: "success",
            message: "Primeiro usuário cadastrado com sucesso!",
            data: createdUser
         });
      }

      return res.status(500).json({
         status: "error",
         message: "Não foi possível cadastrar o primeiro usuário. Tente novamente mais tarde."
      })

      

   } catch (error) {
      errorResponse(error, res);
   }
}

async function changeStatusUser(req, res) {
   try {
      /*
      =============================================
              Verificação de nível de acesso
      =============================================
      */
      const { id } = req.userInfo;

      const existsUser = await getUserByIdService(id);

      if(!existsUser) {
         throw new NotFoundError("Usuário não encontrado", {
            fields: {
               id
            }
         })
      }

      const { nivel_acesso } = existsUser;
      
      if(nivel_acesso > 1) {
         throw new AccessLevelError("É necessário ser um Administrador para executar a ação", {
            fields: {
               nivel_acesso
            }
         })
      }

      /*
      =============================================
                     Edição efetiva
      =============================================
      */
      const idUser = Number(req.params.idUser);
      const { status } = req.body;

      if(!idUser || !status) {
         throw new FieldUndefinedError("Um ou mais campos não foram passados", {
            fields: {
               id: idUser,
               status
            }
         })
      }

      const [rowAffected] = await changeStatusUserService(idUser, status);

      if(rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "Status de usuário alterado com sucesso!",
         })
      }

   } catch (error) {
      errorResponse(error, res);
   }
}

async function changePasswordUser(req, res) {
   try {
      const { id } = req.userInfo;
      const { currPassword, newPassword } = req.body || { currPassword: undefined, newPassword: undefined };

      if(!currPassword || !newPassword) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               currPassword: currPassword && "senha atual encontrada",
               newPassword: newPassword && "nova senha encontrada"
            }
         })
      }

      const [rowAffected] = await changePasswordUserService(id, currPassword, newPassword);

      if(rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "Senha alterada com sucesso!",
         })
      }
   } catch (error) {
      errorResponse(error, res);
   }
   
}

module.exports = { 
   getAllUsers, 
   getAllDefaultUsers, 
   getUserById, 
   getUserLoggedById, 
   createUser,
   createFirstUser,
   changeStatusUser,
   changePasswordUser
};
