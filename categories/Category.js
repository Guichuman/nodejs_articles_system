const Sequelize = require("sequelize");
const connection = require("../database/database")

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


//Category.sync({ force: true }) tenta criar a tabela sempre que rodar o programa
module.exports = Category