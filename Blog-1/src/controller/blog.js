const {exec} = require('../db/mysql')
const getList=(author,keyword)=>{//获取博客列表
  let sql=`select * from blogs where 1=1 `//1=1 占位 防止author和keyword没有值 //注意结尾空格
  if(author){
    sql+=`and author='${author}' `//注意结尾空格
  }
  if(keyword){
    sql+=`and title like '%${keyword}%' `//注意结尾空格
  }
  sql+=`order by createtime desc;`
  //返回的是promise
  return exec(sql)
}

//获取博客详情
const getDetail=(id)=>{
  const sql=`select * from blogs where id= '${id}'`
  return exec(sql).then(rows=>{//select返回的都是数组
    // console.log(rows);
    return rows[0]//rows是数组，把对象取出来
  })
}

//新建博客
const newBlog=(blogData={})=>{
  //blogData为一个博客对象 包含 title content属性
  const title=blogData.title
  const content=blogData.content
  const author=blogData.author
  const createtime=Date.now()
  const sql=`insert into blogs (title, content, createtime, author) value('${title}', '${content}', '${createtime}','${author}')`
  return exec(sql).then(insertData=>{
    return{
      id:insertData.insertId
    }
    // console.log(insertData)
    /*
    OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 4,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
    */ 

  })
}

//更新博客
const updateBlog=(id,blogData={})=>{
  //id:要更新的博客id
  //blogData为一个博客对象 包含 title content属性
  const title=blogData.title
  const content=blogData.content
  const sql=`update blogs set title='${title}',content='${content}' where id='${id}'`
  return exec(sql).then(updateData=>{
    if(updateData.affectedRows>0){//affectedRows 有被影响的行 说明执行成功
      return true
    }else{return false}
  })
}

//删除博客
//这里发现个问题，默认是在url后拼接参数。但是如果post里也含有id，程序会直接出错了不合适
//如果是post.data里有id，也会到这里，但是获取不到req.body.id,导致id=undefined,出错
const delBlog=((id,author)=>{
  //id:要删除的博客id
  const sql=`delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then(deleteData=>{
    if(deleteData.affectedRows>0){
      return true
    }else{return false}
  })
})


//返回的是对象，因为之后还有其他的函数
module.exports={
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}