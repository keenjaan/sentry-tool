1、在项目根目录新建 sentry.json 文件，文件内容为json。
2、配置相应字段：

```json
    {
        "dsn": "http://${host}/err/607041376c7001f9069e7380",
        "buildRoot": ["./dist/js"],
        "uploadUrl": "http://${host}/sentry/source/upload/5eb51a026f421e870628362b"
    }
```
字段说明：
dsn: sdk上传的url链接
buildRoot: js的map文件存放目录, 支持字符串和数组类型。
uploadUrl: 项目的sourcemap上传地址。

3、 在webpack的相关配置文件中配置如下：

```js
const {createId, BuildReleaseId} = require('sentry-tool')
const release = createId()

module.exports = {
    configureWebpack: {
      devtool: 'hidden-source-map',
        plugins: [
          new webpack.DefinePlugin({
            RELEASE: JSON.stringify(release),
            DSN: JSON.stringify(sentry.dsn)
          }),
          new BuildReleaseId({release: release})
        ]
      }
  }
```

主要作用是生成随机release， 构建生成release 会写到sentry.json文件里，，用于在项目发布时，上传source map文件时release使用。

4、上传map文件：

在文件在本地打包，生成map文件后，执行：

sentry-tool 命令即可自动上传map文件。