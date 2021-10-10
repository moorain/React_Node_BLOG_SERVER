const Controller = require('../core/base_controller');

class PostController extends Controller {
  async queryWeightList() {
    const { ctx } = this;
    const limit = 7;
    const res = await ctx.service.pf.queryWeightList(limit);
    // const firstDay = res.firstDay[0];
    // const curDay = res.lastDays[limit - 1];
    // const lastDay = res.lastDays[limit - 2];
    // this.success({
    //   change: curDay.weight - lastDay.weight,
    //   allChange: curDay.weight - firstDay.weight,

    // });

    this.success(res)
  }

  // async toolItem() {
  //   const { ctx } = this;
  //   const id = ctx.query.id;
  //   const res = await ctx.service.tool.queryById(id);
  //   this.success(res);
  // }

  async addWeight() {
    const { ctx } = this;
    const params = {
      date: { type: 'string' },
      userId: { type: 'string' },
      userName: { type: 'string' },
      weight: { type: 'number' },
    };
    ctx.validate(params);
    const res = await ctx.service.pf.add(ctx.request.body);
    this.success(res);
  }

  // async delete() {
  //   const { ctx } = this;
  //   const res = await ctx.service.tool.delete(ctx.query.id);
  //   this.success(res, '删除成功！');
  // }
}

module.exports = PostController;
