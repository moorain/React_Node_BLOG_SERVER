const Router = require("koa-router");
const fs = require('fs');
const path = require('path');

const router = new Router();
const moment = require('moment');

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

// 上传文件、文章
router.post('/uploadfile', async (ctx, next) => {
    const { title, description } = ctx.request.body;
    if (!(title && description)) {
        return ctx.body = {
            success: false,
            msg: `名称&描述不能为空！`,
            data: null,
        };
    }
    // 获取时间戳
    const now = moment();
    const id = now.valueOf();
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件

    // if (file.name.indexOf('md') < 0 || file.name.indexOf('MD') < 0) {
    //     return ctx.body = {
    //         success: false,
    //         msg: `只支持上传makedown文件，文件名请以md结尾！`,
    //         data: null,
    //     };
    // }
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, 'public/upload/') + `/${id}.md`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);

    // 更新json文件
    fs.readFile(path.join(__dirname, 'public/data/articleLists.json'), function (err, data) {
        let jsonData = data.toString();//将二进制的数据转换为字符串
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
        fs.writeFile(path.join(__dirname, 'public/data/articleLists.json'), str, function (err) {
            return ctx.body = {
                success: true,
                msg: "上传成功！",
                data: null,
            };
        })
    })
    return ctx.body = {
        success: false,
        msg: "",
        data: null,
    };
});

router.get('/index.html', async (ctx) => {
    let url = ctx.request.url;
    let html = await route(url);
    ctx.body = html;
})

// 查询文章列表
router.get('/articleLists', async (ctx) => {
    let id = ctx.request.query.id
    let findJson = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, 'public/data/articleLists.json'), function (err, data) {
                if (err) {
                    resolve({ code: -1, msg: '查询失败' + err })
                    return console.error(err);
                }
                let jsonData = data.toString();//将二进制的数据转换为字符串
                if (!jsonData) {
                    resolve({ code: 0, data: [], success: true })
                    return;
                }

                jsonData = JSON.parse(jsonData);//将字符串转换为json对象
                // 有id值=>单个 无id值=>全部
                if (id) {
                    console.log(jsonData, 'jsonData')
                    jsonData = jsonData.filter((item) => `${item.id}` === `${id}`);
                    resolve({ code: 0, data: jsonData, success: true })
                } else {
                    resolve({ code: 0, data: jsonData, success: true })
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
            success: false,
            msg: '参数id错误！'
        }
    }
    let findmd = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `public/upload/${id}.md`), function (err, data) {
                if (err) {
                    resolve({ code: -1, msg: '查询失败' + err })
                    return console.error(err);
                }
                let jsonData = data.toString();//将二进制的数据转换为字符串
                resolve({ code: 0, data: jsonData, success: true })
            })
        })

    }
    ctx.body = await findmd();
})



// 删除文章内容
router.get('/delete', async (ctx) => {
    let id = ctx.request.query.id
    if (!id) {
        ctx.body = {
            success: false,
            msg: '参数id错误！'
        }
    }
    const findJson = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `public/data/articleLists.json`), function (err, data) {
                if (err) {
                    resolve({ code: -1, msg: '删除失败！' + err })
                    return console.error(err);
                }
                const jsonData = data.toString();//将二进制的数据转换为字符串
                const arr = JSON.parse(jsonData);
                const newJsonData = arr.filter((item) => `${item.id}` !== `${id}`);
                let str = JSON.stringify(newJsonData);
                if (newJsonData.length === arr.length) {
                    resolve({ code: -1, msg: '此id数据为空！' + err })
                }
                fs.writeFile(path.join(__dirname, 'public/data/articleLists.json'), str, function (err) {
                    if (err) {
                        resolve({ code: -1, msg: '删除失败！' + err })
                    }
                    resolve({
                        success: true,
                        msg: "删除成功！",
                        data: null,
                    });
                })
            })
        })

    }
    ctx.body = await findJson();
})



// 2.数据2

// 2.1添加数据
router.get('/addWeightData', async (ctx) => {
    let weight = ctx.request.query.weight
    if (!weight) {
        ctx.body = {
            success: false,
            msg: '参数错误！'
        }
    }
    const findJson = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `public/data/pfweight.json`), function (err, data) {
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

                fs.writeFile(path.join(__dirname, 'public/data/pfweight.json'), str, function (err) {
                    if (err) {
                        resolve({ code: -1, msg: '更新失败！' + err })
                    }
                    resolve({
                        success: true,
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
            fs.readFile(path.join(__dirname, `public/data/pfweight.json`), function (err, data) {
                if (err) {
                    resolve({ code: -1, msg: '删除失败！' + err })
                    return console.error(err);
                }
                let jsonData = data.toString();//将二进制的数据转换为字符串
                if (!jsonData) {
                    jsonData = JSON.stringify([]);
                }

                const arr = JSON.parse(jsonData);
                resolve({ success: true, code: 200, msg: '查询成功！', data: arr })
            })
        })

    }
    ctx.body = await findJson();
})



module.exports = router;