const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
//Rotas
const authRouter = require("./Auth/AuthRouter.js");
const firstUserRouter = require("./User/UserFirstRouter.js");
const userRouter = require("./User/UserRouter.js");
const cestaRouter = require("./Cestas/CestasRouter.js");
const clienteRouter = require("./Clientes/ClientesRouter.js");
const entradaProdutoRouter = require("./Entradas/EntradasRouter.js");
const fornecedorRouter = require("./Fornecedores/FornecedoresRouter.js");
const produtoRouter = require("./Produtos/index.js");
const vendaCestaRouter = require("./Vendas/VendasRouter.js");


const router = Router();

router.use("/auth", authRouter);
router.use("/users/first", firstUserRouter);
router.use("/users", authMiddleware, userRouter);
router.use("/cestas", authMiddleware, cestaRouter);
router.use("/clientes", authMiddleware, clienteRouter);
router.use("/entradas-produtos", entradaProdutoRouter);
router.use("/fornecedores", authMiddleware, fornecedorRouter);
router.use("/produtos", authMiddleware, produtoRouter);
router.use("/vendas-cestas", authMiddleware, vendaCestaRouter);
router.get("/", (_, res) => res.status(200).json({status: "API FILÉ :)"}))


module.exports = router;