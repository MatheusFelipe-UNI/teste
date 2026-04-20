const {
    getAllClientes,
    getAllActiveClientes,
    getAllInactiveClientes,
    getAllActiveClientesByFilterAndOrderBy,
    getClienteById,
} = require("../repositories/ClientesRepository");
const { Op } = require("sequelize");
const { Clientes, sequelize } = require("../models");

async function getAllClientesService() {
    const allClientes = await getAllClientes();
    return allClientes;
}

async function getAllActiveClientesService() {
    const allActiveClientes = await getAllActiveClientes();
    return allActiveClientes;
}

async function getAllInactiveClientesService() {
    const allInactiveClientes = await getAllInactiveClientes();
    return allInactiveClientes;
}

async function getAllActiveClientesByFilterAndOrderByService(filterParams) {
    const {
        nome_cliente,
        telefone,
        cpf_cnpj,
        tipo_cliente,
        order_by = "created_at",
        order_direction = "DESC"
    } = filterParams;

    const whereClause = {
        status: "ATIVO"
    };

    // Filtro com base no nome do cliente
    if (nome_cliente) {
        whereClause.nome_cliente = {
            [Op.like]: `%${nome_cliente}%`
        };
    }

    // Filtro baseado no tipo_cliente, minha sugestão é um select de "PESSOA FISICA" e "PESSOA JURIDICA"
    if (pf || pj) {
        whereClause.tipo_cliente = {};
        if (pf) whereClause.tipo_cliente[Op.eq] = PESSOA_FISICA;
        if (pj) whereClause.tipo_cliente[Op.eq] = PESSOA_JURIDICA;

    }

    const allowedOrderFields = ['id', 'created_at', 'updated_at'];
    const orderField = allowedOrderFields.includes(order_by) ? order_by : 'id';
    const orderDir = order_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderFilters = [[orderField, orderDir]];

    const attributesFilters = [
        "id",
        "nome_cliente",
        "telefone",
        "cpf_cnpj",
        "tipo_cliente",
        [
            sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.created_at"), "%d-%m-%Y %H:%i:%s"),
            "created_at",
        ],
        [
            sequelize.fn("DATE_FORMAT", sequelize.col("Clientes.updated_at"), "%d-%m-%Y %H:%i:%s"),
            "updated_at",
        ],
    ];

    const filteredClientes = await getAllActiveClientesByFilterAndOrderBy(whereClause, orderFilters, attributesFilters);
    return filteredClientes;
}

async function getClienteByIdService(idcliente) {
    const clienteID = await getClienteById(idcliente);
    return clienteID
}

module.exports = {
    getAllClientesService,
    getAllActiveClientesService,
    getAllInactiveClientesService,
    getAllActiveClientesByFilterAndOrderByService,
    getClienteByIdService,
}