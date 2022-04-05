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
  if(method ==='POST'&&req.path==='/api/user/login'){
    // const{username,password}=req.body
    const {username,password}=req.body
    const result=login(username,password)

    return result.then(data => {
     
      if(data.username){
        //设置session
        req.session.username = data.username
        req.session.realname=data.realname

        return new SuccessModel
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  } 
  // //登陆验证测试
  // if(method ==='GET'&&req.path==='/api/user/login-test'){
  //   if(req.session.username){
  //     return Promise.resolve(new SuccessModel({session:req.session}))
  //   }else{
  //     return Promise.resolve(new ErrorModel('未登陆'))
  //   }
  // }

  
}
module.exports = handleUserRouter