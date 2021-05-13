const path = require('path')
const fs = require('fs')

 function writeFile (release) {
  const dist = path.join(process.cwd(), './sentry.json')
  let config
  try {
    const jsonStr = fs.readFileSync(dist, 'utf8')
    config = JSON.parse(jsonStr)
  } catch(err) {
    // console.log(`warn: you need sentry.json file in ${dist} is not exsit!`)
    throw new Error(err)
  }
  config.release = release
  
  fs.writeFileSync(dist, JSON.stringify(config, null, 2), { encoding: 'utf8', flag: 'w' })
}
class BasicPlugin{
    // 在构造函数中获取用户给该插件传入的配置
    constructor(options){
        this.release = options.release
    }
    
    // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
    apply(compiler){
      const release = this.release
      compiler.plugin('compilation',function() {
        writeFile(release)
      })
    }
  }

  exports.writeFile = writeFile;
  
  // 导出 Plugin
  module.exports = BasicPlugin;