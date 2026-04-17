const { Association } = require("sequelize");
const { Cestas, sequelize, Itens_cesta } = require("../models");

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
    const cestaID = await Cestas.findByPk(idCesta);
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

async function updateCesta(id, newCesta) {
    const updateCesta = await Cestas.update(newCesta, {
        where: { id: id }
    });
    return updateCesta;
}

async function deleteItensByCestaID(idCesta) {
    await Itens_cesta.destroy({
        where: { fk_id_cesta: idCesta }
    });
}

async function createItensCesta(itensData) {
    await Itens_cesta.bulkCreate(itensData)
}

module.exports = {
    getAllCestas,
    getAllActiveCestas,
    getAllInactiveCestas,
    getCestaById,
    getAllActiveCestasByFilterAndOrderBy,
    createCesta,
    changeCestaStatus,
    updateCesta,
    deleteItensByCestaID,
    createItensCesta,
}