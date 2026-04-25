const { EntradasProdutos, sequelize, Entradas_produtos_itens } = require("../models");
const { Op, where } = require("sequelize");

async function getAllEntradasProdutos() {
    const allEntradasProdutos = await EntradasProdutos.findAll({
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allEntradasProdutos;
}

async function getAllReceivedEntradasProdutos() {
    const allReceivedEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "RECEBIDA" //RECEBA!
        },
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allReceivedEntradasProdutos;
}

async function getAllCanceledEntradasProdutos() {
    const allCanceledEntradasProdutos = await EntradasProdutos.findAll({
        where: {
            status: "CANCELADA"
        },
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            }
        ],
        raw: true
    });
    return allCanceledEntradasProdutos;
}

async function getAllReceivedEntradasProdutosByFilterAndOrderBy(filters, orderBy) {
    const receivedProdutos = { status: "RECEBIDA" };

     const include = [
        {
            association: "user_entrada",
            attributes: [],
            required: false
        }
    ];

    for (const selectFilter in filters) {
        const value = filters[selectFilter];
        if (value === undefined || value === null || value === "") continue;

        // Filtro que toma como base a data de hoje subtrai pelo número de dias informado pelo usuário e devolve todas as aquisições RECEBIDAS dentro este periodo.
        if (selectFilter === 'periodo') {
            const hoje = new Date();
            const dataInicio = new Date();
            dataInicio.setDate(hoje.getDate() - Number(value));
            receivedProdutos.data_entrada = { [Op.gte]: dataInicio };
        }

       // Procura a aquisição RECEBIDA com base no nome do usuário que realizou o cadastro. 
        else if (selectFilter === 'usuario') {
            include[0].where = {
                usuario: { [Op.like]: `%${value}%` }
            };
            include[0].required = true;
        }
    }

    const orderDirection = filters.order_direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    let order;
    if (orderBy === 'usuario') {
        order = [[sequelize.col('user_entrada.usuario'), orderDirection]];
    } else {
        order = [[orderBy, orderDirection]];
    }

    const result = await EntradasProdutos.findAll({
        where: receivedProdutos,
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include,
        order,
        raw: true
    });

    return result;
}

async function getAllCanceledEntradasProdutosByFilterAndOrderBy(filters, orderBy) {
    const canceledProdutos = { status: "CANCELADA" };

     const include = [
        {
            association: "user_entrada",
            attributes: [],
            required: false
        }
    ];

    for (const selectFilter in filters) {
        const value = filters[selectFilter];
        if (value === undefined || value === null || value === "") continue;

        // Filtro que toma como base a data de hoje - o número de dias informado pelo usuário e devolve todas as aquisições CANCELADAS dentro este periodo.
        if (selectFilter === 'periodo') {
            const hoje = new Date();
            const dataInicio = new Date();
            dataInicio.setDate(hoje.getDate() - Number(value));
            canceledProdutos.data_entrada = { [Op.gte]: dataInicio };
        }

       // Procura a aquisição CANCELADA com base no nome do usuário que realizou o cancelamento. 
        else if (selectFilter === 'usuario') {
            include[0].where = {
                usuario: { [Op.like]: `%${value}%` }
            };
            include[0].required = true;
        }
    }

    const orderDirection = filters.order_direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    let order;
    if (orderBy === 'usuario') {
        order = [[sequelize.col('user_entrada.usuario'), orderDirection]];
    } else {
        order = [[orderBy, orderDirection]];
    }

    const result = await EntradasProdutos.findAll({
        where: canceledProdutos,
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include,
        order,
        raw: true
    });

    return result;
}

async function getEntradaProdutoById(idEntradaProduto) {
    const EntradaProdutoID = await EntradasProdutos.findByPk(idEntradaProduto, {
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            },
        ]
    });
    return EntradaProdutoID;
}

async function changeEntradaProdutoStatus(idEntrada, newStatus) {
    const updateEntradaStatus = await EntradasProdutos.update({ status: newStatus }, {
        where: {
            id: idEntrada
        }
    });
    return updateEntradaStatus;
}

async function createEntradaProduto(entradaData) {
    const t = await sequelize.transaction();

    try {
        const newEntradaProduto = await EntradasProdutos.create({
            fk_id_user: entradaData.fk_id_user,
            itens_entrada: entradaData.itens_entrada
        }, {
            include: [{
                association: "itens_entrada"
            }],
            transaction: t
        });

        await t.commit();
        return newEntradaProduto;

    } catch (error) {
        console.log(error);
        await t.rollback();
    }
}

/*
========================================================
                   Itens Entradas
========================================================
*/

async function getAllEntradasProdutosItens() {
    const allEntradasProdutoItens = await Entradas_produtos_itens.findAll({
        attributes: [
            "id",
            "fk_id_entrada",
            [sequelize.col("fornecedor_produtos_entrada.nome_fornecedor"), "nome_fornecedor"],
            [sequelize.col("produtos_entrada.nome_produto"), "nome_produto"],
            "quantidade_adquirida",
            [sequelize.fn("DATE_FORMAT", sequelize.col("Entradas_produtos_itens.created_at"), "%d-%m-%Y %H:%i:%s"),"created_at",],
        ],
        include: [
         {
                association: "produtos_entrada",
                attributes: [],
            },
            {
                association: "fornecedor_produtos_entrada",
                attributes: [],
            }
        ]
    });
    return allEntradasProdutoItens;
}

async function getAllEntradasProdutosItensByIdEntrada(idEntrada) {
   const EntradaProdutoID = await EntradasProdutos.findByPk(idEntradaProduto, {
        attributes: [
            "id",
            "status",
            [sequelize.fn("DATE_FORMAT", sequelize.col("data_entrada"), "%d-%m-%Y %H:%i:%s"), "data_entrada"],
            [sequelize.col("user_entrada.usuario"), "usuario"]
        ],
        include: [
            {
                association: "user_entrada",
                attributes: []
            },
        ]
    });
    return EntradaProdutoID;
}

async function getEntradaProdutoItemById(idItem) {
    const entradasProdutosItensID = await Entradas_produtos_itens.findByPk(idItem);
    return entradasProdutosItensID;
}


module.exports = {
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
}