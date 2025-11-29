const express = require('express')
const {
  login,
  register,
  getChangeLog,
  addLog
} = require('../controllers/user.controller')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/change-log', getChangeLog)
router.post('/add-log', addLog)

module.exports = router
