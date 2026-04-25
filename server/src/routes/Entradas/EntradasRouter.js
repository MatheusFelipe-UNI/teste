const { Router } = require("express");
const entradasController = require("../../controllers/EntradasController.js");

const router = Router();

router
   .route("/")
   .get(entradasController.getAllEntradasProdutos)
   .post(entradasController.createEntradaProduto);

router
   .route("/recebidas")
   .get(entradasController.getAllReceivedEntradasProdutos)

router
   .route("/canceladas")
   .get(entradasController.getAllCanceledEntradasProdutos)

router
   .route("/recebidas/filter")
   .get(entradasController.getAllReceivedEntradasProdutosByFilterAndOrderBy)

router
   .route("/canceladas/filter")
   .get(entradasController.getAllCanceledEntradasProdutosByFilterAndOrderBy)

router
   .route("/itens")
   .get(entradasController.getAllEntradasProdutosItens)

router
   .route("/itens/:idItem")
   .get(entradasController.getEntradaProdutoItemById)

router
   .route("/:id/itens")
   .get(entradasController.getAllEntradasProdutosItensByIdEntrada) 

router
   .route("/:id/status")
   .patch(entradasController.changeEntradaProdutoStatus)

router
   .route("/:id/itens")
   .get(entradasController.getAllEntradasProdutosItens)

router
   .route("/:id")
   .get(entradasController.getEntradaProdutoById)

module.exports = router;