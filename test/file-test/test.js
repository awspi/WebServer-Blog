const fs= require('fs')
const path= require('path')

const fileName=path.resolve(__dirname, 'data.txt')


// //读入文件
// fs.readFile(fileName,(err, data) => {//data可能是很大的文件
//   if (err){
//     console.error(err)
//     return
//   }
//   console.log(data.toString());//data为二进制
// })


//写入文件
const content='con1\n'//如果内容很大,内存可能不够
const opt={
  flag:'a'//追加 覆盖用w
}

fs.writeFile(fileName,content,opt,(err, data) => {
  if (err){
    log.error(err)
  }
})

//文件是否存在
fs.exists(fileName,(exist)=>{
  console.log('exist',exist);
})