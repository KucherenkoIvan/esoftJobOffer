const {Router} = require('express')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const config = require('config')

const router = Router()

router.get('/subordinates', auth, async (req, res) => {
    try {
        const {userID} = req
        const data = await User.findAll({where: {Chief: userID}})
        const self = await User.findOne({where: {id: userID}})
        res.json([...data, self])
    }
    catch(e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: 'Ошибка'}
        ]})
    }

})

router.get('/join', auth, async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.userID}})

        const token = jwt.sign(
            {Login: user.Login},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
            )

        res.json(token)
    } catch (e) {
        
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.params.id}})

        res.json(user)
    } catch (e) {
        console.log(e)
        res.status(500).json({errors: [
            {msg: 'Ошибка'}
        ]})
    }
})

// TODO: расширить возможности редактирования
router.patch('/self', auth, async (req, res) => {
    try {
        const {connectionCode} = req.body

        const decoded = jwt.decode(connectionCode).Login

        const Chief = await User.findOne({where: {Login: decoded}})

        if (!Chief) {
            throw new Error()
        }

        if (Chief.id === req.userID) {
            return res.status(500).json({errors: [
                {msg: 'Недопустимый код'}
            ]})
        }


        const user = await User.findOne({where: {id: req.userID}})

        user.Chief = Chief.id
        const data = await user.save()
        res.json(data)

    } catch (e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: 'Ошибка'}
        ]})
    }
})
module.exports = router