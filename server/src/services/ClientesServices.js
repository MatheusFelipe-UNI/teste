const {
    getAllClientes,
    getAllActiveClientes,
    getAllInactiveClientes,
    getAllActiveClientesByFilterAndOrderBy,
    getClienteById,
    changeClienteStatus,
    createCliente,
    getClienteByCPForCNPJ,
    updateCliente,
} = require("../repositories/ClientesRepository");
const { Op, where } = require("sequelize");
const { Clientes, sequelize } = require("../models");
const NotFoundError = require("../classes/NotFoundError");
const ExistsDataError = require("../classes/ExistsDataError");

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

async function getAllActiveClientesByFilterAndOrderByService(orderBy, filterOptions) {
    let filters = filterOptions;
    if (typeof filters === 'string') {
        try {
            filters = JSON.parse(filters);
        } catch (error) {
            filters = {};
        }
    }
    filters = filters || {};

    const {
        nome_cliente,
        telefone,
        cpf_cnpj,
        tipo_cliente,
        order_direction = "DESC"
    } = filters;

    const whereClause = {
        status: "ATIVO"
    };

    // Filtro com base no nome do cliente
    if (nome_cliente) {
        whereClause.nome_cliente = {
            [Op.like]: `%${nome_cliente}%`
        };
    }

    // Procura o documento (cpf ou cnpj) semelhante ao digitado pelo usuário
    if (cpf_cnpj) {
        whereClause.cpf_cnpj = {
            [Op.like]: `%${cpf_cnpj}%`
        };
    }

    // Filtro baseado no tipo_cliente, minha sugestão é um select de "PESSOA FISICA" e "PESSOA JURIDICA"
    if (tipo_cliente) {
        whereClause.tipo_cliente = tipo_cliente;
    }

    // Procura um telefone semelhante ao digitado pelo usuário
    if (telefone) {
        whereClause.telefone = {
            [Op.like]: `%${telefone}%`
        };
    }

    const allowedOrderFields = ['id', 'created_at', 'updated_at', 'tipo_cliente', 'nome_cliente'];
    const orderField = allowedOrderFields.includes(orderBy) ? orderBy : 'id';
    const orderDir = (order_direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
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

async function getClienteByIdService(idCliente) {
    const clienteID = await getClienteById(idCliente);
    return clienteID
}

async function changeClienteStatusService(idCliente, newStatus) {
    const cliente = await getClienteByIdService(idCliente);
    const formattedNewStatus = newStatus.toUpperCase();

    if (!cliente) {
        throw new NotFoundError("Cliente não localizado!");
    }

    if (formattedNewStatus !== "ATIVO" && formattedNewStatus !== "INATIVO") {
        throw new ExistsDataError("Utilize ATIVO ou INATIVO")
    }

    const statusAtual = cliente.status;
    if (formattedNewStatus == statusAtual) {
        throw new ExistsDataError(`Este cliente já se encontra com o status: ${formattedNewStatus}`);
    }

    const updatedClienteStatus = await changeClienteStatus(idCliente, formattedNewStatus);
    return updatedClienteStatus
}

async function createClienteService(clienteData) {
    const existingCliente = await getClienteByCPForCNPJ(clienteData.cpf_cnpj);

    if (existingCliente) {
        throw new ExistsDataError("Já existe um cliente com este CPF/CNPJ")
    }

    const createdCliente = await createCliente(clienteData);
    return createCliente;
}

async function updateClienteService(id, clienteData) {
    const { nome_cliente, telefone, tipo_cliente, cpf_cnpj } = clienteData
    const cliente = await getClienteByIdService(id);

    if (!cliente) {
        throw new NotFoundError("Cliente não localizado!")
    }

    const updateFields = {};
    if (nome_cliente !== undefined) updateFields.nome_cliente = nome_cliente
    if (telefone !== undefined) updateFields.telefone = telefone
    if (cpf_cnpj !== undefined) updateFields.cpf_cnpj = cpf_cnpj
    if (tipo_cliente !== undefined) updateFields.tipo_cliente = tipo_cliente

    return await updateCliente(id, updateFields);
}

module.exports = {
    getAllClientesService,
    getAllActiveClientesService,
    getAllInactiveClientesService,
    getAllActiveClientesByFilterAndOrderByService,
    getClienteByIdService,
    changeClienteStatusService,
    createClienteService,
    updateClienteService,
}