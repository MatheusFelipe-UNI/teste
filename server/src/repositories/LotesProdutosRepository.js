const { Lotes_produtos, sequelize } = require("../models");
const { Op } = require("sequelize");

async function getAllLotesProdutos() {
    const allLotesProdutos = await Lotes_produtos.findAll();
    return allLotesProdutos;
}

async function getAllActiveLotesProdutos() {
    const allActiveLotes = await Lotes_produtos.findAll({
        where: {
            status: "ATIVO"
        },
        attributes: [
            "id",
            "fk_id_produto",
            "valor_unitario",
            "qtd_disponivel",
            "is_vencido",
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.data_validade"), "%d-%m-%Y"), "data_validade",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.created_at"), "%d-%m-%Y %H:%i:%s"), "created_at",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.updated_at"), "%d-%m-%Y %H:%i:%s"), "updated_at",],
        ],
        include: [
            {
                association: "fornecedor_produto",
                attributes: ["id", "nome_fornecedor"],
            }
        ],
    });
    return allActiveLotes;
}

async function getAllInactiveLotesProdutos() {
    const allInactiveLotes = await Lotes_produtos.findAll({
        where: {
            status: "INATIVO"
        },
        attributes: [
            "id",
            "fk_id_produto",
            "valor_unitario",
            "qtd_disponivel",
            "is_vencido",
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.data_validade"), "%d-%m-%Y"), "data_validade",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.created_at"), "%d-%m-%Y %H:%i:%s"), "created_at",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.updated_at"), "%d-%m-%Y %H:%i:%s"), "updated_at",],
        ],
        include: [
            {
                association: "fornecedor_produto",
                attributes: ["id", "nome_fornecedor"],
            }
        ],
    });
    return allInactiveLotes;
}

async function getAllActiveLotesProdutosByFilterAndOrderBy(filters, orderBy) {
    const activateLotes = { status: "ATIVO" };

    const include = [
        {
            association: "fornecedor_produto",
            attributes: ["nome_fornecedor"],
            required: false
        },
        {
            association: "produtos_lote",
            attributes: ["nome_produto", "tipo_unidade"],
        }

    ];

    for (const selectFilter in filters) {
        const value = filters[selectFilter];
        if (value == undefined || value == null || value == "") continue;

        // Procura o lote com base no nome do fornecedor associado a ele.
        else if (selectFilter === 'fornecedor') {
            include[0].where = {
                nome_fornecedor: { [Op.like]: `%${value}%` }
            };
            include[0].required = true;
        }

        // exibe os produtos que irão vencer em x dias (x = núemro de dias dado pelo usuário) 
        else if (selectFilter === 'periodo') {
            const hoje = new Date();
            const dataFim = new Date();
            dataFim.setDate(hoje.getDate() + Number(value));
            activateLotes.data_validade = { [Op.lte]: dataFim };
        }
    }

    const orderDirection = filters.order_direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    let order;
    if (orderBy === 'produtos') {
        order = [[sequelize.col('produtos_lote.nome_produto'), orderDirection]];
    } else {
        order = [[orderBy, orderDirection]];
    }

    const result = await Lotes_produtos.findAll({
        where: activateLotes,
        attributes: [
            "id",
            "fk_id_produto",
            "valor_unitario",
            "qtd_disponivel",
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.data_validade"), "%d-%m-%Y"), "data_validade",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.created_at"), "%d-%m-%Y %H:%i:%s"), "created_at",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.updated_at"), "%d-%m-%Y %H:%i:%s"), "updated_at",],
        ],
        include,
        order,
        raw: true,
        nest: true
    });

    return result;
}

async function getAllLotesProdutosByFornecedor(idFornecedor) {
    const lotesByFornecedor = await Lotes_produtos.findAll({
        where: { fk_id_fornecedor: idFornecedor }
    });
    return lotesByFornecedor;
}

async function getLoteProdutoById(idLoteProduto) {
    const idLote = await Lotes_produtos.findByPk(idLoteProduto);
    return idLote
}

