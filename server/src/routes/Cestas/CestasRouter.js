const { Router } = require("express");
const cestasController = require("../../controllers/CestasController.js");

const router = Router();

router
   .route("/")
   .get(cestasController.getAllCestas)
   .post(cestasController.createCesta);
/*
router
   .route("/ativos")
   .get(cestasController.getAllActiveCestas)

router
   .route("/inativos")
   .get(cestasController.getAllInactiveCestas)

router
   .route("/ativos/filter")
   .get(cestasController.getAllActiveCestasByFilterAndOrderBy)

router
   .route("/itens")
   .get(cestasController.getAllCestasItens)

router
   .route("/itens/:idItem")
   .get(cestasController.getCestaItemById)

router
   .route("/:id/status")
   .patch(cestasController.changeCestaStatus)

router
   .route("/:id/itens")
   .get(cestasController.getAllCestasItensByCestaId)

router
   .route("/:id")
   .get(cestasController.getCestaById)
   .patch(cestasController.updateCesta)
*/
module.exports = router;