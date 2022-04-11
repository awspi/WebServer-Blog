var express = require('express');
const { is } = require('express/lib/request');
var router = express.Router();
const{login}=require('../controller/user')
const {SuccessModel,ErrorModel}=require('../model/resModel')

router.post('/login', function(req, res, next) {
  const {username,password}=req.body
  const result=login(username,password)
  console.log();
  return result.then(data => {
   
    if(data.username){
      //设置session
      req.session.username = data.username
      req.session.realname=data.realname

      res.json(
        new SuccessModel()
      ) 
      return
    }else{
      res.json(new ErrorModel('登陆失败'))
    }
  })
  
});




// router.get('/login-test',(req, res, next) => {
//   if(req.session.username){
//     res.json({
//       errNo:0,
//       msg:'already login'
//     })
//     return
//   }else{
//     res.json({
//       errNo:-1, 
//       msg:"not login "
//     })
//   }
// })
// router.get('/session-test',(req, res, next) => {
//   const session=req.session;
//   if(session.viewNum==null){
//     session.viewNum=0
//   }
//   session.viewNum++;
//   res.json({
//     viewNum: session.viewNum
//   })
// })



module.exports = router;
