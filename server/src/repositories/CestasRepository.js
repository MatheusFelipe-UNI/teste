const { Cestas, sequelize } = require("../models");



async function getAllCestas() {
    const allCestas = await Cestas.findAll();
    return allCestas;
}

async function getAllActiveCestas() {
    const allActiveCestas = await Cestas.findAll({
        where: {
            status: "ATIVO"
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allActiveCestas;
}

async function getAllInactiveCestas(){
    const allInactiveCestas = await Cestas.findAll({
        where: {
            status: "INATIVO"
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allInactiveCestas;
}

async function getAllActiveCestasByFilterAndOrderBy(whereClause, orderFilters, attributesFilters) {
    const cesta = await Cestas.findAll({
        where: whereClause,
        attributes: attributesFilters,
        order: orderFilters
    });
    return cesta;
}


async function getCestaById(idCesta){
    const cestaID = await Cestas.findByPk(idCesta);
    return cestaID;
}

module.exports = {
    getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,

}