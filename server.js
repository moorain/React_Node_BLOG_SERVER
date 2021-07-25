const Koa = require('koa');
const app = new Koa();
const serve = require("koa-static");

const koaBody = require('koa-body')
const router = require('./router')

app.use(serve(__dirname + "/www"));

app.use(koaBody({ multipart: true }));
app.use(router.routes());

app.listen(8001, () => {
	console.log('[demo] server is starting at port 8001');
});