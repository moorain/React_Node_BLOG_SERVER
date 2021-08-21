const Koa = require('koa');
const app = new Koa();
const serve = require("koa-static");
const koaBody = require('koa-body')
const registerRouter = require('./routers/index')

app.use(serve(__dirname + "/public/img"));
app.use(serve(__dirname + "/www"));

app.use(koaBody({ multipart: true }));

app.use(registerRouter());

app.listen(8001, () => {
	console.log('server is starting at port 8001');
});