const { Router } = require("express");
const lotesProdutosController = require("../../controllers/LotesProdutosController.js");

// Rotas
const geralProdutos = require("./Geral/GeralProdutosRouter.js");
const lotesProdutos = require("./LotesProdutos/LotesProdutosRouter.js");

const router = Router();

router.use("/geral", geralProdutos);
router.use("/lotes", lotesProdutos);

// Rotas que mesclam tanto os Produtos como Lotes Produtos
router
   .route("/:idProduto/lotes")
   .get(lotesProdutosController.getAllLotesProdutosByProduto);

router
   .route("/:idProduto/lotes/ativos")
   .get(lotesProdutosController.getAllActiveLotesProdutosByProduto);

router
   .route("/:idProduto/lotes/inativos")
   .get(lotesProdutosController.getAllInactiveLotesProdutosByProduto);

router
   .route("/:idProduto/lotes/filter")
   .get(lotesProdutosController.getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy);


module.exports = router;
