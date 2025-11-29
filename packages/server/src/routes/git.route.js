const express = require('express')
const {
  initGitRepo,
  getLangGitPathIsExist,
  getLangData,
  getGitLangList,
  getGitLastCommit,
  updateLang,
  addLang,
  updateAllLang,
  updateLocalFile,
  synchronous,
  getCurrentBranchHandle,
  createBranchHandle
} = require('../controllers/git.controller')
const { auth } = require('../middlewares/auth')

const router = express.Router()

router.get('/', auth, initGitRepo)
router.get('/get-path', auth, getLangGitPathIsExist)
router.get('/get-lang-data', auth, getLangData)
router.get('/get-lang-list', auth, getGitLangList)
router.get('/get-last-commit', auth, getGitLastCommit)
router.get('/get-current-branch', auth, getCurrentBranchHandle)
router.post('/create-branch', auth, createBranchHandle)
router.post('/update-lang',auth, updateLang)
router.post('/add-lang', auth, addLang)
router.post('/update-all-lang', auth, updateAllLang)
router.post('/update-local-file', auth, updateLocalFile)
router.post('/synchronous', auth, synchronous)

module.exports = router
