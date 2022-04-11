const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
  username = escape(username)

  //生成加密密码

  password = genPassword(password) //加密 user1 123
  password = escape(password)//注意顺序 先加密后escaoe
  const sql = `select username, realname from users where username=${username} and password=${password}`
  // console.log(sql);
  return exec(sql).then(rows => {//select返回的都是数组
    return rows[0] || {}
  })
}

module.exports = {
  login
}
