const { Router } = require("express");
const authController = require("../../controllers/AuthController.js");

const router = Router();

router
   .route("/")
   .post(authController.login);

module.exports = router;