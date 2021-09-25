const ServiceM2 = require('../core/base_service');

class CodeService extends ServiceM2 {
  // 查询列表所有内容
  async query() {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from tools ORDER BY id DESC`, (err, row) => {
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
      this.db.all(`select * from tools where id=?`, [id], (err, row) => {
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
      this.db.all(`INSERT INTO tools (title, url, des, tag) VALUES (?,?,?,?)`,
        [`${data.title}`, `${data.url}`, `${data.des}`, `${data.tag}`],
        (err, row) => {
          if (err) {
            // console.log(err);
            reject(err);
          } else {
            return resolve(row);
          }
        });
    });
  }
  // 删除
  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.all(`DELETE FROM tools WHERE id = ?`, [id],
        (err, row) => {
          if (err) {
            // console.log(err);
            reject(err);
          } else {
            return resolve(row);
          }
        });
    });
  }
}

module.exports = CodeService;
