const { Router } = require("express");
const clientesController = require("../../controllers/ClientesController.js");

const router = Router();

router
   .route("/")
   .get(clientesController.getAllClientes)
   .post(clientesController.createCliente);

router
   .route("/ativos")
   .get(clientesController.getAllActiveClientes)

router
   .route("/inativos")
   .get(clientesController.getAllInactiveClientes)

router
   .route("/ativos/filter")
   .get(clientesController.getAllActiveClientesByFilterAndOrderBy)

router
   .route("/:id/status")
   .patch(clientesController.changeClienteStatus)

router
   .route("/:id")
   .get(clientesController.getClienteById)
   .patch(clientesController.updateCliente)

module.exports = router;