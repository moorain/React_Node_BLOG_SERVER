const ServiceM2 = require('../core/base_service');
class CodeService extends ServiceM2 {
  // 查询列表所有内容
  async query() {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from interview ORDER BY id DESC`, (err, row) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          return resolve(row);
        }
      });
    });
  }
  // // 根据id查询内容
  async queryById(id) {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from interview where id=?`, [id], (err, row) => {
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
      if (data.id) {
        //修改
        this.db.all(`UPDATE interview SET title = ?, extends = ?, content = ?, correctAnswer = ?, type = ?  WHERE id = ?`,
          [`${data.title}`, `${data.extends}`, `${data.content}`, `${data.correctAnswer}`, `${data.type}`, `${data.id}`],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              return resolve(row);
            }
          });
      } else {
        // 新增
        this.db.all(`INSERT INTO interview (title, extends, content, correctAnswer,type) VALUES (?,?,?,?,?)`,
          [`${data.title}`, `${data.extends}`, `${data.content}`, `${data.correctAnswer}`, `${data.type}`],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              return resolve(row);
            }
          });
      }
    });
  }
  // // 删除
  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.all(`DELETE FROM interview WHERE id = ?`, [id],
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
