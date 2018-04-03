buzz-corner Buzzbuzz 的用户端
================================

此项目使用 [Create React App](https://github.com/facebookincubator/create-react-app) 创建

【注意】如果需要在本地使用微信 Web 客户端工具打开网站，并且涉及到微信登录的话，由于安全域名的原因，需要改 hosts 文件，将 buzzbuzzenglish.com 指向 127.0.0.1，并且使用 http://buzzbuzzenglish.com 来访问本地。如果使用 http://127.0.0.1:16111，某些涉及到微信接口的调用会失败。

本地开发环境搭建：
```
git clone git@bitbucket.org:hcdlearning/buzz-corner.git
cd buzz-corner
npm install
npm start
```

开发模式运行：
```
# 跑服务器端以和 api 沟通
npm run server
# 跑客户端界面
npm run client
# 實時編譯CSS
npm run watch-css
```
【注意】如果只是改了客户端文件，那么 `npm run client` 会自动重启，不需要做什么。
但是如果改了服务器端代码，需要 `Ctrl + C` 停止，再重新运行 `npm run server` 以使改动生效。

测试：
```
npm test
npm run server-test
npm run coverage
```

发布：
```
git pull
npm run deploy
```