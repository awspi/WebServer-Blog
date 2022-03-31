const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}=require('../controller/blog')
const{SuccessModel,ErrorModel}=require('../model/resModel')
const {exec}=require('../db/mysql')

const handleBlogRouter=(req,res)=>{
  const method=req.method
  const id=req.query.id//id

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

module.exports=handleBlogRouter