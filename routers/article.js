
const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
const util = require('../utils');

const gogogo = 'gogogo';
// 登录验证

// 更新json文件Func
async function updateJson({ type, newData, id, pathStr }) {
  // 更新json文件
  const read = () => {
    return new Promise((resolve) => {
      fs.readFile(pathStr, function (err, data) {
        resolve(data)
      })
    })
  }

  //写入json文件
  const writeFiles = (str, writePath) => {
    return new Promise((resolve) => {
      fs.writeFile(writePath, str, function (err) {
        resolve(util.res(null, true, '上传成功！'))
      })
    })
  }

  const data = await read();

  let jsonData = data && data.toString();//将二进制的数据转换为字符串

  if (!jsonData) {
    jsonData = JSON.stringify([])
  }

  let str;
  const Arr = JSON.parse(jsonData);

  if (type === 'add') {
    const newJsonData = [newData, ...Arr];
    str = JSON.stringify(newJsonData);
  }
  const res = await writeFiles(str, pathStr)
  return res
}

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

router.get('/morain/user', (ctx) => {
  ctx.body = {
    isSuccess: true,
    msg: '验证成功！'
  };
})

// 上传文件、文章
router.post('/morain/uploadfile', async (ctx, next) => {
  const { title, description } = ctx.request.body;

  if (!(title && description)) {
    return ctx.body = util.res(null, false, '名称&描述不能为空！');
  }

  // 获取时间戳
  const now = moment();
  const id = now.valueOf();
  // 上传单个文件

  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../public/upload') + `/${id}.md`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);

  // 更新json文件
  const read = () => {
    return new Promise((resolve) => {
      fs.readFile(path.join(__dirname, '../public/data/articleLists.json'), function (err, data) {
        resolve(data)
      })
    })
  }

  const writeFiles = (str) => {
    return new Promise((resolve) => {
      fs.writeFile(path.join(__dirname, '../public/data/articleLists.json'), str, function (err) {
        resolve(util.res(null, true, '上传成功！'))
      })
    })
  }

  const data = await read();
  let jsonData = data && data.toString();//将二进制的数据转换为字符串

  if (!jsonData) {
    jsonData = JSON.stringify([])
  }
  const date = now.format('YYYY-MM-DD');
  const jsonItem = {
    id, date, title, description, operator: 'admin', modefiled: now.format('YYYY-MM-DD HH:mm:SS')
  }
  const Arr = JSON.parse(jsonData);
  const newJsonData = [jsonItem, ...Arr];
  let str = JSON.stringify(newJsonData);

  ctx.body = await writeFiles(str);
});


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

// 查询文章内容
router.get('/article', async (ctx) => {
  let id = ctx.request.query.id
  if (!id) {
    ctx.body = {
      isSuccess: false,
      msg: '参数id错误！'
    }
  }
  let findmd = () => {
    return new Promise((resolve) => {
      fs.readFile(path.join(__dirname, `../public/upload/${id}.md`), function (err, data) {
        if (err) {
          resolve(util.res(null, false, err))
          return console.error(err);
        }
        let jsonData = data.toString();//将二进制的数据转换为字符串
        resolve(util.res(jsonData, true, '查询成功！'))
      })
    })

  }
  ctx.body = await findmd();
})

// 删除文章内容
router.get('/morain/delete', async (ctx) => {
  let id = ctx.request.query.id
  if (!id) {
    ctx.body = util.res(null, false, '参数id错误！')
  }
  const findJson = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, `../public/data/articleLists.json`), function (err, data) {
        if (err) {
          resolve(util.res(null, false, err))
          return console.error(err);
        }
        const jsonData = data.toString();//将二进制的数据转换为字符串
        const arr = JSON.parse(jsonData);
        const newJsonData = arr.filter((item) => `${item.id}` !== `${id}`);
        let str = JSON.stringify(newJsonData);
        if (newJsonData.length === arr.length) {
          resolve(util.res(null, false, '数据为空！'))
        }
        fs.writeFile(path.join(__dirname, '../public/data/articleLists.json'), str, function (err) {
          if (err) {
            resolve(util.res(null, false, err))
          }
          resolve(resolve(util.res(null, true, "删除成功！")));
        })
      })
    })

  }
  ctx.body = await findJson();
})

// 添加在线编辑的md文件
router.post('/morain/addOnlineEditArticle', async (ctx) => {
  let { title, description, content } = ctx.request.body;
  const now = moment();
  const id = now.valueOf();
  function addFile() {
    return new Promise((resolve) => {
      fs.writeFile(path.join(__dirname, `../public/upload/${id}.md`), content, async function (err) {
        if (err) {
          resolve(util.res(null, false, "未知错误！"))
        }

        const pathStr = path.join(__dirname, '../public/data/articleLists.json');
        const date = now.format('YYYY-MM-DD');

        const jsonItem = {
          id, date, title, description, operator: 'admin', modefiled: now.format('YYYY-MM-DD HH:mm:SS')
        }

        const res = await updateJson({
          pathStr,
          newData: jsonItem,
          type: 'add',
        })

        resolve(res);

      })
    })
  }
  const res = await addFile();
  ctx.body = res;
})


router.get('/morain/user', (ctx) => {
  ctx.body = {
    isSuccess: true,
    msg: '验证成功！'
  };
})

module.exports = router;
