const config = require('config')
const express = require('express')
const { Sequelize } = require('sequelize');
const fs = require('fs');
const User = require('./models/User');
const Task = require('./models/Task');


const app = express()
app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'))
const PORT = config.get('port') || 3000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.json({status: 'running'})
})


const sequelize = new Sequelize(config.get('POSTGRES_DATABASE'), 
    config.get('POSTGRES_USER'), 
    config.get('POSTGRES_PASSWORD'), {
        host: 'localhost',
        dialect: 'postgres',
        logging: () => {}
    })

;(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({force: config.get('forceSync')});
        console.log(await User.findAll())
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
      }
})()