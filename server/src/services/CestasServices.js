const { getAllCestas } = require("../repositories/CestasRepository");

async function getAllCestasService() {
    const allCestas = await getAllCestas();
    return allCestas;
}

module.exports = {
    getAllCestasService
}