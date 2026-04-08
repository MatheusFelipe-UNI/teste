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

// Retorna todos as Vendas Cadastrados
async function getAllVendasCestas(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allVendasCestas = await getAllVendasCestasService();
      return res.status(200).json(allVendasCestas);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todas as Vendas Pendentes
async function getAllPendingVendasCestas(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allVendasCestas = await getAllPendingVendasCestasService();
      return res.status(200).json(allVendasCestas);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todas as vendas Concluídas
async function getAllFinishedVendasCestas(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allVendasCestas = await getAllFinishedVendasCestasService();

      return res.status(200).json(allVendasCestas);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todas as vendas Canceladas
async function getAllCanceledVendasCestas(req, res) {
   try {
      // Utilizar esse Nome de função para os services
      const allVendasCestas = await getAllCanceledVendasCestasService();

      return res.status(200).json(allVendasCestas);
   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna todas as vendas de Cestas concluídas filtrados e/ou ordenados
async function getAllFinishedVendasCestasByFilterAndOrderBy(req, res) {
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
      const filteredVendasCestas = await getAllFinishedVendasCestasByFilterAndOrderByService(
         orderBy,
         filterOptions
      );

      return res.status(200).json(filteredVendasCestas);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Retorna a venda de cesta correspondente ao ID passado (se houver)
async function getVendaCestaById(req, res) {
   try {
       

      // Utilizar esse Nome de função para os services
      const vendaCesta = await getVendaCestaByIdService(id);

      if(!vendaCesta) {
         throw new NotFoundError("Venda de cesta não encontrada", {
            fields: {
               id,
            },
         });
      }

      return res.status(200).json(vendaCesta);

   } catch (error) {
      errorResponse(error, res);
   }
}

// Altera o status da venda baseando-se no STATUS passado
async function changeVendaCestaStatus(req, res) {
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
      const [rowAffected] = await changeVendaCestaStatusService(id, status);

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

// Cria um nova Venda de Cesta
async function createVendaCesta(req, res) {
   try {
      const {
         id_cliente,
         id_user,
         id_cesta,
         quantidade,
         valor_unitario,
         valor_total
      } = req.body;

      if(!id_cliente || 
         !id_user || 
         !id_cesta || 
         (quantidade === undefined || quantidade === null) || 
         (valor_unitario === undefined || valor_unitario === null) || 
         (valor_total === undefined || valor_total === null)
      ) {
         throw new FieldUndefinedError("Um ou mais campos não identificados", {
            dados_passados: {
               id_cliente: id_cliente || "Não encontrado",
               id_user: id_user || "Não encontrado",
               id_cesta: id_cesta || "Não encontrado",
               quantidade: quantidade || "Não encontrado",
               valor_unitario: valor_unitario || "Não encontrado",
               valor_total: valor_total || "Não encontrado",
            }
         })
      }

      const createdVendaCesta = await createVendaCestaService({
         id_cliente,
         id_user,
         id_cesta,
         quantidade,
         valor_unitario,
         valor_total,
         status: "PENDENTE"
      })

      if(!createdVendaCesta) {
         throw new CannotCreateError("Erro ao cadastrar Venda de Cesta", {
            data: {
               createdVendaCesta
            }
         })
      }

      return res.status(201).json({
         status: "success",
         message: "Venda de Cesta cadastrada com sucesso!"
      })

   } catch (error) {
      errorResponse(error, res);
   }
}

module.exports = {
   getAllVendasCestas,
   getAllPendingVendasCestas,
   getAllFinishedVendasCestas,
   getAllCanceledVendasCestas,
   getAllFinishedVendasCestasByFilterAndOrderBy,
   getVendaCestaById,
   changeVendaCestaStatus,
   createVendaCesta
};
