const { Router } = require("express");
const lotesProdutosController = require("../../../controllers/LotesProdutosController.js");

const router = Router();

router
   .route("/")
   .get(lotesProdutosController.getAllLotesProdutos)
   .post(lotesProdutosController.createLoteProduto);

router
   .route("/ativos")
   .get(lotesProdutosController.getAllActiveLotesProdutos)

router
   .route("/inativos")
   .get(lotesProdutosController.getAllInactiveLotesProdutos)

router
   .route("/ativos/filter")
   .get(lotesProdutosController.getAllActiveLotesProdutosByFilterAndOrderBy)

router
   .route("/fornecedores/:idFornecedor")
   .get(lotesProdutosController.getAllLotesProdutosByFornecedor)

router
   .route("/:id/status")
   .patch(lotesProdutosController.changeLoteProdutoStatus)

router
   .route("/:id")
   .get(lotesProdutosController.getLoteProdutoById)
   .patch(lotesProdutosController.updateLoteProduto)

module.exports = router;