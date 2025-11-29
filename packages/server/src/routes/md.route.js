const express = require('express')
const {
  getProjectMd
} = require('../controllers/md.controller')

const router = express.Router()

router.get('/', getProjectMd)

module.exports = router
