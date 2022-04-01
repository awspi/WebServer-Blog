# 登陆

- **核心:登录校验&登录信息存储**
- **目录**
- cookie和session
  - sessin写入redis
- 开发登陆功能，和前端联调（使用nginx反向代理）



## Cookie

- 什么是 cookie?
  - 储存在浏览器的一段字符串(最大5kb)
  - 跨域不共享
  - 格式如k1=v1; k2=v2; k3=v3; 因此可以存储结构化数据
  - 每次发送http请求,会将请求域的cookie一起发送给server
  - server可以修改cookie并返回给浏览器
  - 浏览器也可以通过js修改cookie(有限制)
    - js修改cookie 实际上是**追加**,而**不是覆盖**
- javascript操作cookie ,浏览器中查看cookie
- server端操作cookie , 实现登录验证

![cookie](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/cookie.png)

### server端nodejs操作cookie

- ### 查看cookie

- ### 修改cookie

- ### 实现登陆验证

**path=/;**

app.js

```js
  //解析cookie
  req.cookie={}
  const cookieStr=req.headers.cookie||'' //cookie
  cookieStr.split(";").forEach(item =>{
    if(!item){
      return
    }
    const arr=item.split('=')
    const key =arr[0].trim() //加个trim 去首尾空格
    const val=arr[1].trim()
    req.cookie[key]=val
  })
  // console.log(req.cookie)

```

在router/user.js里测试

```js
  if(method ==='GET'&&req.path==='/api/user/login'){//先改为GET
    // const{username,password}=req.body
    const {username,password}=req.query
    const result=login(username,password)
    return result.then(data => {
      if(data.username){
        //操作cookie
        res.setHeader('Set-cookie',`username=${username}; path=/;http`)

        return new SuccessModel
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  }   

//登陆验证测试
  if(method ==='GET'&&req.path==='/api/user/login-test'){
    if(req.cookie.username){
      return Promise.resolve(new SuccessModel)
    }else{
      return Promise.resolve(new ErrorModel('未登陆'))
    }
  }

```



### cookie做限制

**httpOnly** 不允许客户端用js对cookie进行修改

```js
    res.setHeader('Set-cookie',`username=${username}; path=/; httpOnly`)
```

**设置cookie过期时间**

```JS
//获取cookie过期时间
const getCookieExpires =() =>{
  const d=new Date();
  d.setTime(d.getTime()+(24*60*60*1000)) //设置一天后
  return d.toGMTString()
}
```

```js
 //操作cookie
res.setHeader('Set-cookie',`username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
```



Cookie 问题:

- 会暴露username等等,不安全

如何解决?

- cookie中存储userid,server端对应username
- 解决方案:**session**

## Session

![session](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/session.png)

