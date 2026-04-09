const { Cestas, sequelize } = require("../models");


async function getAllCestas() {
    const allCestas = await Cestas.findAll();
    return allCestas;
}


module.exports = {
    getAllCestas,
}