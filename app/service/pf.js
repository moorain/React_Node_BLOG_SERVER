const ServiceM2 = require('../core/base_service');

const dbQuery = (db, params) => new Promise((resolve, reject) => {
  db.all(params.sql, params.sqlParams, (err, row) => {
    if (err) {
      reject(err);
    } else {
      resolve(row)
    }
  })
})

class CodeService extends ServiceM2 {
  // 查询列表所有内容
  async queryWeightList(limit) {
    const firstDay = await dbQuery(this.db, {
      sql: 'select * from pf limit 1',
      sqlParams: [],
    })

    const allCount = await dbQuery(this.db, {
      sql: 'SELECT COUNT(*) FROM pf',
      sqlParams: [],
    })

    const lastDays = await dbQuery(this.db, {
      sql: `select * from (select * from pf order by id desc limit ?) a order by id`,
      sqlParams: [limit]
    })

    return {
      firstDay: firstDay[0],
      curDay: lastDays[limit - 1],
      lastDay: lastDays[limit - 2],
      lastDays,
      allCount: allCount[0]['COUNT(*)'],
    }
  }
  // // 根据id查询内容
  // async queryById(id) {
  //   return new Promise((resolve, reject) => {
  //     this.db.all(`select * from tools where id=?`, [id], (err, row) => {
  //       if (err) {
  //         // console.log(err);
  //         reject(err);
  //       } else {
  //         return resolve(row[0]);
  //       }
  //     });
  //   });
  // }

  // 保存
  async add(data) {
    return new Promise((resolve, reject) => {
      // 新增内容
      this.db.all(`INSERT INTO pf (date, weight, userId, userName) VALUES (?,?,?,?)`,
        [`${data.date}`, `${data.weight}`, `${data.userId}`, `${data.userName}`],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            return resolve(row);
          }
        });
    });
  }
  // // 删除
  // async delete(id) {
  //   return new Promise((resolve, reject) => {
  //     this.db.all(`DELETE FROM tools WHERE id = ?`, [id],
  //       (err, row) => {
  //         if (err) {
  //           // console.log(err);
  //           reject(err);
  //         } else {
  //           return resolve(row);
  //         }
  //       });
  //   });
  // }
}

module.exports = CodeService;
