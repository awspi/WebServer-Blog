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
  const id=req.query.id

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
    const data=getDetail(id)
    return new SuccessModel(data)
  }

  //新建一篇博客
  if(method=='POST'&&req.path==='/api/blog/new'){
    const blogData=req.body
    const data=newBlog(blogData)
    return new SuccessModel(data)
  }

  //更新一篇博客
  if(method=='POST'&&req.path==='/api/blog/update'){

    const result=updateBlog(id,req.body)
    if(result){
      return new SuccessModel()
    }else{
      return new ErrorModel('update err')
    }
  }

  //删除一篇博客
  if(method=='POST'&&req.path==='/api/blog/del'){
    const result=delBlog(id,req.body)
    if(result){
      return new SuccessModel()
    }else{
      return new ErrorModel('del err')
    }
  }
}

module.exports=handleBlogRouter