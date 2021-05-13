const createId = require('./create-hashid')
const BuildReleaseId = require('./webpack-build-release')
const {writeFile} = require('./webpack-build-release')

exports.createId = createId
exports.BuildReleaseId = BuildReleaseId
exports.writeFile = writeFile