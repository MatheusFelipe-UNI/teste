module.exports = (sequelize, DataTypes) => {
   const Lotes_produtos = sequelize.define("Lotes_produtos", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
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
      valor_unitario: {
         type: DataTypes.DECIMAL(11,2).UNSIGNED,
         allowNull: false
      },
      qtd_disponivel: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM("ATIVO", "INATIVO"),
         allowNull: false
      },
      is_vencido: {
         type: DataTypes.TINYINT.UNSIGNED,
         allowNull: false
      },
      data_validade: {
         type: DataTypes.DATEONLY,
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
      tableName: "lotes_produtos",
      timestamps: false,
      underscored: true
   });

   Lotes_produtos.associate = (models) => {
      Lotes_produtos.belongsTo(models.Produtos, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "produtos_lote"
      });
      Lotes_produtos.belongsTo(models.Itens_cestas, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "cestas_produto"
      });
   }

   return Lotes_produtos;

};
