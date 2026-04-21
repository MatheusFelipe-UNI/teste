const { EntradasProdutos, sequelize} = require("../models");

async function getAllEntradasProdutos() {
    const allEntradasProdutos = await EntradasProdutos.findAll();
    return allEntradasProdutos;
}

async function getAllReceivedEntradasProdutos() {
    const allReceivedEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "RECEBIDA" //RECEBA!
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            "quantidade",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("EntradasProdutos.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("EntradasProdutos.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allReceivedEntradasProdutos;
}

async function getAllInactiveEntradasProdutos() {
    const allInactiveEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "INATIVO"
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("EntradasProdutos.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("EntradasProdutos.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allInactiveEntradasProdutos;
}

async function getAllActiveEntradasProdutosByFilterAndOrderBy(whereClause, orderFilters, attributesFilters) {
    const cesta = await EntradasProdutos.findAll({
        where: whereClause,
        attributes: attributesFilters,
        order: orderFilters
    });
    return cesta;
}

async function getCestaById(idCesta) {
    const cestaID = await EntradasProdutos.findByPk(idCesta, {
        include: [{
            association: "itens_cesta"
        }]
    });
    return cestaID;
}

module.exports = {
    getAllEntradasProdutos,
    getAllReceivedEntradasProdutos,
}