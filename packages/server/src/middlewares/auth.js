const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.fail('没有授权');
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.fail("token")
  }
};

module.exports = {
  auth
}
