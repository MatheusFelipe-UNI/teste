const { Cesta, sequelize } = require("../models");


async function getAllCestas() {
    const allCestas = await Cesta.findAll();
    return allCestas;
}


module.exports = {
    getAllCestas,
}