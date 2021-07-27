function res(data, success, msg, others) {
  return {
    isSuccess: success,
    data,
    msg,
    ...others,
  }
}


function res2(data, success, msg, others) {
  return {
    isSuccess: success,
    data,
    msg,
    ...others,
  }
}

module.exports = { res, res2 }