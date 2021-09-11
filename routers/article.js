
const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
const util = require('../utils');
const blogController = require('../controller/blog');

const gogogo = 'gogogo';

// 登录验证
router.post('/login', ctx => {
  const { username, password } = ctx.request.body;
  if (!(username === 'admin' && password === 'admin')) {
    ctx.body = util.res(null, false, '账号密码错误！');
    return;
  }
  /* 要在token中携带的信息 */
  let payload = { username };

  /* 签发token，此处采用对称加解密来加密签名，密钥为: 'moorain' */
  const token = jwt.sign(payload, gogogo, {
    notBefore: 30, // token将在签发的30s后才开始 生效
    expiresIn: 3000 // token的有效时间为120s
  });

  ctx.cookies.set('token', token, {
    domain: '', // 写cookie所在的域名
    path: '/', // 写cookie所在的路径
    maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
    expires: new Date(new Date().getTime() + 60 * 1000 * 15), // cookie失效时间
    httpOnly: false, // 是否只用于http请求中获取
    overwrite: false // 是否允许重写
  })

  ctx.type = 'json';
  ctx.body = util.res(null, true, '登录成功！');

}).use('/morain', async (ctx, next) => { // 自定针对 /morain 路由进行处理的中间件
  /* 从请求头中取出客户端携带的token */
  const clientToken = ctx.cookies.get('token');
  let decoded = null;
  try {
    decoded = jwt.verify(clientToken, gogogo, { ignoreNotBefore: true });
    /* 验证成功 */
    decoded.username && await next();
  } catch (err) {
    /* 捕获错误即已说明无权，抛出401 */
    // ctx.throw(401);
    ctx.body = util.res(null, false, '登录信息无效，请重新登录！', { code: 401 });
  }
})

// 查询文章列表
router.get('/articleLists', async (ctx) => {
  let id = ctx.request.query.id
  let findJson = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '../public/data/articleLists.json'), function (err, data) {
        if (err) {
          resolve(util.res(null, false, err))
          return console.error(err);
        }
        let jsonData = data.toString();//将二进制的数据转换为字符串
        if (!jsonData) {
          resolve(util.res([], true, '暂无数据！'))
          return;
        }
        jsonData = JSON.parse(jsonData);//将字符串转换为json对象
        // 有id值=>单个 无id值=>全部
        if (id) {
          jsonData = jsonData.filter((item) => `${item.id}` === `${id}`);
          resolve(util.res(jsonData, true, '查询成功!'))
        } else {
          resolve(util.res(jsonData, true, '查询成功!'))
        }
      })
    })
  }

  ctx.body = await findJson();
})

// 查询所有图片
router.get('/queryAllImages', async (ctx) => {
  let findJson = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(__dirname, '../public/img'), function (err, data) {
        if (err) {
          resolve(util.res(null, false, err))
          return console.error(err);
        }
        if (data) {
          resolve(util.res(data, true, '查询成功!'))
        }
      })
    })
  }

  ctx.body = await findJson();
})


blogController(router);

module.exports = router;
