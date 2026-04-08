const { sequelize } = require("../models");

async function dbConnectionTest() {
   try {
      await sequelize.authenticate();
      console.log("conexão estabelecidada");

   } catch (error) {
      console.log(error);
      console.log("Não foi possível se conectar ao database");
   }
}

module.exports = { dbConnectionTest };