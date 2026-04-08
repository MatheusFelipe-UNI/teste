const { Router } = require("express");
const fornecedoresController = require("../../controllers/FornecedoresController.js");

const router = Router();

router
   .route("/")
   .get(fornecedoresController.getAllFornecedores)
   .post(fornecedoresController.createFornecedor);

router
   .route("/ativos")
   .get(fornecedoresController.getAllActiveFornecedores)

router
   .route("/inativos")
   .get(fornecedoresController.getAllInactiveFornecedores)

router
   .route("/ativos/filter")
   .get(fornecedoresController.getAllActiveFornecedoresByFilterAndOrderBy)

router
   .route("/:id/status")
   .patch(fornecedoresController.changeFornecedorStatus)

router
   .route("/:id")
   .get(fornecedoresController.getFornecedorById)
   .patch(fornecedoresController.updateFornecedor)

module.exports = router;