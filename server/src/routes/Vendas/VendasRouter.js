const { Router } = require("express");
const vendasController = require("../../controllers/VendasController.js");

const router = Router();

router
   .route("/")
   .get(vendasController.getAllVendasCestas)
   .post(vendasController.createVendaCesta);

router
   .route("/pendentes")
   .get(vendasController.getAllPendingVendasCestas)

router
   .route("/concluidas")
   .get(vendasController.getAllFinishedVendasCestas)

router
   .route("/canceladas")
   .get(vendasController.getAllCanceledVendasCestas)

router
   .route("/concluidas/filter")
   .get(vendasController.getAllFinishedVendasCestasByFilterAndOrderBy)

router
   .route("/:id/status")
   .patch(vendasController.changeVendaCestaStatus)

router
   .route("/:id")
   .get(vendasController.getVendaCestaById)

module.exports = router;