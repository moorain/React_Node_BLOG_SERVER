const ServiceM2 = require('../core/base_service');

class CodeService extends ServiceM2 {
  // 查询列表所有内容
  async query() {
    return new Promise((resolve, reject) => {
      this.db.all(`select id ,title ,userId ,userName ,createDate from code_list ORDER BY id DESC`, (err, row) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          return resolve(row);
        }
      });
    });
  }
  // 根据id查询内容
  async queryById(id) {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from code_list where id=?`, [id], (err, row) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          return resolve(row[0]);
        }
      });
    });
  }

  // 保存

  async add(data) {
    return new Promise((resolve, reject) => {
      // 新增内容
      this.db.all(`INSERT INTO code_list (title, description, filesJson, userId, userName,createDate) VALUES (?,?,?,?,?,?)`,
        [`${data.title}`, `${data.description}`, `${data.filesJson}`, '10001', 'admin', `${data.createDate}`],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            return resolve(row);
          }
        });
    });
  }
}

module.exports = CodeService;
