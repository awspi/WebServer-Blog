const {exec} =require('../db/mysql')
const loginCheck=(username,password) => {
  const sql= `select username,realname from users where username='${username}' and password='${password}'`
  return exec(sql).then(rows => {//select返回的都是数组
    return rows[0]||{}
  })
}

module.exports ={
  loginCheck
}