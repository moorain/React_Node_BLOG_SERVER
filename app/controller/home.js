const Controller = require('../core/base_controller');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.tpl', {});
  }

  async user() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const params = {
      username: { type: 'string' },
      password: { type: 'string' },
    };
    ctx.validate(params);
    const userData = await ctx.service.home.queryUserDataByUserName(username);
    if (userData.length > 0) {
      const user = userData[0];
      if (user.password === password) {
        const token = app.jwt.sign({
          username: user.userName,
          userid: user.userId,
        }, app.config.jwt.secret, {
          expiresIn: '1800s',
        })
        this.success(token);
      } else {
        this.error('密码错误！');
      }
    } else {
      this.error('无此用户');
    }
  }

  async getUserInfo() {
    const { ctx, app } = this;
    const arr = (ctx.request.header.authorization || '').split(' ');
    const res = app.jwt.verify(arr[1], app.config.jwt.secret)
    this.success(res);
  }
}

module.exports = HomeController;
