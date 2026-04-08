module.exports = (sequelize, DataTypes) => {
   const Fornecedores = sequelize.define("Fornecedores", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      nome_fornecedor: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      cnpj: {
         type: DataTypes.STRING(18),
         allowNull: false 
      },
      status: {
         type: DataTypes.ENUM("ATIVO", "INATIVO"),
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
      tableName: "fornecedor",
      timestamps: false,
      underscored: true
   });

   Fornecedores.associate = (models) => {
      Fornecedores.hasMany(models.Entradas_produtos_itens, {
         constraint: true,
         foreignKey: "fk_id_fornecedor",
         as: "entrada_produto_fornecedor"
      });
      Fornecedores.hasMany(models.Lotes_produtos, {
         constraint: true,
         foreignKey: "fk_id_produto",
         as: "produto_fornecedor"
      });
   }

   return Fornecedores;

};
