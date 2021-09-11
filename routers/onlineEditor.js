const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
const util = require('../utils');
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
  let isAdd = false;
  //复写
  Arr.forEach((i, index) => {
    if (`${i.id}` === `${newData.id}`) {
      Arr[index] = newData;
      isAdd = true;
    }
  });

  if (type === 'add' && (!isAdd)) {
    const newJsonData = [newData, ...Arr];
    str = JSON.stringify(newJsonData);
  } else {
    str = JSON.stringify(Arr);
  }

  const res = await writeFiles(str, pathStr)
  return res
}

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
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@4.16.13/dist/antd.css" />
      <style>
      ${files['style.css'].value}
      </style>
      <script src="https://cdn.bootcdn.net/ajax/libs/react/16.13.1/umd/react.production.min.js"></script>
      <script src="https://cdn.bootcdn.net/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js"></script>
      <script src="https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.0.0-beta.3/babel.min.js"></script>

      <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/antd@4.16.13/dist/antd.js"></script>
  
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

    //更新存档
    const pathStr = path.join(__dirname, `../public/data/editor.json`)
    // const read = () => {
    //   return new Promise((resolve) => {
    //     fs.readFile(pathStr, function (err, data) {
    //       let jsonData = data && data.toString();//将二进制的数据转换为字符串
    //       if (!jsonData) {
    //         jsonData = JSON.stringify([])
    //       }
    //       resolve(JSON.parse(jsonData))
    //     })
    //   })
    // }
    // const data = await read();
    // data.forEach((i) => {
    //   if (i.id === files.key) {
    //     // todo
    //   }
    // })
    ctx.body = util.res({
      key,
      url: `http://localhost:8001/${nameStr}`
    }, true, '更新成功！')

  } catch (err) {
    ctx.body = util.res([], false, '未知错误!')
  }
})

router.post('/codeSave', async (ctx) => {
  const param = ctx.request.body;
  const pathStr = path.join(__dirname, `../public/data/editor.json`)
  await updateJson({
    newData: param,
    type: 'add',
    id: param.id,
    pathStr,
  })
  ctx.body = util.res(param.key, true, '保存成功!')
})

router.get('/codeQuery', async (ctx) => {
  const { key } = ctx.request.query;
  const pathStr = path.join(__dirname, `../public/data/editor.json`)
  const read = () => {
    return new Promise((resolve) => {
      fs.readFile(pathStr, function (err, data) {
        let jsonData = data && data.toString();//将二进制的数据转换为字符串
        if (!jsonData) {
          jsonData = JSON.stringify([])
        }
        resolve(JSON.parse(jsonData))
      })
    })
  }
  const data = await read();
  const item = (data || []).find((i) => i.id === key);
  ctx.body = util.res(item, true, '查询成功!')
})


router.get('/codeListQuery', async (ctx) => {
  const pathStr = path.join(__dirname, `../public/data/editor.json`)
  const read = () => {
    return new Promise((resolve) => {
      fs.readFile(pathStr, function (err, data) {
        let jsonData = data && data.toString();//将二进制的数据转换为字符串
        if (!jsonData) {
          jsonData = JSON.stringify([])
        }
        resolve(JSON.parse(jsonData))
      })
    })
  }
  const data = await read();
  ctx.body = util.res(data, true, '查询成功!')
})



module.exports = router;