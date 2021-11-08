const Controller = require('../core/base_controller');

class PostController extends Controller {
  async query() {
    const { ctx } = this;
    const res = await ctx.service.interview.query();
    this.success(res)
  }

  async add() {

    const { ctx } = this;
    const params = {
      title: { type: 'string' },
      extends: { type: 'string' },
      content: { type: 'string' },
      correctAnswer: { type: 'string' },
      type: { type: 'string' },
    };
    console.log(ctx.request.body)
    ctx.validate(params);
    const res = await ctx.service.interview.add(ctx.request.body);
    this.success(res);
  }

  async queryById() {
    const { ctx } = this;
    const params = {
      id: { type: 'number' },
    };
    ctx.validate(params);
    const res = await ctx.service.interview.queryById(ctx.query.id);
    this.success(res);
  }

  async delete() {
    const { ctx } = this;
    const res = await ctx.service.interview.delete(ctx.query.id);
    this.success(res, '删除成功！');
  }
}

module.exports = PostController;
