module.exports = {
  development: {
    username: "root",
    password: "1234",
    database: "controle_estoque",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    timezone: "-03:00"
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_USERNAME,
    database: process.env.TEST_DB_DATABASE,
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    dialect: process.env.TEST_DB_DIALECT,
    timezone: "-03:00"
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: process.env.PROD_DB_DIALECT,
    timezone: "-03:00"
  }
}
