const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const Routes = require("./src/routes");
const { dbConnectionTest } = require("./src/test/dbConnectionTest");

const app = express();
const PORT =  process.env.PORT_FIXED || 3000;
const HOST_IP = process.env.IP_FIXED || "0.0.0.0";


dbConnectionTest();
app.use(cors());
app.use(express.json());
app.use(Routes);
app.listen(PORT, HOST_IP, () => console.log(`api is running on http://${HOST_IP}:${PORT}...`));