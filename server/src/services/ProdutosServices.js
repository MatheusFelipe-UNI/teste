const { getProdutoById
} = require("../repositories/ProdutosRepository");

async function getProdutoByIdService(idProdutos) {
    const produto = await getCestaById(idProdutos);
    return produto
}

module.exports = {
    getProdutoByIdService,
}