const { 
    getAllEntradasProdutos,
    getAllReceivedEntradasProdutos,
    getAllCanceledEntradasProdutos,
    getEntradaProdutoById,
} = require ("../repositories/EntradasRepository");
const { Op } = require("sequelize");
const { EntradasProdutos, sequelize} = require("../models");
const NotFoundError = require("../classes/NotFoundError");
const ExistsDataError = require("../classes/ExistsDataError");

async function getAllEntradasProdutosService() {
    const allEntradasProdutos = await getAllEntradasProdutos();
    return allEntradasProdutos;
}

async function getAllReceivedEntradasProdutosService() {
    const allReceivedEntradasProdutos = await getAllReceivedEntradasProdutos();
    return allReceivedEntradasProdutos;
}

async function getAllCanceledEntradasProdutosService() {
    const allCanceledEntradasProdutos = await getAllCanceledEntradasProdutos();
    return allCanceledEntradasProdutos;
}

async function getAllReceivedEntradasProdutosByFilterAndOrderByService(filterParams) {
    const {
        id, 
        fk_id_user, 
        status, 
        data_entrada,
        order_by = "data_entrada",
        order_direction = "DESC"
    } = filterParams;

    const whereClause = {
        status: "RECEBIDA"
    };

    // Filtro baseado na data da entrada, o usuário deve escolher o periodo que deseja filtrar
    if (data_min || data_max) {
        whereClause.data_entrada = {};
        if (data_min) whereClause.data_entrada[Op.gte] = data_min;
        if (data_max) whereClause.data_entrada[Op.lte] = data_max;
    }

    const allowedOrderFields = ['id', 'nome_cesta', 'preco', 'quantidade', 'created_at', 'updated_at'];
    const orderField = allowedOrderFields.includes(order_by) ? order_by : 'id';
    const orderDir = order_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderFilters = [[orderField, orderDir]];

    const attributesFilters = [
        id, 
        fk_id_user, 
        status, 
        data_entrada,
        [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
        [sequelize.col("user_entrada.usuario"), "usuario"]
    ];

    const filteredEntradasProdutos = await getAllActiveEntradasProdutosByFilterAndOrderBy(whereClause, orderFilters, attributesFilters);
    return filteredEntradasProdutos;
}

async function getEntradaProdutoByIdService(idEntradaProduto) {
    const EntradaProdutoID = await getEntradaProdutoById(idEntradaProduto);
    return EntradaProdutoID
}

module.exports = {
    getAllEntradasProdutosService,
    getAllReceivedEntradasProdutosService,
    getAllCanceledEntradasProdutosService,
    getEntradaProdutoByIdService,
}