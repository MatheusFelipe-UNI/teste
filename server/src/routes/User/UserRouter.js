const { Router } = require("express");
const userController = require("../../controllers/UserController.js");

const router = Router();

router
   .route("/")
   .get(userController.getAllUsers)
   .post(userController.createUser);

router
   .route("/logged")
   .get(userController.getUserLoggedById)

router
   .route("/password")
   .patch(userController.changePasswordUser)

router
   .route("/default-users")
   .get(userController.getAllDefaultUsers)

router
   .route("/default-users/:idUser")
   .patch(userController.changeStatusUser)

router
   .route("/:id")
   .get(userController.getUserById)

module.exports = router;