//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const CannotCreateError = require("../classes/CannotCreateError.js");

/* 
============================================
NOTAS DO NATAN PARA O MATHEUS

- Utilizar os nomes dos services que eu já deixei em cada controller (comecei a colocar esse comentário em cada chamada de service, mas fiquei com preguiça de colocar no resto então vou colocar aqui no topo kkkkk)
============================================
*/

// Retorna todos os Fornecedores Cadastrados
async function getAllFornecedores(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allFornecedores = await getAllFornecedoresService();
      return res.status(200).json(allFornecedores);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Fornecedores Ativos
async function getAllActiveFornecedores(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allFornecedores = await getAllActiveFornecedoresService();
      return res.status(200).json(allFornecedores);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Fornecedores Inativos
async function getAllInactiveFornecedores(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allFornecedores = await getAllInactiveFornecedoresService();

      return res.status(200).json(allFornecedores);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os fornecedores ativos filtrados e/ou ordenados
async function getAllActiveFornecedoresByFilterAndOrderBy(req, res) {
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
      const filteredFornecedores = await getAllActiveFornecedoresByFilterAndOrderByService(
         orderBy,
         filterOptions,
      );

      return res.status(200).json(filteredFornecedores);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna o fornecedor correspondente ao ID passado (se houver)
async function getFornecedorById(req, res) {
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
      const fornecedor = await getFornecedorByIdService(id);

      if(!fornecedor) {
         throw new NotFoundError("Fornecedor não encontrado", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(fornecedor);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera o status do fornecedor baseando-se no STATUS passado
async function changeFornecedorStatus(req, res) {
   try {
      const id = Number(req.params.id);
      let { status } = req.body;

      if(!id || !status) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id,
               status
            }
         })
      }      
      
      // Utilizar esse Nome de função para os services
      const [rowAffected] = await changeFornecedorStatusService(id, status);

      if(rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "STATUS alterado com sucesso"
         })
      }


   } catch (error) {
      errorResponse(error, res);
   }
}

// Cria um novo Fornecedor
async function createFornecedor(req, res) {
   try {
      const {
         nome_fornecedor,
         cnpj,
      } = req.body;

      if(!nome_fornecedor || !cnpj) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               nome_fornecedor: nome_fornecedor || "Não encontrado",
               cnpj: cnpj || "Não encontrado",
            }
         })
      }

      const createdFornecedor = await createFornecedorService({
         nome_fornecedor,
         cnpj
      })

      if(!createdFornecedor) {
         throw new CannotCreateError("Erro ao cadastrar Fornecedor", {
            data: {
               createdFornecedor
            }
         })
      }

      return res.status(201).json({
         status: "success",
         message: "Fornecedor cadastrado com sucesso!"
      })

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera os dados do fornecedor
async function updateFornecedor(req, res) {
   try {
      const id = Number(req.params.id);

      const {
         nome_fornecedor,
         cnpj,
      } = req.body;

      if(!id || (!nome_fornecedor && !cnpj)) {
         throw new FieldUndefinedError("Um ou mais campos obrigatórios não identificados", {
            dados_passados: {
               id: id || "Não encontrado",
               nome_fornecedor: nome_fornecedor || "Não encontrado",
               cnpj: cnpj || "Não encontrado",
            }
         })
      }

      const [rowAffected] = await updateFornecedorService(id, {
         nome_fornecedor,
         cnpj,
      })

      if(rowAffected > 0) {
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
   getAllFornecedores,
   getAllActiveFornecedores,
   getAllInactiveFornecedores,
   getAllActiveFornecedoresByFilterAndOrderBy,
   getFornecedorById,
   changeFornecedorStatus,
   createFornecedor,
   updateFornecedor
};
