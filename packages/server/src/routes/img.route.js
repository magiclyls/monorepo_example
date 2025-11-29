const express = require('express')
const {
  imageList,
  imageConvert,
  imageDelete
} = require('../controllers/img.controller')

const router = express.Router()

router.get('/images-list', imageList)
router.post('/images-convert', imageConvert)
router.post('/images-delete', imageDelete)

module.exports = router
