const User = require('../models/User')
const {Router, request} = require('express')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = Router()

// /api/auth/
router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
                
        if (!req.body || !req.body.Login || !req.body.Password) {
            console.log('Введите логин и пароль')
            return res.status(500).json({
                errors:[
                    {msg: 'Введите логин и пароль'}
                ]
            })
        }
        const {Login, Password} = req.body
        console.log(1)
        const candidate = await User.findOne({where: {Login}})
        if (!candidate) { //пользователь не найден
            console.log('Пользователя с таким логином не существует')
            return res.status(500).json({
                errors:[
                    {msg: 'Пользователя с таким логином не существует'}
                ]
            })
        }
        const candidatePassword = candidate.Password
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


        if (!req.body || !req.body.Login || !req.body.Password) {
            console.log('Введите логин и пароль')
            return res.status(500).json({
                errors:[
                    {msg: 'Введите логин и пароль'}
                ]
            })
        }


        const {FirstName, LastName, Surname, Login, Password, confirmedPassword} = req.body

        if (Password != confirmedPassword) {
            return res.status(500).json({errors: [
                {msg: 'Парооли доджны совпадать'}
            ]})
        }

        const hashedPassword = await bcrypt.hash(Password, config.get('cryptoKey'))
        let candidate = await User.findOne({where: {Login}})
        if (candidate) {
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