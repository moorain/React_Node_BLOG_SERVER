const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
const util = require('../utils');

const gogogo = 'gogogo'; //秘钥


// 根据需求,读取相应的页面,并返回
function render(page) {
  return new Promise((resolve, reject) => {
    let pageUrl = `./www/${page}`;
    //生成二进制流
    fs.readFile(pageUrl, "binary", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

// 识别url,判断所请求的页面
async function route(url) {
  let html = await render('index.html');
  return html;
}

router.get('/index.html', async (ctx) => {
  let url = ctx.request.url;
  let html = await route(url);
  ctx.body = html;
})

// router.post('/login', ctx => {
//   const { username, password } = ctx.request.body;
//   if (!(username === 'admin' && password === 'admin')) {
//     ctx.body = util.res(null, false, '账号密码错误！');
//     return;
//   }
//   /* 要在token中携带的信息 */
//   let payload = { username };

//   /* 签发token，此处采用对称加解密来加密签名，密钥为: 'moorain' */
//   const token = jwt.sign(payload, gogogo, {
//     notBefore: 30, // token将在签发的30s后才开始 生效
//     expiresIn: 300 // token的有效时间为120s
//   });

//   ctx.cookies.set('token', token, {
//     domain: '', // 写cookie所在的域名
//     path: '/', // 写cookie所在的路径
//     maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
//     expires: new Date(new Date().getTime() + 60 * 1000 * 15), // cookie失效时间
//     httpOnly: false, // 是否只用于http请求中获取
//     overwrite: false // 是否允许重写
//   })

//   ctx.type = 'json';
//   ctx.body = util.res(null, true, '登录成功！');

// }).use('/morain', (ctx, next) => { // 自定针对 /morain 路由进行处理的中间件
//   /* 从请求头中取出客户端携带的token */
//   const clientToken = ctx.cookies.get('token');
//   let decoded = null;
//   try {
//     decoded = jwt.verify(clientToken, gogogo, { ignoreNotBefore: true });
//     // console.log(decoded, 'decoded')
//     /* 验证成功 */
//     next();
//   } catch (err) {
//     // console.log(err, 'err')
//     // console.log(err.name + ': ' + err.message);
//     /* 捕获错误即已说明无权，抛出401 */
//     // ctx.throw(401);
//     ctx.body = util.res(null, false, '登录信息无效，请重新登录！', { code: 401 });
//   }
// })

// router.get('/morain/user', (ctx) => {
//   ctx.body = {
//     isSuccess: true,
//     msg: '验证成功！'
//   };
// })

module.exports = router