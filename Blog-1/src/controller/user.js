const loginCheck=(username,password) => {
  //使用假数据
  if(username=='p'&&password=='1'){
    return true
  }else{
    return false
  }
}
module.exports ={
  loginCheck
}