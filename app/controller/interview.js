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
    ctx.validate(params);
    const res = await ctx.service.interview.add(ctx.request.body);
    this.success(res);
  }
}

module.exports = PostController;
