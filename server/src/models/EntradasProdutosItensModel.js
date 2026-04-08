module.exports = (sequelize, DataTypes) => {
   const Entradas_produtos_itens = sequelize.define("Entradas_produtos_itens", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      fk_id_entrada: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "EntradasProdutos",
            key: "id"
         }
      },
      fk_id_produto: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "Produtos",
            key: "id"
         }
      },
      fk_id_fornecedor: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "Fornecedores",
            key: "id"
         }
      },
      quantidade_adquirida: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false,
      },
   }, {
      tableName: "itens_entrada",
      timestamps: false,
      underscored: true
   });

   Entradas_produtos_itens.associate = (models) => {
      Entradas_produtos_itens.belongsTo(models.EntradasProdutos, {
         constraint: true,
         foreignKey: "fk_id_entrada",
         as: "entradas"
      });
      Entradas_produtos_itens.belongsTo(models.Produtos, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "produtos_entrada"
      });
      Entradas_produtos_itens.belongsTo(models.Fornecedores, {
         constraint: true,
         foreignKey: "fk_id_fornecedor",
         as: "fornecedor_produtos_entrada"
      });
   }

   return Entradas_produtos_itens;

};
