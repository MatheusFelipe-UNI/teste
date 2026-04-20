const { Association } = require("sequelize");
const { Cestas, sequelize, Itens_cestas, Produtos } = require("../models");

async function getAllCestas() {
    const allCestas = await Cestas.findAll();
    return allCestas;
}

async function getAllActiveCestas() {
    const allActiveCestas = await Cestas.findAll({
        where: {
            status: "ATIVO"
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            "quantidade",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allActiveCestas;
}

async function getAllInactiveCestas() {
    const allInactiveCestas = await Cestas.findAll({
        where: {
            status: "INATIVO"
        },
        attributes: [
            "id",
            "nome_cesta",
            "status",
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.created_at"), "%d-%m-%Y %H:%i:%s"),
                "created_at",
            ],
            [
                sequelize.fn("DATE_FORMAT", sequelize.col("Cestas.updated_at"), "%d-%m-%Y %H:%i:%s"),
                "updated_at",
            ],
        ]
    })
    return allInactiveCestas;
}

async function getAllActiveCestasByFilterAndOrderBy(whereClause, orderFilters, attributesFilters) {
    const cesta = await Cestas.findAll({
        where: whereClause,
        attributes: attributesFilters,
        order: orderFilters
    });
    return cesta;
}

async function getCestaById(idCesta) {
    const cestaID = await Cestas.findByPk(idCesta, {
        include: [{
            association: "itens_cesta"
        }]
    });
    return cestaID;
}

async function createCesta(cestaData) {
    const t = await sequelize.transaction();

    try {
        const newCesta = await Cestas.create({
            nome_cesta: cestaData.nome_cesta,
            preco: cestaData.preco,
            quantidade: cestaData.quantidade,
            itens_cesta: cestaData.itens_cesta,
            status: "ATIVO"
        }, {
            include: [{
                association: "itens_cesta"
            }],
            transaction: t
        });

        await t.commit();
        return newCesta;

    } catch (error) {
        console.log(error);
        await t.rollback();
    }
}

async function changeCestaStatus(idCesta, newStatus) {
    const updateCesta = await Cestas.update({ status: newStatus }, {
        where: {
            id: idCesta
        }
    });
    return updateCesta
}

async function getProdutosByID(produtos) {
    return await Produtos.findAll({
        where: { id: produtos }
    });
}

/*
==================================================================================
                    CORRIGIR ESTA FUNÇÃO DE UPDATE, NÃO ESTÁ 100%.
==================================================================================

async function updateCesta(idCesta, cestaData, newItens, updateEstoque) {
    const t = await sequelize.transaction();

    try {
        for (const produto of updateEstoque) {
            await Produtos.update(
                { quantidade_estoque: produto.quantidade_estoque },
                { where: { id: produto.id }, transaction: t }
            );
        }

        await Cestas.update(
            { ...cestaData }, 
            { where: { id: idCesta }, transaction: t }
        );

        if (newItens) {
            await Itens_cestas.destroy({
                where: { fk_id_cesta: idCesta },
                transaction: t
            });

            for (const item of newItens) {
                await Itens_cestas.create({
                    fk_id_cesta: idCesta,
                    fk_id_produto: item.fk_id_produto,
                    quantidade: item.quantidade
                }, { transaction: t });
            }
        }

        await t.commit();
        return [1];

    } catch (error) {
        await t.rollback();
        throw error;
    }
}



/*
========================================================
                     Itens Cestas
========================================================
*/

async function getAllCestasItens(idItens) {
    const allCestasItens = await Cestas.findAll({
        include: [{
            association: "itens_cesta"
        }]
    });
    return allCestasItens;
}

async function getAllCestasItensByCestaId(idCesta) {
    const allCestas = await Itens_cestas.findAll({
        where: { fk_id_cesta: idCesta }
    });
    return allCestas
}

async function getCestaItemById(idItem) {
    const itensCesta = await Itens_cestas.findByPk(idItem);
    return itensCesta;
}

module.exports = {
    getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,
    createCesta,
    changeCestaStatus,
    getProdutosByID,
    // Itens cesta
    getAllCestasItens,
    getAllCestasItensByCestaId,
    getCestaItemById,
}