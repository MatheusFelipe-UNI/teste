module.exports = (sequelize, DataTypes) => {
   const Clientes = sequelize.define("Clientes", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      nome_cliente: {
         type: DataTypes.STRING(100),
         allowNull: false,
      },
      telefone: {
         type: DataTypes.STRING(20),
         allowNull: false,
      },
      cpf_cnpj: {
         type: DataTypes.STRING(18),
         allowNull: false,
      },
      tipo_cliente: {
         type: DataTypes.ENUM("PESSOA_FISICA", "PESSOA_JURIDICA"),
         allowNull: false
      },
      status: {
         type: DataTypes.ENUM("ATIVO", "INATIVO"),
         allowNull: false,
         defaultValue: "ATIVO"
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
         allowNull: false
      }
   }, {
      tableName: "clientes",
      timestamps: false,
      underscored: true
   });

   Clientes.associate = (models) => {
      Clientes.hasMany(models.Vendas, {
         constraint: true,
         foreignKey: "fk_id_cliente",
         as: "cliente_venda"
      })
   }

   return Clientes;

};
