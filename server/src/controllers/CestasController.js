//Helpers
const errorResponse = require("../helper/ErrorResponseHelper.js");

// Erros customizados
const NotFoundError = require("../classes/NotFoundError.js");
const FieldUndefinedError = require("../classes/FieldUndefinedError.js");
const CannotCreateError = require("../classes/CannotCreateError.js");

// Imports
const { getAllCestasService } = require("../services/CestasServices.js");

/* 
============================================
NOTAS DO NATAN PARA O MATHEUS

- Os itens da Cesta já estão sendo passados pelo endpoint de criação e atualização de cesta. Para mais informações de estrutura verifique os comentários deixados na função "createCesta" (Linha 90)

- Utilizar os nomes dos services que eu já deixei em cada controller (comecei a colocar esse comentário em cada chamada de service, mas fiquei com preguiça de colocar no resto então vou colocar aqui no topo kkkkk)
============================================
*/

async function getAllCestas(req, res) {
   try {
      const allCestas = await getAllCestasService();
      return res.status(200).json(allCestas);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveCestas(req, res) {
   try {
      const allActiveCestas = await getAllActiveCestasService();
      return res.status(200).json(allActiveCestas);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllInactiveCestas(req, res) {
   try {
      const allInactiveCestas = await getAllInactiveCestasService();
      return res.status(200).json(allInactiveCestas);

   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllActiveCestasByFilterAndOrderBy(req, res) {
   try {
      const allActiveCestas = await getAllActiveCestasByFilterAndOrderByService(req.query);
      return res.status(200).json(allActiveCestas);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getCestaById(req, res) {
   try {
      const id = Number(req.params.id);

      if(!id) {
         throw new FieldUndefinedError("ID da Cesta não identificado", {
            dados_passados: {
               id: id || "Não encontrado"
            }
         })
      }

      const cesta = await getCestaByIdService(id);

      if(!cesta) {
         throw new NotFoundError("Cesta não encontrada", {
            dados_passados: {
               id: id
            }
         })
      }

      return res.status(200).json(cesta);

   } catch (error) {
      errorResponse(error, res);
   }
}


async function createCesta(req, res) {
   try {
      /*
         INFORMAÇÕES DOS VALORES
         ============================================
         nome_cesta: STRING (obrigatório)
         preco: NUMBER (obrigatório)
         quantidade: NUMBER (obrigatório)
         itens_cesta: ARRAY de objetos (obrigatório)
      */
      const {
         nome_cesta,
         preco,
         quantidade,
         itens_cesta
      } = req.body;

      if(!nome_cesta || 
         (preco === undefined || preco === null) || 
         (quantidade === undefined || quantidade === null) || 
         !itens_cesta
      ) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               nome_cesta: nome_cesta || "Não encontrado",
               preco: preco || "Não encontrado",
               quantidade: quantidade || "Não encontrado",
               itens_cesta: itens_cesta || "Não encontrado"
            }
         })
      }

      const createdCesta = await createCestaService({
         nome_cesta,
         preco,
         quantidade,
         itens_cesta
      })

      if(!createdCesta) {
         throw new CannotCreateError("Erro ao cadastrar Cesta", {
            data: {
               createdCesta            
            }
         })
      }

      return res.status(201).json({
         status: "success",
         message: "Cesta cadastrada com sucesso!"
      });

   } catch (error) {
      errorResponse(error, res);
   }
}

async function changeCestaStatus(req, res) {
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

      const [rowAffected] = await changeCestaStatusService(id, status);

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

async function updateCesta(req, res) {
   try {
      const id = Number(req.params.id);

      const {
         nome_cesta,
         preco,
         quantidade,
         itens_cesta
      } = req.body || { 
         nome_cesta: undefined, 
         preco: undefined, 
         quantidade: undefined, 
         itens_cesta: undefined 
      };

      if(!id || 
         (!nome_cesta && 
            (preco === undefined || preco === null) && 
            (quantidade === undefined && quantidade === null) && 
         !itens_cesta)
      ) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               id: id || "Não encontrado",
               nome_cesta: nome_cesta || "Não encontrado",
               preco: (preco === undefined && preco !== null) || "preco encontrado",
               quantidade: (quantidade === undefined && quantidade !== null) || "quantidade não encontrada",
               itens_cesta: itens_cesta || "Não encontrado"
            }
         })
      }

      const [rowAffected] = await updateCestaService(id, {
         nome_cesta,
         preco,
         quantidade,
         itens_cesta
      });

      if(rowAffected > 0) {
         return res.status(200).json({
            status: "success",
            message: "Cesta atualizada com sucesso!"
         })
      }


   } catch (error) {
      errorResponse(error, res);
   }
}


/*
========================================================
                     Itens Cestas
========================================================
*/
async function getAllCestasItens(req, res) {
   try {
      const allCestasItens = await getAllCestasItensService();
      return res.status(200).json(allCestasItens);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getAllCestasItensByCestaId(req, res) {
   try {
      const idCesta = Number(req.params.id);

      if(!idCesta) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               idCesta,
            },
         });
      }

      const cestasItens = await getAllCestasItensByCestaIdService(idCesta);
      return res.status(200).json(cestasItens);
   } catch (error) {
      errorResponse(error, res);
   }
}

async function getCestaItemById(req, res) {
   try {
      const id = Number(req.params.id);

      if(!id) {
         throw new FieldUndefinedError("Campo ID não identificado", {
            fields: {
               id,
            },
         });
      }

      const cestaItem = await getCestaItemByIdService(id);

      if(!cestaItem) {
         throw new NotFoundError("Item da Cesta não encontrado", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(cestaItem);
   } catch (error) {
      errorResponse(error, res);
   }
}

module.exports = {
   getAllCestas,
   getAllActiveCestas,
   getAllInactiveCestas,
   getAllActiveCestasByFilterAndOrderBy,
   getCestaById,
   createCesta,
   updateCesta,
   changeCestaStatus,
   getAllCestasItens,
   getAllCestasItensByCestaId,
   getCestaItemById
}
