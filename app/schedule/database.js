const Subscription = require('egg').Subscription;
const back = require('../core/backup')

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // interval: '5s', // 1 分钟间隔
      cron: '0 0 12 * * ?', // 也可以通过 cron 表达式来构建时间间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    back();
  }
}

module.exports = UpdateCache;