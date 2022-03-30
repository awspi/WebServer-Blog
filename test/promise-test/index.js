const { rejects } = require('assert')
const fs = require('fs')
const path = require('path')

// function getFileContent(fileName, callback) {
//   const fullFileName = path.resolve(__dirname, 'files', fileName)
//   fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     callback(
//       JSON.parse(data.toString())
//     )
//   })
// }
// //回调地狱 回调函数嵌套 金字塔形
// getFileContent('a.json', aData => {
//   console.log('a data', aData)
//   getFileContent(aData.next, bData => {
//     console.log('b data', bData)
//     getFileContent(bData.next, cData => {
//       console.log('c data', cData)
//     })
//   })
// })

//使用promise获取文件内容
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    fs.readFile(fullFileName, (err, data) => {
      if (err) {//处理失败
        reject(err)
        return
      }
      resolve(//处理成功
        JSON.parse(data.toString())
      )
    })
  })
  return promise
}

//promise的.then方法可以链式操作
//无论多少嵌套都是两层
getFileContent('a.json').then(aData=>{
  console.log('a data', aData)
  return getFileContent(aData.next)
}).then(bData=>{
  console.log('b data', bData)
  return getFileContent(bData.next)
}).then(cData=>{
  console.log('c data',cData)
})


//更方便的方法 async await
//后续koa2中详细