module.exports = (sequelize, DataTypes) => {
   const EntradasProdutos = sequelize.define(
      "EntradasProdutos",
      {
         id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         fk_id_user: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
               model: "User",
               key: "id",
            },
         },
         status: {
            type: DataTypes.ENUM("RECEBIDA", "CANCELADA"),
            allowNull: false,
         },
         data_entrada: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
         },
      },
      {
         tableName: "entradas",
         timestamps: false,
         underscored: true,
      },
   );

   EntradasProdutos.associate = (models) => {
      EntradasProdutos.belongsTo(models.User, {
         constraint: true,
         foreignKey: "fk_id_user",
         as: "user_entrada",
      });
      EntradasProdutos.hasMany(models.Entradas_produtos_itens, {
         constraint: true,
         foreignKey: "fk_id_entrada",
         as: "itens_entrada",
      });
   };

   return EntradasProdutos;
};
