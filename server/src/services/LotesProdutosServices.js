const CannotCreateError = require("../classes/CannotCreateError");
const ExistsDataError = require("../classes/ExistsDataError");
const CannotupdateError = require("../classes/CannotUpdateError");
const {
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
} = require("../repositories/LotesProdutosRepository");
const FieldUndefinedError = require("../classes/FieldUndefinedError");

async function getAllLotesProdutosService() {
    const allLotesProdutos = await getAllLotesProdutos();
    return allLotesProdutos;
}

async function getAllActiveLotesProdutosService() {
    const allActiveLotesProdutos = await getAllActiveLotesProdutos();
    return allActiveLotesProdutos;
}

async function getAllInactiveLotesProdutosService() {
    const allInactiveLotesProdutos = await getAllInactiveLotesProdutos();
    return allInactiveLotesProdutos;
}

async function getAllActiveLotesProdutosByFilterAndOrderByService(orderBy, filterOptions) {
    let filters = {};
    if (filterOptions) {
        try {
            filters = typeof filterOptions === 'string' ? JSON.parse(filterOptions) : filterOptions;
        } catch (error) {
            filters = {};
        }
    }

    const allowedOrderFields = ['id', 'produtos', 'fk_id_fornecedor', 'valor_unitario', 'qtd_disponivel', 'data_validade', 'created_at', 'updated_at'];
    const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'created_at';

    return await getAllActiveLotesProdutosByFilterAndOrderBy(filters, validOrderBy);
}

async function getAllLotesProdutosByFornecedorService(idFornecedor) {
    const lotesByFornecedor = await getAllLotesProdutosByFornecedor(idFornecedor);
    return lotesByFornecedor
}

async function getLoteProdutoByIdService(idLoteProduto) {
    const idLote = await getLoteProdutoById(idLoteProduto);
    return idLote
}

async function getAllLotesProdutosByProdutoService(idProduto) {
    const lotesByProduto = await getAllLotesProdutosByProduto(idProduto);
    return lotesByProduto
}

async function getAllActiveLotesProdutosByProdutoService(idProduto) {
    const activeLotesByProduto = await getAllActiveLotesProdutosByProduto(idProduto);
    return activeLotesByProduto
}

async function getAllInactiveLotesProdutosByProdutoService(idProduto) {
    const inactiveLotesByProduto = await getAllInactiveLotesProdutosByProduto(idProduto);
    return inactiveLotesByProduto
}

async function getAllActiveLotesProdutosByProdutoWithFilterAndOrderByService(idProduto, { orderBy, filterOptions }) {
    let filters = {};
    if (filterOptions) {
        try {
            filters = typeof filterOptions === 'string' ? JSON.parse(filterOptions) : filterOptions;
        } catch (error) {
            filters = {};
        }
    }

    const allowedOrderFields = ['id', 'fk_id_fornecedor', 'valor_unitario', 'qtd_disponivel', 'data_validade', 'created_at', 'updated_at'];
    const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'created_at';

    return await getAllActiveLotesProdutosByProdutoWithFilterAndOrderBy(idProduto, filters, validOrderBy);
}

async function createLoteProdutoService(loteProdutoData) {

const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

    if(loteProdutoData.data_validade <= hoje) {
        throw new CannotCreateError ("O lote não pode ser criado com prazo de validade inferior ao dia de hoje");
    }
    
    const createdLote = await createLoteProduto(loteProdutoData);
    return createdLote
}

async function updateLoteProdutoService(id, lotesData) {
    const { id_fornecedor, valor_unitario, qtd_disponivel, data_validade, is_vencido } = lotesData
    const lote = await getLoteProdutoByIdService(id);
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

    if (!lote) {
        throw new ExistsDataError ("Lote não localizado!")
    }

    if(data_validade && data_validade <= hoje) {
        throw new CannotupdateError ("O lote não pode ser editado usando um prazo de validade inferior ao dia de hoje");
    }

    const updateFields = {};
    if (is_vencido !== undefined) updateFields.is_vencido = is_vencido;
    if (id_fornecedor !== undefined) updateFields.fk_id_fornecedor = id_fornecedor;
    if (valor_unitario !== undefined) updateFields.valor_unitario = valor_unitario;
    if (qtd_disponivel !== undefined) updateFields.qtd_disponivel = qtd_disponivel;
    if (data_validade !== undefined) updateFields.data_validade = data_validade;

    if (Number(is_vencido) === 1) {
        updateFields.status = "INATIVO";
    }

    return await updateLoteProduto(id, updateFields)
}

async function changeLoteProdutoStatusService(id, newStatus) {
    const lote = await getLoteProdutoByIdService(id)
    const formattedNewStatus = newStatus.toUpperCase();

    if (!lote){
        throw new ExistsDataError("Lote de Produto não localizado!")
    }

    if (formattedNewStatus !== "ATIVO" && formattedNewStatus !== "INATIVO") {
        throw new FieldUndefinedError ("Utilize ATIVO ou INATIVO")
    }

        const statusAtual = lote.status;
    if (formattedNewStatus == statusAtual) {
        throw new ExistsDataError(`Este lote já se encontra com o status: ${formattedNewStatus}`);
    }

    const updateStatus = await changeLoteProdutoStatus (id, formattedNewStatus);
    return updateStatus;
}

module.exports = {
    getAllLotesProdutosService,
    getAllActiveLotesProdutosService,
    getAllInactiveLotesProdutosService,
    getAllActiveLotesProdutosByFilterAndOrderByService,
    getAllLotesProdutosByFornecedorService,
    getLoteProdutoByIdService,
    getAllLotesProdutosByProdutoService,
    getAllActiveLotesProdutosByProdutoService,
    getAllInactiveLotesProdutosByProdutoService,
    getAllActiveLotesProdutosByProdutoWithFilterAndOrderByService,
    createLoteProdutoService,
    updateLoteProdutoService,
    changeLoteProdutoStatusService,
}