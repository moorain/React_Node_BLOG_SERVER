const Controller = require('../core/base_controller');

class PostController extends Controller {
  async toolslist() {
    const { ctx } = this;
    const res = await ctx.service.tool.query()
    this.success(res);
  }

  async toolItem() {
    const { ctx } = this;
    const id = ctx.query.id;
    const res = await ctx.service.tool.queryById(id);
    this.success(res);
  }

  async addTool() {
    const { ctx } = this;
    const params = {
      title: { type: 'string' },
      des: { type: 'string' },
      url: { type: 'string' },
    };
    ctx.validate(params);
    const res = await ctx.service.tool.add(ctx.request.body);
    this.success(res);
  }

  async delete() {
    const { ctx } = this;
    const res = await ctx.service.tool.delete(ctx.query.id);
    this.success(res, '删除成功！');
  }
}

module.exports = PostController;
