module.exports = (sequelize, DataTypes) => {
   const Cestas = sequelize.define("Cestas", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      nome_cesta: {
         type: DataTypes.STRING(200),
         allowNull: false,
      },
      preco: {
         type: DataTypes.DECIMAL(10, 2).UNSIGNED,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM("ATIVO", "INATIVO"),
         allowNull: false,
      },
      quantidade: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false
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
      tableName: "cestas",
      timestamps: false,
      underscored: true
   });

   Cestas.associate = (models) => {
      Cestas.hasMany(models.Itens_cestas, {
         constraint: true,
         foreignKey: "fk_id_cesta",
         as: "itens_cesta"
      });
      Cestas.hasMany(models.Vendas, {
         constraint: true,
         foreignKey: "fk_id_cesta",
         as: "cesta_venda"
      });
   }

   return Cestas;

};
