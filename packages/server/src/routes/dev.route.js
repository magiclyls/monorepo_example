const express = require('express')
const {
  startDev,
  stopDev,
  getProjectStatus,
  build,
  stopBuild
} = require('../controllers/dev.controller')
const { auth } = require('../middlewares/auth')

const router = express.Router()

router.get('/', auth, getProjectStatus)
router.post('/start', auth, startDev)
router.post('/stop', auth,  stopDev)
router.post('/build', auth,  build)
router.post('/stop-build', auth, stopBuild)

module.exports = router
