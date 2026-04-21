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

async function changeClienteStatus(idCliente, newStatus) {
    const updatedClienteStatus = await Clientes.update({ status: newStatus }, {
        where: {
            id: idCliente
        }
    });
    return updatedClienteStatus;
}

async function getClienteByCPForCNPJ(cpf_cnpj) {
    const identidade = await Clientes.findOne({
        where: { cpf_cnpj: cpf_cnpj }
    });
    return identidade;
}

async function createCliente(clienteData) {
    const createdCliente = await Clientes.create(clienteData);
    return createdCliente;
}

async function updateCliente(id, updateFields) {

    const rowAffected = await Clientes.update(updateFields, {
        where: { id: id },
    });

    return rowAffected;
}

module.exports = {
    getAllClientes,
    getAllActiveClientes,
    getAllInactiveClientes,
    getAllActiveClientesByFilterAndOrderBy,
    getClienteById,
    changeClienteStatus,
    getClienteByCPForCNPJ,
    createCliente,
    updateCliente,
}