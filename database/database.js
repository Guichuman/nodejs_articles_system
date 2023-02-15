const Sequelize = require('sequelize')
const connection = new Sequelize('guipress', 'root', '12345gui', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection