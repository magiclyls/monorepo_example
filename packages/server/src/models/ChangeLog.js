// src/models/ProjectLog.js
const mongoose = require('mongoose');

const changeLogSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  projectInfo: {
    name: { type: String, required: true }
  },
  action: { type: String, required: true },
  message: { type: String }
});

// 指定集合名为 'changelog'，否则 Mongoose 会自动加复数
module.exports = mongoose.model('changelog', changeLogSchema, 'changelog');
