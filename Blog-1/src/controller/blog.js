const {exec} = require('../db/mysql')
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

const getDetail=(id)=>{
  return {
    id:1,
    title:'title1',
    content:'content1',
    createTime:1648569048,
    author:'Pithy'
  }
}

//新建博客
const newBlog=(blogData={})=>{
  //blogData为一个博客对象 包含 title content属性
  
  return {
    id:3//表示新建博客插入到数据表里的id

  }
}

//更新博客
const updateBlog=(id,blogData={})=>{
  //id:要更新的博客id
  //blogData为一个博客对象 包含 title content属性
  console.log('update blog',id,blogData);
  return true
}

//删除博客
const delBlog=(id=>{
  //id:要删除的博客id
  return true
})


//返回的是对象，因为之后还有其他的函数
module.exports={
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}