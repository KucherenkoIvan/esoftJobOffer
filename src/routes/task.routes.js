const User = require('../models/User')
const Task = require('../models/Task')
const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth.middleware')
const {Op} = require('sequelize')

const router = Router()

// /api/task/
router.get('/', auth, async (req, res) => {
    try {
        const {userID} = req
        let tasks = []

        const currDate = new Date()
        const today = new Date(`${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`)


        if (req.query.group === 'all') {
            tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {Sender: userID},
                        {Receiver: userID}
                    ]
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            })
        }
        else if (req.query.group === 'by_day') {
            const tomorrow = new Date(+today + 24*3600*1000)
            tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {Sender: userID},
                        {Receiver: userID}
                    ],
                    Deadline: {
                        [Op.between]: [today, tomorrow]
                    }
                }
            })

        }
        else if (req.query.group === 'by_week') {
            const nextWeek = new Date(+today + 7*24*3600*1000)
            tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {Sender: userID},
                        {Receiver: userID}
                    ],
                    Deadline: {
                        [Op.between]: [today, nextWeek]
                    }
                }
            })
        }
        else if (req.query.group === 'by_ever') {            
            const nextWeek = new Date(+today + 7*24*3600*1000)
            tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {Sender: userID},
                        {Receiver: userID}
                    ],
                    Deadline: {
                        [Op.gt]: nextWeek
                    }
                }
            })
        }
        else if (req.query.group === 'by_subs') {
            tasks = await Task.findAll({
                where: {
                    [Op.or]: [
                        {Sender: userID},
                        {Receiver: userID}
                    ]
                },
                group: ['Receiver', 'id']
            })
        }
        else throw new Error('Ошибка группировки')
        console.log(tasks)

        res.json(tasks)
    }
    catch(e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: 'Ошибка'}
        ]})
    }
})


router.post('/', auth, async (req, res) => {
    const {Title, Shortcut, Deadline, Priority, Status, Receiver} = req.body
    try {
        if (!Title || !Deadline || !Priority || !Status || !Receiver) {
            throw new Error('Недопустимое значение одного из полей')
        }
        const task = await Task.create({
            Sender: req.userID,
            Title,
            Shortcut, 
            Deadline, 
            Priority, 
            Status, 
            Receiver
        })
        res.json(task)
    }
    catch(e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: e.message}
        ]})
    }
})


router.patch('/', auth, async (req, res) => {
    
    try {
        const {Title, Shortcut, Deadline, Priority, Status, Receiver, id} = req.body

        if (!Title || !Deadline || !Priority || !Status || !Receiver) {
            throw new Error('Недопустимое значение одного из полей')
        }

        const t = await Task.findOne({where: {id}})

        console.log(req.body)

        t.Title = Title
        t.Shortcut = Shortcut
        t.Deadline = Deadline
        t.Priority = Priority
        t.Status = Status
        t.Receiver = Receiver
        
        const data = await t.save()
        
        res.json(data)
        console.log({data, status: 'updated'})
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({errors: [
            {msg: e.message}
        ]})
    }
})

module.exports = router