async function getAllLotesProdutosByProduto(idProduto) {
    const lotesByProduto = await Lotes_produtos.findAll({
        where: { fk_id_produto: idProduto }
    });
    return lotesByProduto;
}

async function getAllActiveLotesProdutosByProduto(idProduto) {
    const activeLotesByProduto = await Lotes_produtos.findAll({
        where: {
            status: "ATIVO",
            fk_id_produto: idProduto
        }
    });
    return activeLotesByProduto;
}

async function getAllActiveLotesProdutosByProduto(idProduto) {
    const activeLotesByProduto = await Lotes_produtos.findAll({
        where: {
            status: "ATIVO",
            fk_id_produto: idProduto
        }
    });
    return activeLotesByProduto;
}

async function getAllInactiveLotesProdutosByProduto(idProduto) {
    const inactiveLotesByProduto = await Lotes_produtos.findAll({
        where: {
            status: "INATIVO",
            fk_id_produto: idProduto
        }
    });
    return inactiveLotesByProduto;
}

async function getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy(idProduto, filters, orderBy) {

    const activateLotes = { status: "ATIVO", fk_id_produto: idProduto };

    const include = [
        {
            association: "fornecedor_produto",
            attributes: ["nome_fornecedor"],
            required: false
        },
        {
            association: "produtos_lote",
            attributes: ["nome_produto", "tipo_unidade"],
        }
    ];

    for (const selectFilter in filters) {
        const value = filters[selectFilter];
        if (value == undefined || value == null || value == "") continue;

        // Filtra pelo nome do fornecedor
        if (selectFilter === 'fornecedor') {
            include[0].where = {
                nome_fornecedor: { [Op.like]: `%${value}%` }
            };
            include[0].required = true;
        }
    }

    const orderDirection = filters.order_direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    let order;
    if (orderBy === 'produtos') {
        order = [[sequelize.col('produtos_lote.nome_produto'), orderDirection]];
    } else {
        order = [[orderBy, orderDirection]];
    }

    const result = await Lotes_produtos.findAll({
        where: activateLotes,
        attributes: [
            "id",
            "valor_unitario",
            "qtd_disponivel",
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.data_validade"), "%d-%m-%Y"), "data_validade",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.created_at"), "%d-%m-%Y %H:%i:%s"), "created_at",],
            [sequelize.fn("DATE_FORMAT", sequelize.col("Lotes_produtos.updated_at"), "%d-%m-%Y %H:%i:%s"), "updated_at",],
        ],
        include,
        order,
        raw: true,
        nest: true
    });

    return result;
}

async function createLoteProduto(loteProdutoData) {
        const newLote = {
            fk_id_produto: loteProdutoData.id_produto,
            fk_id_fornecedor: loteProdutoData.id_fornecedor,
            valor_unitario: loteProdutoData.valor_unitario,
            qtd_disponivel: loteProdutoData.qtd_disponivel,
            data_validade: loteProdutoData.data_validade,
            is_vencido: loteProdutoData.is_vencido,
            status: "ATIVO"
        }
    const createdLote = await Lotes_produtos.create(newLote)   
    return createdLote;
}

async function updateLoteProduto(id, updateFields) {

    const rowAffected = await Lotes_produtos.update(updateFields, {
        where: { id: id },
    });
    return rowAffected;
}

async function changeLoteProdutoStatus(id, newStatus) {
    const updateStatus = await Lotes_produtos.update({ status: newStatus }, {
        where: { id: id }
    });
    return updateStatus;
}

module.exports = {
    getAllLotesProdutos,
    getAllActiveLotesProdutos,
    getAllInactiveLotesProdutos,
    getAllActiveLotesProdutosByFilterAndOrderBy,
    getAllLotesProdutosByFornecedor,
    getLoteProdutoById,
    getAllLotesProdutosByProduto,
    getAllActiveLotesProdutosByProduto,
    getAllInactiveLotesProdutosByProduto,
    getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy,
    createLoteProduto,
    updateLoteProduto,
    changeLoteProdutoStatus,
}