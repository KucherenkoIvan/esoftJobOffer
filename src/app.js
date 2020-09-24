const config = require('config')
const express = require('express')
const { Sequelize } = require('sequelize');
const fs = require('fs');
const User = require('./models/User');
const Task = require('./models/Task');
const path = require('path')


const app = express()
app.use(express.json())

app.use('/api/task', require('./routes/task.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/user', require('./routes/user.routes'))

app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

app.get('*', (req, res) => {
    console.log(req.url)
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
})

const PORT = config.get('port') || 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


console.log(config.get('POSTGRES_USER'), config.get('POSTGRES_PASSWORD'), config.get('POSTGRES_HOST'))

const sequelize = new Sequelize(config.get('POSTGRES_DATABASE'), 
    config.get('POSTGRES_USER'), 
    config.get('POSTGRES_PASSWORD'), {
        host: config.get('POSTGRES_HOST'),
        dialect: 'postgres',
        logging: () => {}
    })

;(async () => {
    try {
        await sequelize.sync({force: config.get('forceSync')});
        await User.sync({force: config.get('forceSync')});
        await Task.sync({force: config.get('forceSync')});
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
      }
})()