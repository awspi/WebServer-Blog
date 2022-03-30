const querystring=require('querystring')
const handleBlogRouter=require('./src/router/blog')
const handleUserRouter=require('./src/router/user')

//用于处理post
const getPostData=(req)=>{
  const promise = new Promise((resolve, reject) =>{
    if(req.method!=='POST'){//不是post返回空
      resolve({})
      return
    }
    if(req.header['Content-Type']!=='application/json'){//不满足格式返回空
      resolve({})
      return
    }
    let postData=''
    req.on('data',chunk =>{
      postData+=chunk.toString()
    })
    req.on('end',() =>{
      if(postData==''){
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })



  })
  return promise
}

const serverHandle=(req, res) => {
  //设置返回格式
  res.setHeader('Content-Type', 'application/json')

  //获取path
  const url=req.url
  req.path=url.split('?')[0]

  //解析 query
  req.query=querystring.parse(url.split('?')[0])

  //处理postData
  getPostData(req).then(postData=>{
    req.body=postData//之后可以通过req.body获取postData

    //处理blog路由
    const blogData=handleBlogRouter(req,res)
    if(blogData){
      res.end(
        JSON.stringify(blogData)
      )
      return
    }

    //处理user路由
    const userData=handleUserRouter(req,res)
    if(userData){
      res.end(
        JSON.stringify(userData)
      )
      return
    }

    //未命中路由 返回404
    res.writeHead(404,{"Content-type":"text/plain"})
    res.write("404 Not Found\n")
  })


}

module.exports=serverHandle