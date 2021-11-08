
const fs = require('fs')
const path = require('path')

function getNowFormatDate(dateobj) {
  const date = dateobj || new Date();
  const seperator1 = "";
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  const currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

function copy(nowDate) {
  return new Promise((resolve) => {
    const dir = path.resolve('app/database', 'testDB.db');
    const targetdir = path.resolve('app/database', `testDB${nowDate}.db`);
    try {
      fs.copyFile(dir, targetdir, (err) => {
        if (!err) {
          resolve({ success: true })
        }
      })
    } catch (err) {
      // console.log(err)
    }
  })

}

function remove(predate) {
  try {
    const pathStrlast = path.resolve('app/database', `testDB${predate}.db`);
    const statObx = fs.statSync(pathStrlast)
    if (statObx.isFile()) {
      fs.unlinkSync(pathStrlast);
    }
  } catch (err) {
    // console.log(err)
  }
}

async function backDatabase() {
  try {
    const curDate = new Date();
    const preDate = getNowFormatDate(new Date(curDate.getTime() - 48 * 60 * 60 * 1000));
    const nowDate = getNowFormatDate(curDate);
    await copy(nowDate);
    setTimeout(() => {
      remove(preDate);
    }, 2000)
  } catch (err) {
    console.log(err)
  }
}

module.exports = backDatabase;