# 日志

1. 
   访问日志access log( server端最重要的日志)
2. 自定义日志(包括自定义事件、错误记录等)

- nodejs文件操作, nodejs stream
- 日志功能开发和使用
- 日志文件拆分，日志内容分析

**为什么日志不保存在mysql redis**

- 文件很大
- 对性能要求不高,慢也可以
- 多个表联动,orderby等场景才用mysql,日志是一条一条的

## nodejs文件操作

```js
const fs= require('fs')
const path= require('path')
const fileName=path.resolve(__dirname, 'data.txt')
```

### 读入文件

```js
//读入文件
fs.readFile(fileName,(err, data) => {//data可能是很大的文件
  if (err){
    console.error(err)
    return
  }
  console.log(data.toString());//data为二进制
})
```

### 写入文件

```js
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
```

### 文件是否存在

```js
//文件是否存在
fs.exists(fileName,(exist)=>{
  console.log('exist',exist);
})
```

## Stream

io包括网络io和文件io

I/O操作存在性能瓶颈

在有限性能下提高速度



![stream1](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/stream1.png)

```js
const fs=require('fs')
const path=require('path')

const fileName1 = path.join(__dirname,'1.txt')
const fileName2 = path.join(__dirname,'1-bak.txt')

const readStream=fs.createReadStream(fileName1)
const writeStream=fs.createWriteStream(fileName2)

readStream.pipe(writeStream)
readStream.on('end', () =>{
  console.log('copy done');
})
```

![stream2](/Users/wsp/Documents/NodeJs/WebServer-Blog/img/stream2.png)

```js
const http=require('http')
const fs=require('fs')
const path=require('path')
const fileName = path.join(__dirname,'1.txt')
const server=http.createServer((req, res) => {
  if (req.method === 'GET'){
    const readStream = fs.createReadStream(fileName)
    readStream.pipe(res)
  }
})
server.listen(8000)
```

## 写日志

根目录新建logs文件夹,文件夹下新建access.logs

utils/log.js

```js
const fs= require('fs')
const path= require('path')

// 写日志
function writeLog(writeStream,log){
  writeStream.write(log+'\n');//关键代码
}

//生成 write Stream
function createWriteStream(fileName){
  const fullFileName= path.resolve(__dirname, '../','../' ,'logs',fileName)
  const writeStream= fs.createWriteStream(fullFileName,{
    flags:'a'
  })
  return writeStream
}

//写访问日志
const accessWriteStream= createWriteStream('access.log')
function access(log){
  writeLog(accessWriteStream,log)
}

module.exports ={
  access
}
```

app.js  在serverHandler函数下

```js
//记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)
```

## 日志拆分

- 日志内容会慢慢累积,放在一个文件中不好处理
- 按时间划分日志,如2022.4.5.access.log
- 实现方式:Linux的crontab命令,即定时任务

### crontab

## 分析日志

### readline

```js
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
```

