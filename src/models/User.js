const { Sequelize, DataTypes } = require('sequelize');
const config = require('config')

const sequelize = new Sequelize(config.get('POSTGRES_DATABASE'), 
    config.get('POSTGRES_USER'), 
    config.get('POSTGRES_PASSWORD'), {
        host: 'localhost',
        dialect: 'postgres'
    })


const User = sequelize.define('User', {
    // Model attributes are defined here
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING
        },
        Surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Chief: {
            type: DataTypes.INTEGER
        }

    }, {
        tableName: 'User'
})

module.exports = User