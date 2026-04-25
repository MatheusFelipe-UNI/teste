const { 
    getAllEntradasProdutos,
    getAllReceivedEntradasProdutos,
    getAllCanceledEntradasProdutos,
    getAllReceivedEntradasProdutosByFilterAndOrderBy,
    getAllCanceledEntradasProdutosByFilterAndOrderBy,
    getEntradaProdutoById,
    changeEntradaProdutoStatus,
    createEntradaProduto,
    getAllEntradasProdutosItens,
    getAllEntradasProdutosItensByIdEntrada,
    getEntradaProdutoItemById,
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

async function getAllReceivedEntradasProdutosByFilterAndOrderByService(orderBy, filterOptions) {
    let filters = {};
    if (filterOptions) {
        try {
            filters = typeof filterOptions === 'string' ? JSON.parse(filterOptions) : filterOptions;
        } catch (error) {
            filters = {};
        }
    }
    
    const allowedOrderFields = ['id', 'data_entrada', 'usuario'];
    const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'data_entrada';
    
    return await getAllReceivedEntradasProdutosByFilterAndOrderBy(filters, validOrderBy);
}

async function getAllCanceledEntradasProdutosByFilterAndOrderByService(orderBy, filterOptions) {
    let filters = {};
    if (filterOptions) {
        try {
            filters = typeof filterOptions === 'string' ? JSON.parse(filterOptions) : filterOptions;
        } catch (error) {
            filters = {};
        }
    }
    
    const allowedOrderFields = ['id', 'data_entrada', 'usuario'];
    const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'data_entrada';
    
    return await getAllCanceledEntradasProdutosByFilterAndOrderBy(filters, validOrderBy);
}


async function getEntradaProdutoByIdService(idEntradaProduto) {
    const EntradaProdutoID = await getEntradaProdutoById(idEntradaProduto);
    return EntradaProdutoID
}

async function changeEntradaProdutoStatusService(idEntrada, newStatus){
    const produtos = await getEntradaProdutoByIdService(idEntrada);
    const formattedNewStatus = newStatus.toUpperCase();

    if (!produtos){
        throw new NotFoundError("Entrada não localizada!");
    }

    if (formattedNewStatus !== "RECEBIDA" && formattedNewStatus !== "CANCELADA"){
        throw new ExistsDataError("Utilize RECEBIDA ou CANCELADA ")
    }

    const statusAtual = produtos.status;
    if(formattedNewStatus == statusAtual) {
        throw new ExistsDataError(`Esta entrada já se encontra com o status: ${formattedNewStatus}`);
    }

    const updateEntradaStatus = await changeEntradaProdutoStatus(idEntrada, formattedNewStatus);
    return updateEntradaStatus
}

async function createEntradaProdutoService(entradaData) {
    const newEntrada = await createEntradaProduto(entradaData);
    return newEntrada;
}

/*
========================================================
                   Itens Entradas
========================================================
*/

async function getAllEntradasProdutosItensService() {
    const allEntradasProdutoItens = await getAllEntradasProdutosItens();
    return allEntradasProdutoItens;
}

async function getAllEntradasProdutosItensByIdEntradaService(idEntrada) {
    const entradasProdutosItens = await getAllEntradasProdutosItensByIdEntrada(idEntrada);
    return entradasProdutosItens;
}

async function getEntradaProdutoItemByIdService(idItem) {
    const entradasProdutosItensID = await getEntradaProdutoItemById(idItem);
    return entradasProdutosItensID;
}

module.exports = {
    getAllEntradasProdutosService,
    getAllReceivedEntradasProdutosService,
    getAllCanceledEntradasProdutosService,
    getAllReceivedEntradasProdutosByFilterAndOrderByService,
    getAllCanceledEntradasProdutosByFilterAndOrderByService,
    getEntradaProdutoByIdService,
    changeEntradaProdutoStatusService,
    createEntradaProdutoService,
    getAllEntradasProdutosItensService,
    getAllEntradasProdutosItensByIdEntradaService,
    getEntradaProdutoItemByIdService,
}