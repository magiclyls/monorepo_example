const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ChangeLog = require('../models/ChangeLog');

exports.getUsers = (req, res) => {
  res.success([{ id: 1, name: 'Tim' }])
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '60d' }
  );
}

const register = async (req, res) => {
  const { username, password } = req.body;
  console.log("🚀 ~ register ~ password: ", password);
  console.log("🚀 ~ register ~ username: ", username);

  try {
    const exist = await User.findOne({ username });
    if (exist) return res.fail('用户名已存在');

    const user = await User.create({ username, password });
    const token = signToken(user);
    res.success({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.fail({ message: '注册失败', error: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log("🚀 ~ login ~ user: ", user);
  if (!user || user.password !== password) {
    return res.fail('用户名或密码错误');
  }
1
  const token = generateToken(user);

  if (!user || user.password !== password) {
    return res.fail('登录失败')
  }

  return res.success({
    msg: `登录成功 ${username}`,
    username: username,
    token: token
  })
}

async function addLog(req, res) {
  const { log } = req.body;
  try {
    const createAt = new Date();
    console.log('xxxx', { ...log, createdAt: createAt })
    const changeLog = await ChangeLog.create({ ...log, createdAt: createAt });
    res.success("添加日志成功")
  } catch (err) {
    res.fail(`添加日志失败 ${err.message}`);
  }
}

async function getChangeLog(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const changeLogs = await ChangeLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await ChangeLog.countDocuments();
    res.success({
      changeLogs,
      total,
      page,
      limit
    });
  } catch (err) {
    res.fail(`获取日志失败 ${err.message}`);
  }
}

module.exports = {
  login,
  register,
  getChangeLog,
  addLog
};
