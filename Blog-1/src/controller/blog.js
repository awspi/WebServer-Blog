const getList=(author,keyword)=>{//获取博客列表
  //返回假数据
  return [
    {
      id:1,
      title:'title1',
      content:'content1',
      createTime:1648569048,
      author:'Pithy'
    },
    {
      id:2,
      title:'title2',
      content:'content2',
      createTime:1648569055,
      author:'AWSPI'
    }
  ]
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


//返回的是对象，因为之后还有其他的函数
module.exports={
  getList,
  getDetail
}