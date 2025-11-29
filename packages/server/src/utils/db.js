const mongoose = require('mongoose');

async function connectDB() {
  const base = (process.env.MONGODB_URI || '').replace('xxxxxxx', 'MGDBusr_dev').replace('yyyyyyy', encodeURIComponent("P}uSYfeg,>6E@wpV"));
  const uri = base + '/tg-frontend-admin?authSource=admin';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接出错:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
