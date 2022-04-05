const fs= require('fs')
const path= require('path')
const readline= require('readline')

//文件名
const fileName = path.join(__dirname,'../','../' ,'logs','access.log')
//创建read stream
const readStream=fs.createReadStream(fileName)

//创建readline对象
const rl=readline.createInterface({
  input:readStream
})

let chromeNum=0
let sum=0

//逐行读取
rl.on('line',(lineData) =>{
  if(!lineData) return;
  sum++;
  if(arr[2]&&arr[2].indexOf('chrome'>0)){
    chromeNum++;
  }
})
//w完成
rl.on('close',() =>{
  console.log('chrome占比'+chromeNum/sum)
})