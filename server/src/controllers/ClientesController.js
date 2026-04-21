//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const CannotCreateError = require("../classes/CannotCreateError.js");

const {
   getAllClientesService,
   getAllActiveClientesService,
   getAllInactiveClientesService,
   getAllActiveClientesByFilterAndOrderByService,
   getClienteByIdService,
   changeClienteStatusService,
   createClienteService,
   updateClienteService,
} = require("../services/ClientesServices.js")

/* 
============================================
NOTAS DO NATAN PARA O MATHEUS

- Utilizar os nomes dos services que eu já deixei em cada controller (comecei a colocar esse comentário em cada chamada de service, mas fiquei com preguiça de colocar no resto então vou colocar aqui no topo kkkkk)
============================================
*/

// Retorna todos os Clientes Cadastrados
async function getAllClientes(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allClientes = await getAllClientesService();
      return res.status(200).json(allClientes);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Clientes Ativos
async function getAllActiveClientes(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allClientes = await getAllActiveClientesService();
      return res.status(200).json(allClientes);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Clientes Inativos
async function getAllInactiveClientes(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allClientes = await getAllInactiveClientesService();

      return res.status(200).json(allClientes);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os clientes ativos filtrados e/ou ordenados
async function getAllActiveClientesByFilterAndOrderBy(req, res) {
   try {
      const { orderBy, filterOptions } = req.query;

      if (!orderBy && !filterOptions) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               orderBy: orderBy || "NÃO ENCONTRADO",
               filterOptions: filterOptions || "NÃO ENCONTRADO",
            },
         });
      }

      // Utilizar esse Nome de função para os services
      const filteredClientes = await getAllActiveClientesByFilterAndOrderByService(
         orderBy,
         filterOptions,
      );

      return res.status(200).json(filteredClientes);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna o cliente do ID passado
async function getClienteById(req, res) {
   try {
      const id = Number(req.params.id);

      if (!id) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               id,
            },
         });
      }

      // Utilizar esse Nome de função para os services
      const cliente = await getClienteByIdService(id);

      if (!cliente) {
         throw new NotFoundError("Cliente não encontrado", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(cliente);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera o status do cliente baseando-se no STATUS passado
async function changeClienteStatus(req, res) {
   try {
      const id = Number(req.params.id);
      let { status } = req.body;

      if (!id || !status) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id,
               status
            }
         })
      }

      // Utilizar esse Nome de função para os services
      const [rowAffected] = await changeClienteStatusService(id, status);

      if (rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "STATUS alterado com sucesso"
         })
      }


   } catch (error) {
      errorResponse(error, res);
   }
}

// Cria um novo cliente
async function createCliente(req, res) {
   try {
      const {
         nome_cliente,
         telefone,
         tipo_cliente,
         cpf_cnpj,
      } = req.body;

      if (!nome_cliente || !telefone || !tipo_cliente || !cpf_cnpj) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               nome_cliente: nome_cliente || "Não encontrado",
               telefone: telefone || "Não encontrado",
               tipo_cliente: tipo_cliente || "Não encontrado",
               cpf_cnpj: cpf_cnpj || "Não encontrado"
            }
         })
      }

      const createdCliente = await createClienteService({
         nome_cliente,
         telefone,
         tipo_cliente,
         cpf_cnpj
      })

      if (!createdCliente) {
         throw new CannotCreateError("Erro ao cadastrar Cliente", {
            data: {
               createdCliente
            }
         })
      }

      return res.status(201).json({
         status: "success",
         message: "Cliente cadastrado com sucesso!"
      })

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera os dados do cliente
async function updateCliente(req, res) {
   try {
      const id = Number(req.params.id);

      const {
         nome_cliente,
         telefone,
         tipo_cliente,
         cpf_cnpj
      } = req.body;

      if (!id || (!nome_cliente && !telefone && !tipo_cliente && !cpf_cnpj)) {
         throw new FieldUndefinedError("Um ou mais campos obrigatórios não identificados", {
            dados_passados: {
               id: id || "Não encontrado",
               nome_cliente: nome_cliente || "Não encontrado",
               telefone: telefone || "Não encontrado",
               tipo_cliente: tipo_cliente || "Não encontrado",
               cpf_cnpj: cpf_cnpj || "Não encontrado"
            }
         })
      }

      const [rowAffected] = await updateClienteService(id, {
         nome_cliente,
         telefone,
         tipo_cliente,
         cpf_cnpj
      })

      if (rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "Alterações Realizadas com sucesso!"
         })
      }

   } catch (error) {
      errorResponse(error, res);
   }
}

module.exports = {
   getAllClientes,
   getAllActiveClientes,
   getAllInactiveClientes,
   getAllActiveClientesByFilterAndOrderBy,
   getClienteById,
   changeClienteStatus,
   createCliente,
   updateCliente
};
