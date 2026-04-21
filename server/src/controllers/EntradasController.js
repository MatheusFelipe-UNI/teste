//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const CannotCreateError = require("../classes/CannotCreateError.js");
const {
   getAllEntradasProdutosService,
   getAllReceivedEntradasProdutosService,
} =require ("../services/EntradasServices.js");

/* 
============================================
NOTAS DO NATAN PARA O MATHEUS

- Os itens da Entrada já estão sendo passados pelo endpoint de criação e atualização de entrada de Produtos. Para mais informações de estrutura verifique os comentários deixados na função "createEntradaProduto" (Linha 149)

- Utilizar os nomes dos services que eu já deixei em cada controller (comecei a colocar esse comentário em cada chamada de service, mas fiquei com preguiça de colocar no resto então vou colocar aqui no topo kkkkk)
============================================
*/

async function getAllEntradasProdutos(req, res) {
   try {
      const allEntradasProdutos = await getAllEntradasProdutosService();
      return res.status(200).json(allEntradasProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllReceivedEntradasProdutos(req, res) {
   try {
      const allReceivedEntradasProdutos = await getAllReceivedEntradasProdutosService();
      return res.status(200).json(allReceivedEntradasProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllCanceledEntradasProdutos(req, res) {
   try {
      const allCanceledEntradasProdutos = await getAllCanceledEntradasProdutosService();
      return res.status(200).json(allCanceledEntradasProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllReceivedEntradasProdutosByFilterAndOrderBy(req, res) {
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

      const filteredEntradasProdutos = await getAllReceivedEntradasProdutosByFilterAndOrderByService(orderBy, filterOptions);

      return res.status(200).json(filteredEntradasProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllCanceledEntradasProdutosByFilterAndOrderBy(req, res) {
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

      const filteredEntradasProdutos = await getAllCanceledEntradasProdutosByFilterAndOrderByService(orderBy, filterOptions);
      
      return res.status(200).json(filteredEntradasProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getEntradaProdutoById(req, res) {
   try {
      const id = Number(req.params.id);

      if(!id) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               id,
            },
         });
      }

      const entradaProduto = await getEntradaProdutoByIdService(id);

      if(!entradaProduto) {
         throw new NotFoundError("Entrada de produto não encontrada", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(entradaProduto);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function changeEntradaProdutoStatus(req, res) {
   try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if(!id || !status) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id,
               status
            }
         })
      } 

      const [rowAffected] = await changeEntradaProdutoStatusService(id, status);

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

async function createEntradaProduto(req, res) {
   try {
      const {
         id_user,
         itens_entrada
      } = req.body || {
         id_user: undefined,
         itens_entrada: undefined
      };

      if(!id_user || !itens_entrada) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id_user: id_user || "Não encontrado",
               itens_entrada: itens_entrada || "Não encontrado"
            }
         })
      }

      const createdEntradaProduto = await createEntradaProdutoService({
         id_user,
         itens_entrada
      });

      if(!createdEntradaProduto) {
         throw new CannotCreateError("Não foi possível criar a entrada de produto", {
            data: {
               createdEntradaProduto
            }
         });

      }

      return res.status(201).json({
         status: "success",
         message: "Entrada de produto cadastrada com sucesso!"
      });

   } catch (error) {
      errorResponse(error, res);
   }
}

/*
========================================================
                   Itens Entradas
========================================================
*/

async function getAllEntradasProdutosItens(req, res) {
   try {
      const allEntradasProdutoItens = await getAllEntradasProdutosItensService();

      return res.status(200).json(allEntradasProdutoItens);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllEntradasProdutosItensByIdEntrada(req, res) {
   try {
      const idEntrada = Number(req.params.idEntrada);

      if(!idEntrada) {
         throw new FieldUndefinedError("Campo idEntrada não identificado", {
            fields: {
               idEntrada,
            },
         });
      }

      const allEntradasProdutoItens = await getAllEntradasProdutosItensByIdEntradaService(idEntrada);

      return res.status(200).json(allEntradasProdutoItens);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getEntradaProdutoItemById(req, res) {
   try {
      const id = Number(req.params.id);

      if (!id) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               id,
            },
         });
      }

      const entradaProdutoItem = await getEntradaProdutoItemByIdService(id);

      if (!entradaProdutoItem) {
         throw new NotFoundError("Item da entrada de produto não encontrado", {
            fields: {
               id,
            },
         });
      }

   } catch (error) {
      errorResponse(error, res);
   }
}

module.exports = {
   getAllEntradasProdutos,
   getAllReceivedEntradasProdutos,
   getAllCanceledEntradasProdutos,
   getAllReceivedEntradasProdutosByFilterAndOrderBy,
   getAllCanceledEntradasProdutosByFilterAndOrderBy,
   getEntradaProdutoById,
   changeEntradaProdutoStatus,
   createEntradaProduto,
   getAllEntradasProdutosItens,
   getAllEntradasProdutosItensByIdEntrada,
   getEntradaProdutoItemById
}