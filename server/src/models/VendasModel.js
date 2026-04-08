module.exports = (sequelize, DataTypes) => {
   const Vendas = sequelize.define("Vendas", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      fk_id_cliente: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "Clientes",
            key: "id"
         }
      },
      fk_id_user: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "User",
            key: "id"
         }
      },
      fk_id_cesta: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
         references: {
            model: "Cestas",
            key: "id"
         }
      },
      quantidade: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
      valor_unitario: {
         type: DataTypes.DECIMAL(10, 2).UNSIGNED,
         allowNull: false,
      },
      valor_total: {
         type: DataTypes.DECIMAL(10, 2).UNSIGNED,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM("PENDENTE", "CONCLUIDA", "CANCELADA"),
         allowNull: false,
      },
      data_venda: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false,
      },
   }, {
      tableName: "vendas",
      timestamps: false,
      underscored: true
   });

   Vendas.associate = (models) => {
      Vendas.belongsTo(models.Clientes, {
         constraint: true,
         foreignKey: "fk_id_cliente",
         as: "cliente_venda"
      });
      Vendas.belongsTo(models.User, {
         constraint: "fk_id_user",
         as: "user_venda"
      });
      Vendas.belongsTo(models.Cestas, {
         constraint: "fk_id_cesta",
         as: "cesta_venda"
      })
   }

   return Vendas;

};
