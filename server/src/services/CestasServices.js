const { getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,
    createCesta,
    changeCestaStatus,
    getProdutosByID,
    //Itens cestas
    getAllCestasItens,
    getAllCestasItensByCestaId,
    getCestaItemById,
} = require("../repositories/CestasRepository");
const { Op } = require("sequelize");
const { Cestas, sequelize, Itens_cestas, Produtos } = require("../models");
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

async function updateCestaService(idCesta, updateData) {
    const oldCesta = await getCestaByIdService(idCesta);

    if(!oldCesta) {
        throw new NotFoundError("Cesta não encontrada!");
    }

    const updateQTD = updateData.quantidade !== undefined && updateData.quantidade !== oldCesta.quantidade;
    const updateItens = updateData.itens_cesta !== undefined;

    const newQTD = updateData.quantidade ?? oldCesta.quantidade;
    const newItens = updateData.itens_cesta || oldCesta.itens_cesta;

    const attEstoque = [];

    if (updateQTD || updateItens) {
        const estoque = {};

        for (const item of oldCesta.itens_cesta) {
            const id = item.fk_id_produto;
            estoque[id] = (estoque[id] || 0) + (oldCesta.quantidade * item.quantidade);
        }

        for (const item of newItens) {
            const id = item.fk_id_produto;
            estoque[id] = (estoque[id] || 0) - (newQTD * item.quantidade);
        }
        const produtos = Object.keys(estoque);
        const idProdutos = await getProdutosByID(produtos);

        for (const produto of idProdutos) {
            const produtoSaldo = estoque[produto.id];

            if (produtoSaldo !== 0) {
                const estoqueFinal = produto.quantidade_estoque + produtoSaldo;
                if (estoqueFinal < 0) {
                    throw new ExistsDataError(`Estoque insuficiente para "${produto.nome_produto}"`);
                }
                attEstoque.push({
                    id: produto.id,
                    quantidade_estoque: estoqueFinal
                });
            }
        }
    }
const cestaData = {
    nome_cesta: updateData.nome_cesta ?? oldCesta.nome_cesta,
    preco: updateData.preco ?? oldCesta.preco,
    quantidade: newQTD
};

return (idCesta, cestaData, updateItens ? newItens : null, attEstoque);

}

/*
========================================================
                     Itens Cestas
========================================================
*/

async function getAllCestasItensService(idCesta) {
    const allCestasItens = await getAllCestasItens(idCesta);
    return allCestasItens;
}

async function getAllCestasItensByCestaIdService(idCesta) {
    const itensByCesta = await getAllCestasItensByCestaId(idCesta);
    return itensByCesta;
}

async function getCestaItemByIdService(idItem) {
    const cestaItem = await getCestaItemById(idItem);
    return cestaItem;
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
    //Itens cestas
    getAllCestasItensService,
    getAllCestasItensByCestaIdService,
    getCestaItemByIdService,
}