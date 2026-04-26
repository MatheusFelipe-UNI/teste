//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const CannotCreateError = require("../classes/CannotCreateError.js");

const {
   getAllLotesProdutosService,
   getAllActiveLotesProdutosService,
   getAllInactiveLotesProdutosService,
   getAllActiveLotesProdutosByFilterAndOrderByService,
   getAllLotesProdutosByFornecedorService,
   getLoteProdutoByIdService,
   getAllLotesProdutosByProdutoService,
   getAllActiveLotesProdutosByProdutoService,
   getAllInactiveLotesProdutosByProdutoService,
   getAllActiveLotesProdutosByProdutoWithFilterAndOrderByService,
   createLoteProdutoService,
   updateLoteProdutoService,
   changeLoteProdutoStatusService,
} = require ("../services/LotesProdutosServices.js");

/* 
============================================
NOTAS DO NATAN PARA O MATHEUS

- Os itens da Cesta já estão sendo passados pelo endpoint de criação e atualização de cesta. Para mais informações de estrutura verifique os comentários deixados na função "createCesta" (Linha 90)

- Utilizar os nomes dos services que eu já deixei em cada controller (comecei a colocar esse comentário em cada chamada de service, mas fiquei com preguiça de colocar no resto então vou colocar aqui no topo kkkkk)
============================================
*/

