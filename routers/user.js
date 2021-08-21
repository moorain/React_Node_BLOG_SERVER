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

module.exports = router