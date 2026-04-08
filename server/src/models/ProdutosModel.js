module.exports = (sequelize, DataTypes) => {
   const Produtos = sequelize.define("Produtos", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      nome_produto: {
         type: DataTypes.STRING(500),
         allowNull: false
      },
      tipo_unidade: {
         type: DataTypes.STRING(50),
         allowNull: false 
      },
      quantidade_estoque: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
      estoque_minimo: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false,
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false,
      }
   }, {
      tableName: "produtos",
      timestamps: false,
      underscored: true
   });

   Produtos.associate = (models) => {
      Produtos.hasMany(models.Entradas_produtos_itens, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "entradas_produto"
      });
      Produtos.hasMany(models.Lotes_produtos, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "lotes_produto"
      });
      Produtos.hasMany(models.Itens_cestas, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "cestas_produto"
      });
   }

   return Produtos;

};
