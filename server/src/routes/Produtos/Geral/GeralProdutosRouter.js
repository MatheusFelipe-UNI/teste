const { Router } = require("express");
const produtosController = require("../../../controllers/ProdutosController.js");

const router = Router();

router.route("/").get(produtosController.getAllProdutos).post(produtosController.createProduto);

router.route("/ativos").get(produtosController.getAllActiveProdutos);

router.route("/inativos").get(produtosController.getAllInactiveProdutos);

router.route("/ativos/filter").get(produtosController.getAllActiveProdutosByFilterAndOrderBy);

router.route("/:id/status").patch(produtosController.changeProdutoStatus);

router.route("/:id").get(produtosController.getProdutoById).patch(produtosController.updateProduto);

module.exports = router;
