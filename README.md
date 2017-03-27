本项目开发环境依赖了 nodejs，请在 https://nodejs.org/ 下载并安装最新的版本。
本项目使用 webpack 作为工程脚手架，请访问 http://webpack.github.io/ 掌握相关细节。
本项目中 js 源码使用 es6 编写，并使用 babel 编译至 es5。
本项目中 css 源码使用 less 作为预编译语言。


```bash
npm i && npm run dev
```

默认每个页面都有 [name].js [name].css [name].html，对应开发文件就是 [name].js [name].less [name].jade
在 webpack.config 里面可以详细配置，比如

```javascript
entry: {
	/* 表示这个页面3个文件都有 */
	page1: [ "page1.jade", "page1.js", "page1.less" ],
	/* 只有js文件 */
	page2: [ "page2.js" ],
	/* 只有css和html文件 */
	page3: [ "page3.less", "page3.jade" ]

}
```