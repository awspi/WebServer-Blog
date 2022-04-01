const{login}=require('../controller/user')
const {SuccessModel,ErrorModel}=require('../model/resModel')

//获取cookie过期时间
const getCookieExpires =() =>{
  const d=new Date();
  d.setTime(d.getTime()+(24*60*60*1000)) //设置一天后
  return d.toGMTString()
}

const handleUserRouter = (req, res) => {
  const method=req.method
  //登陆
  if(method ==='GET'&&req.path==='/api/user/login'){
    // const{username,password}=req.body
    const {username,password}=req.query
    const result=login(username,password)
    return result.then(data => {
      if(data.username){
        //操作cookie
        res.setHeader('Set-cookie',`username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        return new SuccessModel
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  } 
  //登陆验证测试
  if(method ==='GET'&&req.path==='/api/user/login-test'){
    // console.log(req.cookie);
    if(req.cookie.username){
      return Promise.resolve(new SuccessModel(req.cookie.username))
    }else{
      return Promise.resolve(new ErrorModel('未登陆'))
    }
  }

  
}
module.exports = handleUserRouter