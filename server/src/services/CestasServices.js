const { getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,
    createCesta,
    changeCestaStatus,
    updateCesta,
    deleteItensByCestaID,
    createItensCesta,
} = require("../repositories/CestasRepository");
const { Op } = require("sequelize");
const { Cestas, sequelize } = require("../models");
const NotFoundError = require("../classes/NotFoundError");
const ExistsDataError = require("../classes/ExistsDataError");


async function getAllCestasService() {
    const allCestas = await getAllCestas();
    return allCestas;
}

async function getAllActiveCestasService() {
    const allActiveCestas = await getAllActiveCestas();
    return allActiveCestas;
}

async function getAllInactiveCestasService() {
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
    if (preco_min || preco_max) {
        whereClause.preco = {};
        if (preco_min) whereClause.preco[Op.gte] = preco_min;
        if (preco_max) whereClause.preco[Op.lte] = preco_max;

    }

    const allowedOrderFields = ['id', 'nome_cesta', 'preco', 'quantidade', 'created_at', 'updated_at'];
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

async function getCestaByIdService(idCesta) {
    const cestaID = await getCestaById(idCesta);
    return cestaID
}

async function createCestaService(cestaData) {
    const createdCesta = await createCesta(cestaData);
    return createdCesta;
}

async function changeCestaStatusService(idCesta, newStatus) {
    const formattedNewStatus = newStatus.toUpperCase();
    const cesta = await getCestaByIdService(idCesta);

    if (!cesta) {
        throw new NotFoundError("Cesta não localizada!");
    }

    if (formattedNewStatus !== "ATIVO" && formattedNewStatus !== "INATIVO") {
        throw new ExistsDataError("Utilize ATIVO ou INATIVO")
    }

    const statusAtual = cesta.status;
    if (formattedNewStatus == statusAtual) {
        throw new ExistsDataError(`Esta aquisição já está na situação de: ${formattedNewStatus}`);
    }

    const changeStatus = await changeCestaStatus(idCesta, formattedNewStatus);
    return changeStatus
}

async function updateCestaService(id, data) {
    const { itens_cesta, ...cestaData } = data;

    Object.keys(cestaData).forEach(key => cestaData[key] === undefined && delete cestaData[key]);

    let result = [0];
    if (Object.keys(cestaData).length > 0) {
        result = await updateCesta(id, cestaData);
    }

    if (itens_cesta) {
        await deleteItensByCestaID(id);
        if (itens_cesta.length > 0) {
            const newItens = itens_cesta.map(item => {
                return {
                    fk_id_cesta: id,
                    fk_id_produto: item.fk_id_produto,
                    quantidade: item.quantidade
                }
            });
            await createItensCesta(newItens);
        }

        if (result[0] === 0) {
            result = [1]
        }
    }
    return result;
}

module.exports = {
    getAllCestasService,
    getAllActiveCestasService,
    getAllInactiveCestasService,
    getCestaByIdService,
    getAllActiveCestasByFilterAndOrderByService,
    createCestaService,
    changeCestaStatusService,
    updateCestaService,
}