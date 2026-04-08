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

// Retorna todos os Produtos Cadastrados
async function getAllProdutos(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allProdutos = await getAllProdutosService();
      return res.status(200).json(allProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Produtos Ativos
async function getAllActiveProdutos(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allProdutos = await getAllActiveProdutosService();
      return res.status(200).json(allProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os Produtos Inativos
async function getAllInactiveProdutos(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allProdutos = await getAllInactiveProdutosService();

      return res.status(200).json(allProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todos os produtos ativos filtrados e/ou ordenados
async function getAllActiveProdutosByFilterAndOrderBy(req, res) {
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
      const filteredProdutos = await getAllActiveProdutosByFilterAndOrderByService(
         orderBy,
         filterOptions,
      );

      return res.status(200).json(filteredProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna o produto correspondente ao ID passado (se houver)
async function getProdutoById(req, res) {
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
      const produto = await getProdutoByIdService(id);

      if(!produto) {
         throw new NotFoundError("Produto não encontrado", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(produto);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera o status do produto baseando-se no STATUS passado
async function changeProdutoStatus(req, res) {
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
      const [rowAffected] = await changeProdutoStatusService(id, status);

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

// Cria um novo Produto
async function createProduto(req, res) {
   try {
      const {
         nome_produto,
         tipo_unidade,
         quantidade_estoque,
         estoque_minimo
      } = req.body;

      if(!nome_produto || 
         !tipo_unidade || 
         (quantidade_estoque === null || quantidade_estoque === undefined) || 
         (estoque_minimo === null || estoque_minimo === undefined)
      ) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               nome_produto: nome_produto || "Não encontrado",
               tipo_unidade: tipo_unidade || "Não encontrado",
               quantidade_estoque: quantidade_estoque || "Não encontrado",
               estoque_minimo: estoque_minimo || "Não encontrado",
            }
         })
      }

      const createdProduto = await createProdutoService({
         nome_produto,
         tipo_unidade,
         quantidade_estoque,
         estoque_minimo
      })

      if(!createdProduto) {
         throw new CannotCreateError("Erro ao cadastrar Produto", {
            data: {
               createdProduto
            }
         })
      }

      return res.status(201).json({
         status: "success",
         message: "Produto cadastrado com sucesso!"
      })

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera os dados do produto
async function updateProduto(req, res) {
   try {
      const id = Number(req.params.id);

      const {
         nome_produto,
         tipo_unidade,
         quantidade_estoque,
         estoque_minimo
      } = req.body;

      if(!id || (!nome_produto && 
                 !tipo_unidade && 
                 (quantidade_estoque === null || quantidade_estoque === undefined) &&
                 (estoque_minimo === null || quantidade_estoque)
                )
      ) {
         throw new FieldUndefinedError("Um ou mais campos obrigatórios não identificados", {
            dados_passados: {
               id: id || "Não encontrado",
               nome_produto: nome_produto || "Não encontrado",
               tipo_unidade: tipo_unidade || "Não encontrado",
               quantidade_estoque: quantidade_estoque || "Não encontrado",
               estoque_minimo: estoque_minimo || "Não encontrado",
            }
         })
      }

      const [rowAffected] = await updateProdutoService(id, {
         nome_produto,
         tipo_unidade,
         quantidade_estoque,
         estoque_minimo
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
   getAllProdutos,
   getAllActiveProdutos,
   getAllInactiveProdutos,
   getAllActiveProdutosByFilterAndOrderBy,
   getProdutoById,
   changeProdutoStatus,
   createProduto,
   updateProduto
};
