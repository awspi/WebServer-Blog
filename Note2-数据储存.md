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

**sql语句关键字**

- password是关键字，在新增时需要加上``
- 查的时候/where后不需要加



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

router

```js
//获取博客列表
  if(method=='GET'&&req.path==='/api/blog/list'){
   const author=req.query.author||''
   const keyword=req.query.keyword||''
  //  const listData=getList(author,keyword)
  //  return new SuccessModel(listData)
    // 返回的是promise
    const result=getList(author,keyword)
    return result.then(listData=>{//return result.then
      return new SuccessModel(listData)
    })
  }
```

controller

```js
const getList=(author,keyword)=>{//获取博客列表
  let sql=`select * from blogs where 1=1 `//1=1 占位 防止author和keyword没有值 //注意结尾空格
  if(author){
    slq+=`and author='${author}' `//注意结尾空格
  }
  if(keyword){
    sql+=`and title like '%${keyword}%' `//注意结尾空格
  }
  sql+=`order by createtime desc;`
  //返回的是promise
  return exec(sql)
}
```



### **博客详情和新建**

router

```js

  //获取博客详情
  if(method=='GET'&&req.path==='/api/blog/detail'){
    const result=getDetail(id)
    return result.then(data=>{
      return new SuccessModel(data)
    })
  }

  //新建一篇博客
  if(method=='POST'&&req.path==='/api/blog/new'){
    const author='testuser'//假数据待更新
    req.body.author=author
    const blogData=req.body
    const result=newBlog(blogData)
    return result.then(data=>{
      return new SuccessModel(data)
    })
    
  }
```

controller

```js

//获取博客详情
const getDetail=(id)=>{
  const sql=`select * from blogs where id= '${id}'`
  return exec(sql).then(rows=>{
    // console.log(rows);
    return rows[0]//rows是数组，把对象取出来
  })
}

//新建博客
const newBlog=(blogData={})=>{
  //blogData为一个博客对象 包含 title content属性
  const title=blogData.title
  const content=blogData.content
  const author=blogData.author
  const createtime=Date.now()
  const sql=`insert into blogs (title, content, createtime, author) value('${title}', '${content}', '${createtime}','${author}')`
  return exec(sql).then(insertData=>{
    console.log(insertData)
    /*
    OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 4,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
    */ 
    return{
      id:insertData.insertId
    }
  })
}
```



### 博客更新与删除

router

```js
  //更新一篇博客
  if(method=='POST'&&req.path==='/api/blog/update'){

    const result=updateBlog(id,req.body)
    return result.then(data=>{
      if(data){
        return new SuccessModel()
      }else{
        return new ErrorModel('博客更新失败')
      }
    })
    
  } 
//删除一篇博客
  if(method=='POST'&&req.path==='/api/blog/del'){
    const author='testuser'//假数据待更新 后期要对author检验
    const result=delBlog(id,author)
    return result.then(data=>{
      if(data){
        return new SuccessModel
      }else{
        return new ErrorModel('删除博客失败')
      }
    })
  }
}
```

controller

```js
//更新博客
const updateBlog=(id,blogData={})=>{
  //id:要更新的博客id
  //blogData为一个博客对象 包含 title content属性
  const title=blogData.title
  const content=blogData.content
  const sql=`update blogs set title='${title}',content='${content}' where id='${id}'`
  return exec(sql).then(updateData=>{
    if(updateData.affectedRows>0){//affectedRows 有被影响的行 说明执行成功
      return true
    }else{return false}
  })
}

//删除博客
//这里发现个问题，默认是在url后拼接参数。但是如果post里也含有id，程序会直接出错了不合适
//如果是post.data里有id，也会到这里，但是获取不到req.body.id,导致id=undefined,出错

const delBlog=((id,author)=>{
  //id:要删除的博客id
  const sql=`delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then(deleteData=>{
    if(deleteData.affectedRows>0){
      return true
    }else{return false}
  })
})
```

### 登陆

controller

```js
const loginCheck=(username,password) => {
  const sql= `select username,realname from users where username='${username}' and password='${password}'`
  return exec(sql).then(rows => {//select返回的都是数组
    return rows[0]
  })
}
```

router

```js
const handleUserRouter = (req, res) => {
  const method=req.method
  //登陆
  if(method ==='POST'&&req.path==='/api/user/login'){
    const{username,password}=req.body
    const result=loginCheck(username,password)
    return result.then(data => {
      if(data.username){
        return new SuccessModel
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  } 
}
```

app.js 处理user路由 改用异步

```js
 //处理user路由
    const userData=handleUserRouter(req,res)
    if(userData){
      userData.then(userData=>{
        res.end(JSON.stringify(userData))
      })
      return
    }

```



## 总结

- nodejs连接mysql ,如何执行sq|语句
- 根据NODE_ _ENV区分配置
- 封装exec函数, API使用exec操作数据库



- 安装Mysq|和workbench
- 创建库、表, SQL语句的语法和使用
- nodejs连接Mysq| ,应用到API
