const express = require('express')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const responseWrapper = require('./middlewares/response')
const gitRoutes = require('./routes/git.route')
const userRoutes = require('./routes/user.route')
const imgRoutes = require('./routes/img.route')
const mdRoutes = require('./routes/md.route')
const devRoutes = require('./routes/dev.route')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(responseWrapper)

app.use('/api/user', userRoutes)
app.use('/api/git', gitRoutes)
app.use('/api/img', imgRoutes)
app.use('/api/md', mdRoutes)
app.use('/api/dev', devRoutes)
app.use(errorHandler)

module.exports = app
