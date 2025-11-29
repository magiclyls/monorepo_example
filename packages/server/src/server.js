require('dotenv').config()
const app = require('./app')
const v8 = require('v8')
const connectDB = require('./utils/db');

const PORT = process.env.PORT || 3000


connectDB().then(() => {
  app.listen(PORT, () => {

    console.log('最大内存限制:', v8.getHeapStatistics().heap_size_limit / 1024 / 1024, 'MB')
    console.log(`Server running on http://localhost:${PORT}`)
  })
})