async function getAllLotesProdutos(req, res) {
   try {
      const allLotesProdutos = await getAllLotesProdutosService();
      return res.status(200).json(allLotesProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveLotesProdutos(req, res) {
   try {
      const allLotesProdutos = await getAllActiveLotesProdutosService();
      return res.status(200).json(allLotesProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllInactiveLotesProdutos(req, res) {
   try {
      const allLotesProdutos = await getAllInactiveLotesProdutosService();
      return res.status(200).json(allLotesProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveLotesProdutosByFilterAndOrderBy(req, res) {
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

      const filteredLotesProdutos = await getAllActiveLotesProdutosByFilterAndOrderByService(
         orderBy,
         filterOptions,
      );

      return res.status(200).json(filteredLotesProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllLotesProdutosByFornecedor(req, res) {
   try {
      const idFornecedor = Number(req.params.idFornecedor);

      if (!idFornecedor) {
         throw new FieldUndefinedError("ID do Fornecedor não identificado", {
            dados_passados: {
               idFornecedor: idFornecedor || "Não encontrado",
            },
         });
      }

      const lotesProdutos = await getAllLotesProdutosByFornecedorService(idFornecedor);

      return res.status(200).json(lotesProdutos);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getLoteProdutoById(req, res) {
   try {
      const id = Number(req.params.id);

      if (!id) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               id,
            },
         });
      }

      const loteProduto = await getLoteProdutoByIdService(id);

      if (!loteProduto) {
         throw new NotFoundError("Lote de produto não encontrado", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(loteProduto);

   } catch (error) {
      errorResponse(error, res);
   }

}

async function getAllLotesProdutosByProduto(req, res) {
   try {
      const idProduto = Number(req.params.idProduto);

      if (!idProduto) {
         throw new FieldUndefinedError("ID do Produto não identificado", {
            dados_passados: {
               idProduto: idProduto || "Não encontrado",
            },
         });
      }

      const lotesProdutos = await getAllLotesProdutosByProdutoService(idProduto);

      return res.status(200).json(lotesProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveLotesProdutosByProduto(req, res) {
   try {
      const idProduto = Number(req.params.idProduto);

      if (!idProduto) {
         throw new FieldUndefinedError("ID do Produto não identificado", {
            dados_passados: {
               idProduto: idProduto || "Não encontrado",
            },
         });
      }

      const lotesProdutos = await getAllActiveLotesProdutosByProdutoService(idProduto);

      return res.status(200).json(lotesProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllInactiveLotesProdutosByProduto(req, res) {
   try {
      const idProduto = Number(req.params.idProduto);

      if (!idProduto) {
         throw new FieldUndefinedError("ID do Produto não identificado", {
            dados_passados: {
               idProduto: idProduto || "Não encontrado",
            },
         });
      }

      const lotesProdutos = await getAllInactiveLotesProdutosByProdutoService(idProduto);

      return res.status(200).json(lotesProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy(req, res) {
   try {
      const idProduto = Number(req.params.idProduto);
      const { orderBy, filterOptions } = req.query;

      if (!idProduto || (!orderBy && !filterOptions)) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               idProduto: idProduto || "NÃO ENCONTRADO",
               orderBy: orderBy || "NÃO ENCONTRADO",
               filterOptions: filterOptions || "NÃO ENCONTRADO",
            },
         });
      }

      const lotesProdutos = await getAllActiveLotesProdutosByProdutoWithFilterAndOrderByService(idProduto, {filterOptions, orderBy});

      return res.status(200).json(lotesProdutos);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function createLoteProduto(req, res) {
   try {
      const {
         id_produto,
         id_fornecedor,
         valor_unitario,
         qtd_disponivel,
         data_validade
      } = req.body || {
         id_produto: undefined,
         id_fornecedor: undefined,
         valor_unitario: undefined,
         qtd_disponivel: undefined,
         data_validade: undefined
      };

      if(!id_produto || 
         !id_fornecedor || 
         !valor_unitario || 
         (qtd_disponivel === undefined || qtd_disponivel === null) || 
         !data_validade
      ) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id_produto: id_produto || "NÃO ENCONTRADO",
               id_fornecedor: id_fornecedor || "NÃO ENCONTRADO",
               valor_unitario: valor_unitario || "NÃO ENCONTRADO",
               qtd_disponivel: qtd_disponivel || "NÃO ENCONTRADO",
               data_validade: data_validade || "NÃO ENCONTRADO",
            },
         });
      }

      // Status já será definido como ativo automaticamente na criação
      const createdLoteProduto = await createLoteProdutoService({
         id_produto,
         id_fornecedor,
         valor_unitario,
         qtd_disponivel,
         is_vencido: Number(0),
         data_validade
      });

      return res.status(201).json(createdLoteProduto);

   } catch (error) {
      errorResponse(error, res);
   }

}

async function updateLoteProduto(req, res) {
   try {
      const id = Number(req.params.id);

      const {
         id_fornecedor,
         valor_unitario,
         qtd_disponivel,
         is_vencido,
         data_validade
      } = req.body || {
         id_fornecedor: undefined,
         valor_unitario: undefined,
         qtd_disponivel: undefined,
         is_vencido: undefined,
         data_validade: undefined
      };

      if(!id || (!id_fornecedor && 
                 !valor_unitario && 
                 (qtd_disponivel === undefined || qtd_disponivel === null) && 
                 (is_vencido === undefined || is_vencido === null) && 
                 !data_validade)
      ) { 
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            fields: {
               id: id || "NÃO ENCONTRADO",
               id_fornecedor: id_fornecedor || "NÃO ENCONTRADO",
               valor_unitario: valor_unitario || "NÃO ENCONTRADO",
               qtd_disponivel: qtd_disponivel || "NÃO ENCONTRADO",
               is_vencido: is_vencido || "NÃO ENCONTRADO",
               data_validade: data_validade || "NÃO ENCONTRADO",
            },
         });
      }

      const [rowAffected] = await updateLoteProdutoService(id, {
         id_fornecedor,
         valor_unitario,
         qtd_disponivel,
         is_vencido,
         data_validade
      })

      if(rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "Lote de produto atualizado com sucesso!"
         })
      }
 

   } catch (error) {
      errorResponse(error, res);
   }
}

async function changeLoteProdutoStatus(req, res) {
   try {
      const id = Number(req.params.id);
      let { status } = req.body;

      if(!id || !status) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               id: id || "Não encontrado",
               status: status || "Não encontrado"
            }
         })
      }

      const [rowAffected] = await changeLoteProdutoStatusService(id, status);

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

module.exports = {
   getAllLotesProdutos,
   getAllActiveLotesProdutos,
   getAllInactiveLotesProdutos,
   getAllActiveLotesProdutosByFilterAndOrderBy,
   getAllLotesProdutosByFornecedor,
   getLoteProdutoById,
   // By Produto
   getAllLotesProdutosByProduto,
   getAllActiveLotesProdutosByProduto,
   getAllInactiveLotesProdutosByProduto,
   getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy,
   createLoteProduto,
   updateLoteProduto,
   changeLoteProdutoStatus
}