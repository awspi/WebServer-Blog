# 安全

## sql注入

- 攻击方式:输入一个sql片段,最终凭借成一段攻击代码
  - 例如`pithy';--` 可以不用密码直接登陆

![sql注入](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/sql注入.png)

**使用mysql的escqpe函数**

```js
  username=escape(username)
  password=escape(password)
  const sql = `select username, realname from users where username=${username} and password=${password}`
  //select username, realname from users where username='pithy\';--' and password=''
```

所以要用的sql的变量都要escape过滤一遍

## xss攻击

- 攻击方式:在页面展示内容中掺杂js代码,以获取网页信息
- 预防措施:转换生成js的特殊字符
  - & < > " ' /

`<script>alert(document.cookie)</script>`

<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/xss.png" alt="xss" style="zoom:50%;" />



<img src="/Users/wsp/Documents/NodeJs/WebServer-Blog/img/xss2.png" alt="xss2" style="zoom: 33%;" />\



**解决措施**

将生成js的特殊字符转义

借助xss库

```bash
npm i xss --save
```

```js
const xss =require('xss')
const title = xss(blogData.title)
```



## 密码加密

- 假设数据库被泄露,最不该泄漏的是用户信息
- 攻击方式:获取用户名密码 再去尝试登陆系统
- 预防措施:将密码加密,即使拿到密码也不知道明文

utils/cryp.js

```js
const crypto=require('crypto')

//密匙
const SECRET_KEY ='PITHY_@)@@>$>%'

//md5加密
function md5(content){
  let md5=crypto.createHash('md5')
  return md5.update(content).digest('hex')//把输出变成16进制
}
//加密函数
function genPassword(password){
  const str =`password=${password}&key=${SECRET_KEY}`
  return md5(str)
}
console.log(
  genPassword('123')
);

```

数据库 password字段修改type VARCHAR(32)