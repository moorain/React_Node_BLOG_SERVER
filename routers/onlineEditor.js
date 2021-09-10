const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
const util = require('../utils');

// 查询所有图片
router.post('/codeChange', async (ctx) => {
  const files = ctx.request.body;
  const bodyStr = files['index.html'].value;
  // cdn
  let scriptStr = '';
  if (files.cdns.length > 0) {
    files.cdns.forEach((item) => {
      if (item.scripts.length > 0) {
        item.scripts.forEach((url) => {
          scriptStr = `${scriptStr} <script src="${url}" type="text/javascript"></script>`
        })
      }
    })
  }

  const htmlStr = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
      ${files['style.css'].value}
      </style>
      ${scriptStr}
    </head>
    <body>
      ${bodyStr}
      <script type='text/babel'>
        ${files['script.js'].value}
      </script>
      <script>
      let key = '';
      window.addEventListener("message", function( event ) { 
       // console.log('代码更新',event.data)
       if(key!== event.data){
        window.location.reload();
        key = event.data;
       }
      }, false ); 
      </script>
    </body>
  </html>
  `
  try {
    const bufferHtml = Buffer.from(htmlStr);
    // const jsbuffer = Buffer.from(files['script.js'].value);
    // const cssbuffer = Buffer.from(files['style.css'].value);
    const key = files.key
    const nameStr = `editor_${key}.html`;

    await fs.writeFileSync(path.join(__dirname, `../public/editor/${nameStr}`), bufferHtml)
    // await fs.writeFileSync(path.join(__dirname, '../public/editor/script.js'), jsbuffer)
    // await fs.writeFileSync(path.join(__dirname, '../public/editor/style.css'), cssbuffer)

    ctx.body = util.res({
      key,
      url: `http://localhost:8001/${nameStr}`
    }, true, '更新成功！')
  } catch (err) {
    ctx.body = util.res([], false, '未知错误!')
  }
})


module.exports = router;