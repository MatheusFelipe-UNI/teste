const { EntradasProdutos, sequelize } = require("../models");

async function getAllEntradasProdutos() {
    const allEntradasProdutos = await EntradasProdutos.findAll({
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allEntradasProdutos;
}

async function getAllReceivedEntradasProdutos() {
    const allReceivedEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "RECEBIDA" //RECEBA!
        },
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allReceivedEntradasProdutos;
}

async function getAllCanceledEntradasProdutos() {
    const allCanceledEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "CANCELADA"
        },
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allCanceledEntradasProdutos;
}

async function getAllReceivedEntradasProdutosByFilterAndOrderBy(whereClause, orderFilters, attributesFilters) {
    const allReceivedProducts = await EntradasProdutos.findAll({
        where: {
            status: "RECEBIDA"
        },
        where: whereClause,
        attributes: attributesFilters,
        order: orderFilters
    });
    return allReceivedProducts;
}

async function getEntradaProdutoById(idEntradaProduto) {
    const EntradaProdutoID = await EntradasProdutos.findByPk(idEntradaProduto, {
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            },
            {
                association: "itens_entrada",
                attributes: ["id", "quantidade_adquirida"],
                include: [{
                    association: "produtos_entrada",
                    attributes: ["nome_produto"]
                }]
            },
        ]
    });
    return EntradaProdutoID;
}

module.exports = {
    getAllEntradasProdutos,
    getAllReceivedEntradasProdutos,
    getAllCanceledEntradasProdutos,
    getEntradaProdutoById,
}