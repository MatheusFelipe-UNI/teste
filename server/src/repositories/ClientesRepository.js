const { Clientes, sequelize } = require("../models");

async function getAllClientes() {
    const allClientes = await Clientes.findAll();
    return allClientes;
}

async function getAllActiveClientes() {
    const allActiveClientes = await Clientes.findAll({
        where: {
            status: "ATIVO"
        },
        attributes: [
            "id",
            "nome_cliente",
            "telefone",
            "cpf_cnpj",
            "tipo_cliente",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allActiveClientes;
}

async function getAllInactiveClientes() {
    const allInactiveClientes = await Clientes.findAll({
        where: {
            status: "INATIVO"
        },
        attributes: [
            "id",
            "nome_cliente",
            "telefone",
            "cpf_cnpj",
            "tipo_cliente",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allInactiveClientes;
}

async function getAllActiveClientesByFilterAndOrderBy(whereClause, orderFilters, attributesFilters) {
    const cliente = await Clientes.findAll({
        where: whereClause,
        attributes: attributesFilters,
        order: orderFilters
    });
    return cliente;
}

async function getClienteById(idCliente) {
    const clienteID = await Clientes.findByPk(idCliente)
    return clienteID;
}

module.exports = {
    getAllClientes,
    getAllActiveClientes,
    getAllInactiveClientes,
    getAllActiveClientesByFilterAndOrderBy,
    getClienteById,

}