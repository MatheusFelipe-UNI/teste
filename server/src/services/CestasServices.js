const { getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,
} = require("../repositories/CestasRepository");
const { Op } = require("sequelize");
const { Cestas, sequelize } = require("../models");

async function getAllCestasService() {
    const allCestas = await getAllCestas();
    return allCestas;
}

async function getAllActiveCestasService() {
    const allActiveCestas = await getAllActiveCestas();
    return allActiveCestas;
}

async function getAllInactiveCestasService(){
    const allInactiveCestas = await getAllInactiveCestas();
    return allInactiveCestas;
}

async function getAllActiveCestasByFilterAndOrderByService(filterParams) {
    const {
        nome_cesta,
        preco_min,
        preco_max,
        order_by = "created_at",
        order_direction = "DESC"
    } = filterParams;

    const whereClause = {
        status: "ATIVO"
    };

// Filtro com base no nome da cesta
    if (nome_cesta) {
        whereClause.nome_cesta = {
            [Op.like]: `%${nome_cesta}%`
        };
    }

// Filtro baseado nos valores da cesta, o usuário deve escolher o valor minimo e o valor máximo
    if (preco_min||preco_max) {
        whereClause.preco = {};
        if (preco_min) whereClause.preco[Op.gte] = preco_min;
        if (preco_max) whereClause.preco[Op.lte] = preco_max;
        
    }

    const allowedOrderFields = ['id','nome_cesta', 'preco', 'quantidade', 'created_at', 'updated_at'];
    const orderField = allowedOrderFields.includes(order_by) ? order_by : 'id';
    const orderDir = order_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderFilters = [[orderField, orderDir]];

    const attributesFilters = [
        "id",
        "nome_cesta",
        "preco",
        "quantidade",
        "status",
        [
            sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.created_at"), "%d-%m-%Y %H:%i:%s"),
            "created_at",
        ],
        [
            sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.updated_at"), "%d-%m-%Y %H:%i:%s"),
            "updated_at",
        ],
    ];

    const filteredCestas = await getAllActiveCestasByFilterAndOrderBy(whereClause, orderFilters, attributesFilters);
    return filteredCestas;
}

async function getCestaByIdService(idCesta){
    const cestaID = await getCestaById(idCesta);
    return cestaID
}





module.exports = {
    getAllCestasService,
    getAllActiveCestasService,
    getAllInactiveCestasService,
    getCestaByIdService,
    getAllActiveCestasByFilterAndOrderByService,
}