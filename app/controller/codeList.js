const Controller = require('../core/base_controller');

class CodeController extends Controller {
  async codeList() {
    const { ctx } = this;
    const res = await ctx.service.code.query();
    this.success(res);
  }

  async codeQuery() {
    const { ctx } = this;
    const id = ctx.query.key;
    const res = await ctx.service.code.queryById(id);
    this.success(res);
  }

  async codeSave() {
    const { ctx } = this;
    const params = {
      createDate: { type: 'string' },
      filesJson: { type: 'string' },
      title: { type: 'string' },
      userId: { type: 'number' },
      userName: { type: 'string' },
    };
    ctx.validate(params);
    const res = await ctx.service.code.add(ctx.request.body);
    this.success(res);
  }
  // async delete() {
  //   const { ctx } = this;
  //   // console.log(ctx.request.body, '--------------------')
  //   // const params = {
  //   //   title: { type: 'string' },
  //   //   description: { type: 'string' },
  //   //   content: { type: 'string' },
  //   // };
  //   // ctx.validate(params);
  //   const res = await ctx.service.home.delete(ctx.query.id);
  //   this.success(res, '删除成功！');
  // }
}

module.exports = CodeController;
