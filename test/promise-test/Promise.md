

# Promise

## 为什么使用？

- 使用next依次读取files文件夹三个文件

  - ```json
    {//a.json
        "next": "b.json",
        "msg": "this is a"
    }	
    ```

  - ```json
    {//b.json
        "next": "c.json",
        "msg": "this is b"
    }
    ```

  - ```json
    {//c.json
        "next": null,
        "msg": "this is c"
    }
    ```

    

```js
const { rejects } = require('assert')
const fs = require('fs')
const path = require('path')

function getFileContent(fileName, callback) {
  const fullFileName = path.resolve(__dirname, 'files', fileName)
  fs.readFile(fullFileName, (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    callback(
      JSON.parse(data.toString())
    )
  })
}

```

**回调函数嵌套太多，难以阅读**

```js
//回调地狱 回调函数嵌套 金字塔形
getFileContent('a.json', aData => {
  console.log('a data', aData)
  getFileContent(aData.next, bData => {
    console.log('b data', bData)
    getFileContent(bData.next, cData => {
      console.log('c data', cData)
    })
  })
```

- 使用promise代替

## 如何使用？

```js
const { rejects } = require('assert')
const fs = require('fs')
const path = require('path')
//使用promise获取文件内容
function getFileContent(fileName) {
  const promise = new promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      resolve(
        JSON.parse(data.toString())
      )
    })
  })
  return promise
}

getFileContent('a.json').then(aData=>{
  console.log('a data', aData);
})
```

**getFileContent**

```js
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
```



## 更方便的方法



 async await

//后续koa2中详细