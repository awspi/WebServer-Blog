# 数据储存

## MySql

- mysql介绍、安装和使用
- nodejs连接mysq|
- API连接mysql

**为什么使用mysql而不是mogondb**

- mysq|是企业内最常用的存储工具，一般都有专人运维
- mysql也是社区内最常用的存储工具，有问题随时可查
- mysq|本身是一个复杂的数据库软件，项目只涉及基本使用

### 安装

- mysql
  - 安装过程中需要设置密码 12345678
- workbench

<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-1.png" style="zoom:33%;" />





<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-2.png" alt="mysql-2" style="zoom:33%;" />

### 操作

- 建库
- 建表
- 表操作

#### 创建

##### 建库

<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-3.png" alt="mysql-3" style="zoom:33%;" />

##### 建表

id为标识，不重复

users

| id   | username | password | realname |
| ---- | -------- | -------- | -------- |
| 1    | pithy    | 123      | wsp      |
| 2    | awspi    | 123      | psw      |

**创建`users`表**

| column   |   datatye   | pk 主键 | nn不为空 | AI自动增加 | default |
| :------- | :---------: | :-----: | :------: | :--------: | :-----: |
| id       |     int     |    Y    |    Y     |     Y      |         |
| username | varchar(20) |         |    Y     |            |         |
| password | varchar(20) |         |    Y     |            |         |
| realname | varchar(20) |         |    Y     |            |         |

blogs

| id   | title  | content  | createtime | author |
| ---- | ------ | -------- | ---------- | ------ |
| 1    | title1 | content1 | 1648662309 | pithy  |
| 2    | title2 | content2 | 1648662310 | awspi  |

**创建`blogs`表**

| column     |   datatye   | pk 主键 | nn不为空 | AI自动增加 | default |
| :--------- | :---------: | :-----: | :------: | :--------: | :-----: |
| id         |     int     |    Y    |    Y     |     Y      |         |
| title      | varchar(20) |         |    Y     |            |         |
| content    |  longtext   |         |    Y     |            |         |
| createtime | bitint(20)  |         |    Y     |            |         |
| author     | varchar(20) |         |    Y     |            |         |



<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-4.png" alt="mysql-4" style="zoom:33%;" />

<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-5.png" alt="mysql-5" style="zoom:33%;" />

**删除表，修改表**

<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/mysql-6.png" alt="mysql-6" style="zoom: 50%;" />



#### 增删查改

出现错误Error Code 1175 

```sql
SET SQL_SAFE_UPDATES=0
```

**增**

```sql
use myblog;
insert into users (username,`password`,realname) value('pithy','2','wsp')
```

**查**

```sql
use myblog;
select * from users;-- 避免使用*
select id,username from users;
select * from users where username='pithy';-- 条件查询
select * from users where state<>'1'; -- <>不等于
select * from users where username='awspi' and `password`='2';
select * from users where username='awspi' or `password`='1';
select * from users where username like '%wsp%';-- 模糊查询
select * from users where username like '%p%' order by id desc -- 倒序
```

**改**

```sql
use myblog;
update users set realname='wspp' where username='wsp';
```

**删**

```sql
use myblog;
delete from users where username='wsp';
```

```sql
use myblog;
select * from users where state=1;
update users set state =0 where username='pithy' -- 软删除
update users set state =1 where username='pithy' -- 恢复
```

## NodeJs操作Mysql



安装依赖

```bash
npm install --save
```



- 用demo演示,不考虑使用

  - mysql-test

    ```js
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
    ```

    **报错**

    `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

    解决方法：在mysql终端输入

    ```sql
    use mysql;
    alter user 'root'@'localhost' identified with mysql_native_password by '12345678';
    ```

    

- 将其封装为系统可用的工具

- 让API直接操作数据库,不再使用假数据

## API对接mysql

../src/conf/db.js

```js
const env=process.env.NODE_ENV//环境变量
//配置
let MYSQL_CONFIG
if(env==='dev'){
  MYSQL_CONFIG=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  })
}
if(env==='production'){
  MYSQL_CONFIG=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port:'3306',
    database: 'myblog'
  })
}
module.exports ={ MYSQL_CONFIG}
```



../src/db/mysql.js

```js
const mysql= require('mysql')
const{MYSQL_CONFIG}=require('../conf/db')
//创建链接对象
const con=mysql.createConnection(MYSQL_CONFIG)
//开始链接
con.connect();

//统一执行sql函数
function exec(sql){
  const promise=new Promise((resolve,reject)=>{
    con.query(sql,(err,result)=>{
      if(err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}

module.exports={exec}
```

### 博客列表

