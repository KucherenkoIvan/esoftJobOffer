const { Sequelize } = require('sequelize');
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
        const candidate = await User.findOne({Login})
        const candidatePassword = candidate.Password
        console.log({candidatePassword})
        if (!candidate) { //пользователь не найден
            return res.status(500).json({
                errors:[
                    {msg: 'Пользователя с таким логином не существует'}
                ]
            })
        }
        if (!await bcrypt.compare(Password, candidatePassword)) { //пароли не совпали
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
        const hashedPassword = await bcrypt.hash(Password, config.get('cryptoKey'))
        const candidate = await User.findOne({Login})

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
        res.status(500).json({errors: [
            {msg: e.message}
        ]})
    }
})

module.exports = router