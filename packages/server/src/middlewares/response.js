module.exports = (req, res, next) => {
  res.success = (data = null) => {
    res.status(200).json({ status: 0, data })
  }

  res.fail = (data = null) => {
    res.status(200).json({ status: 1, data })
  }

  next()
}
