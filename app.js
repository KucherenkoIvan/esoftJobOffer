const {Client} = require('pg')
const config = require('config')
const express = require('express')

const app = express()

app.listen(3000, () => {
    console.log('server started')
})

app.get('/', (req, res) => {
    res.json({status: 'running'})
})

const client = new Client(
    {
        user: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DATABASE')
    }
)

;(async () => {
    await client.connect()
    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await client.end()
})()