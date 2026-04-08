module.exports = (sequelize, DataTypes) => {
   const Itens_cestas = sequelize.define("Itens_cestas", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      fk_id_cesta: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "Cestas",
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
      quantidade: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
   }, {
      tableName: "itens_cestas",
      timestamps: false,
      underscored: true
   });

   Itens_cestas.associate = (models) => {
      Itens_cestas.belongsTo(models.Itens_cestas, {
         constraint: true,
         foreignKey: "fk_id_cesta",
         as: "cestas"
      });
      Itens_cestas.belongsTo(models.Vendas, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "produtos_cesta"
      });
   }

   return Itens_cestas;

};
