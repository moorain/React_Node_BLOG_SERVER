const ServiceM = require('../core/base_service');

class HomeService extends ServiceM {
  async query() {
    return new Promise((resolve, reject) => {
      // 查询列表所有内容
      // tslint:disable-next-line:max-line-length
      this.db.all(`select id ,title ,description ,gmtCreate ,gmtModified ,operator from list ORDER BY id DESC`, (err, row) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          return resolve(row);
        }
      });
    });
  }
  async queryById(id) {
    return new Promise((resolve, reject) => {
      // 根据id查询内容
      this.db.all(`select * from list where id=${id}`, (err, row) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          return resolve(row[0].mdText);
        }
      });
    });
  }
  async add(data) {
    return new Promise((resolve, reject) => {
      // 新增内容
      // tslint:disable-next-line:max-line-length
      this.db.all(`INSERT INTO list (title, description, mdText) VALUES (?, ?, ?)`, [`${data.title}`, `${data.description}`, `${data.content}`],
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

  async delete(id) {
    return new Promise((resolve, reject) => {
      // 新增内容
      // tslint:disable-next-line:max-line-length
      this.db.all(`DELETE FROM list WHERE id = ?`, [id],
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

  async queryUserDataByUserName(name) {
    return new Promise((resolve, reject) => {
      // 新增内容
      // tslint:disable-next-line:max-line-length
      this.db.all(`select * FROM users WHERE userName=?`, [name],
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

module.exports = HomeService;