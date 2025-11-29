import http from './http.js'

export async function userLogin(data) {
  const res = await http.post('/api/user/login', data)
  return res
}

export async function userRegister(data) {
  const res = await http.post('/api/user/register', data)
  return res
}

export async function getChangeLog(data) {
  const res = await http.get('/api/user/change-log', data)
  return res
}

export async function addLog(data) {
  const res = await http.post('/api/user/add-log', data)
  return res
}

export async function getLangExist() {
  const res = await http.get('/api/git/get-path')
  return res
}

export async function getUpdateLocalFile(data) {
  const res = await http.post('/api/git/update-local-file', data)
  return res
}

export async function initGit() {
  const res = await http.get('/api/git')
  return res
}

export async function getGitList(data) {
  const res = await http.get('/api/git/get-lang-list', data)
  return res
}

export async function getGitData(data) {
  const res = await http.get('/api/git/get-lang-data', data)
  return res
}

export async function getGitPull(data) {
  const res = await http.get('/api/git/get-last-commit', data)
  return res
}

export async function updateLang(data) {
  const res = await http.post('/api/git/update-lang', data)
  return res
}

export async function updateAllLang(data) {
  const res = await http.post('/api/git/update-all-lang', data)
  return res
}

export async function addLang(data) {
  const res = await http.post('/api/git/add-lang', data)
  return res
}

export async function imagesList(data) {
  const res = await http.get('/api/img/images-list', data)
  return res
}

export async function imagesDelete(data) {
  const res = await http.post('/api/img/images-delete', data)
  return res
}

export async function imagesConvert(data) {
  const res = await http.post('/api/img/images-convert', data)
  return res
}

export async function getHomeMd(data) {
  const res = await http.get('/api/md', data)
  return res
}

export async function getDev(data) {
  const res = await http.get('/api/dev', data)
  return res
}

export async function startDev(data) {
  const res = await http.post('/api/dev/start', data)
  return res
}

export async function stoptDev(data) {
  const res = await http.post('/api/dev/stop', data)
  return res
}

export async function devBuild(data) {
  const res = await http.post('/api/dev/build', data)
  return res
}

export async function devStopBuild(data) {
  const res = await http.post('/api/dev/stop-build', data)
  return res
}

export async function synchronousApi(data) {
  const res = await http.post('/api/git/synchronous', data)
  return res
}

export async function getCurrentBranch(data) {
  const res = await http.get('/api/git/get-current-branch', data)
  return res
}

export async function createBranch(data) {
  const res = await http.post('/api/git/create-branch', data)
  return res
}
