const { Router } = require("express");
const userController = require("../../controllers/UserController.js");

const router = Router();

router
   .route("/register")
   .post(userController.createFirstUser)


// Essa rota será definida após a confirmação de um grupo de lógica (repository, service e controller) de estatística 
// router
//    .route("/total-registered")
//    .get(anyOneController.getTotalUsers)

module.exports = router;