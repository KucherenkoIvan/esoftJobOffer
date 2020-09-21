const User = require('../models/User')
const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = Router()

// /api/auth/
router.post('/login', async (req, res) => {
    try {
        const {Login, Password} = req.body
        if (!Login || !Password) {
            console.log('Введите логин и пароль')
            return res.status(500).json({
                errors:[
                    {msg: 'Введите логин и пароль'}
                ]
            })
        }
        const candidate = await User.findOne({where: {Login}})
        const candidatePassword = candidate.Password
        console.log({...candidate, Login, Password})
        if (!candidate) { //пользователь не найден
            console.log('Пользователя с таким логином не существует')
            return res.status(500).json({
                errors:[
                    {msg: 'Пользователя с таким логином не существует'}
                ]
            })
        }
        if (!await bcrypt.compare(Password, candidatePassword)) { //пароли не совпали
            console.log('Некорректный пароль')
            return res.status(500).json({
                errors:[
                    {msg: 'Некорректный пароль'}
                ]
            })
        }
        //если все ок:
        const token = jwt.sign(
            {userID: candidate.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'})

        res.json({token, userID: candidate.id})
    } catch (e) {
        res.status(500).json({errors: [
            {msg: e.message}
        ]})
    }
})


// /api/auth
router.post('/register', async (req, res) => {
    try {
        const {FirstName, LastName, Surname, Login, Password} = req.body

        if (!Login || !Password) {
            console.log('Введите логин и пароль')
            return res.status(500).json({
                errors:[
                    {msg: 'Введите логин и пароль'}
                ]
            })
        }

        const hashedPassword = await bcrypt.hash(Password, config.get('cryptoKey'))
        let candidate = await User.findOne({where: {Login}})
        console.log(candidate)
        if (candidate) {
            console.log('Этот логин занят')
            return res.status(500).json({errors: [
                {msg: 'Этот логин занят'}
            ]})
        }

        candidate = await User.create({FirstName, LastName, Surname, Login, Password: hashedPassword})

        const token = jwt.sign(
            {userID: candidate.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'})

        res.json({token, userID: candidate.id})
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: e.message}
        ]})
    }
})

module.exports = router