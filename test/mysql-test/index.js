const mysql=require('mysql')
//创建链接对象
const con=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  port:'3306',
  database: 'myblog'
})
//开始链接
con.connect()

//执行sql语句
const sql="insert into blogs (title,content,createtime,author) value('title3','content3','1648662400','awspi')"
con.query(sql, (err, results) => {
  if(err) {
    console.error(err)
    return
  }
  console.log(results);
  //OkPacket {fieldCount: 0, affectedRows: 1, insertId: 3, serverStatus: 2, warningCount: 0, …}
})
//关闭链接
con.end()