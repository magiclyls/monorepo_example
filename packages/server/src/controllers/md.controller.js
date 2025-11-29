const {readFile} = require("../services/file.service");

async function getProjectMd(req, res) {
  const proDir = __dirname.split('/package')[0]

  const readmeMd = `${proDir}/README.md`
  const disableMd = `${proDir}/Disable.md`

  const readMeMdContent = await Promise.all([readFile(readmeMd), readFile(disableMd)])

  res.success({
    readmeMd: readMeMdContent[0],
    disableMd: readMeMdContent[1],
  })
}

module.exports = {
  getProjectMd,
}
