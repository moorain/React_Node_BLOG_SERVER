

const { Controller } = require('egg');

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data, msg) {
    this.ctx.body = {
      isSuccess: true,
      data,
      msg: msg || '操作成功！'
    };
  }

  error(data, msg) {
    this.ctx.body = {
      isSuccess: false,
      data,
      msg: msg || '操作失败！'
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}

module.exports = BaseController;