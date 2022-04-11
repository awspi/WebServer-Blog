var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { exec } = require('../db/mysql')

router.get('/list', function(req, res, next) {
  
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  // if (!req.query.isadmin) {
  //   const loginCheckResult = loginCheck(req)
  //   if (loginCheckResult) {
  //     return loginCheckResult
  //   }
  //   author = req.session.username
  // }


  const result = getList(author, keyword)
  return result.then(listData => {//return result.then
    res.json(
      new SuccessModel(listData)
    ) 
  })
});



router.get('/detail', function(req, res, next) {
  res.json({
    errNo:0,
    data:'haha'
  })
  
});

module.exports = router;
