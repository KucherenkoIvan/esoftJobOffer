const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    console.log(req.body)
    if (!authorization) {
        return res.status(401).json({errors: [
            {msg: 'Нет авторизации'}
        ]})
    }
    console.log(authorization)
    if (!jwt.verify(authorization, config.get('jwtSecret'))) {
        return res.status(500).json({errors: [
            {msg: 'Токен авторизации недействителен'}
        ]})
    }
    req.userID = jwt.decode(authorization).userID
    next()
    
}