const fs = require('fs')
const path = require('path')
// const http = require('http')
const request = require('request')

let config
try {
   const jsonStr = fs.readFileSync('sentry.json', 'utf8')
   config = JSON.parse(jsonStr)
} catch(err) {
    console.log('warn: you need sentry.json file in root, and it\'s object')
    throw new Error(err)
}

// 读取releaseId 
// try {
//     const buildId = fs.readFileSync('./BUILDID.txt', 'utf8')
//     config.release = buildId
// } catch(err) {
//     console.log('读取buildId失败')
//     throw new Error(err)
// }

function getMaps(filePath, returnArr=[]) {
    let files
    try {
        files = fs.readdirSync(filePath, 'utf8')
    } catch {
        throw new Error('no such file in project')
    }
    files.forEach(filename => {
        const filedir = path.join(filePath, filename)
        const ob = fs.statSync(filedir)
        // 排除css.map文件
        if (ob.isFile() && filedir.slice(-6)=== 'js.map' || filedir.slice(-9)=== 'js.map.gz') {
            returnArr.push(filedir)
        }
        if (ob.isDirectory()) {
            getMaps(filedir, returnArr)
        }
    })
    return returnArr
}

/**
 * path 支持数组和字符串
 */
let mapList = []
if (Array.isArray(config.buildRoot)) {
    config.buildRoot.forEach(path => {
        mapList = mapList.concat(getMaps(path))
    })
} else if(typeof config.buildRoot === 'string') {
    mapList = getMaps(config.buildRoot)
} else {
    throw new Error('we need buildRoot for string or array filepath for map file')
}

const streamList = []
mapList.forEach(item => {
    // console.log(item, '====item===')
    streamList.push(fs.createReadStream(item))
})

// 批量删除文件
function removeFile(filelist) {
  filelist.forEach(function(file) {
    fs.unlinkSync(file)
  })
}

function upload() {
    request.post({
      url: config.uploadUrl,
      timeout: 2000,
      formData: {
          attachments: streamList,
          release: config.release
      }
    }, (err, res, body) => {
      // 不管成功失败，都要删除sourcemap文件
      removeFile(mapList)
        if (err) {
            console.log('file upload fail')
            throw new Error(err)
        }
        const r = JSON.parse(body)
        if (body && r.code === '200') {
            console.log('upload success!')
        } else {
            console.log('upload fail')
        }
    })
}

module.exports = upload