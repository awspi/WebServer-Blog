const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}=require('../controller/blog')
const{SuccessModel,ErrorModel}=require('../model/resModel')
const {exec}=require('../db/mysql')

//登陆验证函数
const loginCheck=(req)=>{
  if(!req.session.username){
    return Promise.resolve(new ErrorModel('未登陆'))
  }
}



const handleBlogRouter=(req,res)=>{
  const method=req.method
  const id=req.query.id//id

  //获取博客列表
  if(method=='GET'&&req.path==='/api/blog/list'){
   let author=req.query.author||''
   const keyword=req.query.keyword||''

    if(!req.query.isadmin){
      const loginCheckResult=loginCheck(req)
      if(loginCheckResult){
        return loginCheckResult
      }
      author=req.session.username
    }
   
  //  const listData=getList(author,keyword)
  //  return new SuccessModel(listData)
    // 返回的是promise
    const result=getList(author,keyword)
    return result.then(listData=>{//return result.then
      return new SuccessModel(listData)
    })
  }

  //获取博客详情
  if(method=='GET'&&req.path==='/api/blog/detail'){
    const result=getDetail(id)
    return result.then(data=>{
      return new SuccessModel(data)
    })
  }

  //新建一篇博客
  if(method=='POST'&&req.path==='/api/blog/new'){
    const loginCheckResult =loginCheck(req)
    if(loginCheckResult){
      //未登陆
      return loginCheckResult
    }


    const author=req.session.username 
    req.body.author=author
    const blogData=req.body
    const result=newBlog(blogData)
    return result.then(data=>{
      return new SuccessModel(data)
    })
    
  }

  //更新一篇博客
  if(method=='POST'&&req.path==='/api/blog/update'){
    const loginCheckResult =loginCheck(req)
    if(loginCheckResult){
      //未登陆
      return loginCheckResult
    }

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
    const loginCheckResult =loginCheck(req)
    if(loginCheckResult){
      //未登陆
      return loginCheckResult
    }

    const author=req.session.username 
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

module.exports=handleBlogRouter