const { Produtos } = require("../models");

async function getProdutoById(idProdutos) {
    const produto = await Produtos.findByPk(idProdutos);
    return produto;
}

module.exports = {
    getProdutoById,
}