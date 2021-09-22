const Controller = require('../core/base_controller');

class PostController extends Controller {
  async articleLists() {
    const { ctx } = this;
    const res = await ctx.service.home.query();
    this.success(res);
  }

  async article() {
    const { ctx } = this;
    const id = ctx.query.id;
    const res = await ctx.service.home.queryById(id);
    this.success(res);
  }

  async addOnlineEditArticle() {
    const { ctx } = this;
    const params = {
      title: { type: 'string' },
      description: { type: 'string' },
      content: { type: 'string' },
    };
    ctx.validate(params);
    const res = await ctx.service.home.add(ctx.request.body);
    this.success(res);
  }
  async delete() {
    const { ctx } = this;
    const res = await ctx.service.home.delete(ctx.query.id);
    this.success(res, '删除成功！');
  }
}

module.exports = PostController;
