module.exports = (sequelize, DataTypes) => {
   const User = sequelize.define("User", {
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
      },
      usuario: {
         type: DataTypes.STRING(45),
         allowNull: false,
      },
      senha: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      nivel_acesso: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
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
      tableName: "users",
      timestamps: false,
      underscored: true
   });

   return User;

};
