const Router = require("koa-router");
const fs = require('fs');
const path = require('path');
// const jwt = require('jsonwebtoken');
const router = new Router();
const moment = require('moment');
// const util = require('../utils');

// 2.数据2
// 2.1添加数据
router.get('/addWeightData', async (ctx) => {
  let weight = ctx.request.query.weight
  if (!weight) {
    ctx.body = {
      isSuccess: false,
      msg: '参数错误！'
    }
  }
  const findJson = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, `../public/data/pfweight.json`), function (err, data) {
        if (err) {
          resolve({ code: -1, msg: '删除失败！' + err })
          return console.error(err);
        }
        let jsonData = data.toString();//将二进制的数据转换为字符串
        if (!jsonData) {
          jsonData = JSON.stringify([]);
        }

        const arr = JSON.parse(jsonData);
        const now = moment();

        const obj = {
          id: now.valueOf(),
          date: now.format('YYYY-MM-DD HH:mm:SS'),
          weight,
        }

        const newJsonData = [obj, ...arr]
        let str = JSON.stringify(newJsonData);

        fs.writeFile(path.join(__dirname, '../public/data/pfweight.json'), str, function (err) {
          if (err) {
            resolve({ code: -1, msg: '更新失败！' + err })
          }
          resolve({
            isSuccess: true,
            msg: "更新成功！",
            data: newJsonData,
          });
        })
      })
    })

  }
  ctx.body = await findJson();
})

router.get('/weightDatalList', async (ctx) => {
  const findJson = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, `../public/data/pfweight.json`), function (err, data) {
        if (err) {
          resolve({ code: -1, msg: '删除失败！' + err })
          return console.error(err);
        }
        let jsonData = data.toString();//将二进制的数据转换为字符串
        if (!jsonData) {
          jsonData = JSON.stringify([]);
        }

        const arr = JSON.parse(jsonData);
        resolve({ isSuccess: true, code: 200, msg: '查询成功！', data: arr })
      })
    })

  }
  ctx.body = await findJson();
})

module.exports = router;