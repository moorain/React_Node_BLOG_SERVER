const Service = require('egg').Service;
const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const mydb = new sqlite3.Database('./app/database/testDB.db', (err) => {
  if (err) {
    console.log('无法连接数据库:', err);
  } else {
    console.log('数据库连接成功');
  }
});

class HomeService extends Service {
  constructor(props) {
    super(props)
    this.db = mydb;
  }
}

module.exports = HomeService;