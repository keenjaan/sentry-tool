const createId = require('./create-hashid')
const BuildReleaseId, {writeFile} = require('./webpack-build-release')

module.exports = {
    createId,
    BuildReleaseId,
    writeFile
}