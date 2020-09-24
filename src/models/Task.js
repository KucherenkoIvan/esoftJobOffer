const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const User = require('./User')
const config = require('config')

const sequelize = new Sequelize(config.get('POSTGRES_DATABASE'), 
    config.get('POSTGRES_USER'), 
    config.get('POSTGRES_PASSWORD'), {
        host: config.get('POSTGRES_HOST'),
        dialect: 'postgres',
        logging: () => {}
    })

const Task = sequelize.define('Task', {
    // Model attributes are defined here
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Shortcut: {
        type: DataTypes.STRING
    },
    Deadline: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    Priority: {
        type: Sequelize.ENUM,
        values: ['низкий', 'средний', 'высокий'],
        allowNull: false
    },
    Status: {
        type: Sequelize.ENUM,
        values: ['к выполнению', 'выполняется', 'выполнена', 'отменена'],
        allowNull: false
    },
    Sender: {
        type: INTEGER,
        allowNull: false
    },
    Receiver: {
        type: INTEGER,
        allowNull: false
    }

    }, {
        tableName: 'Task'
})


module.exports = Task