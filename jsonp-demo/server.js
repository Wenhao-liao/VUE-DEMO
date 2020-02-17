var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.env.PORT || 8888;


var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery);
  console.log(method.toUpperCase())
  if(path === '/'){
    var string = fs.readFileSync('./index.html','utf8');
    var amount = fs.readFileSync('./db.txt','utf8');
    string = string.replace('&&&amount&&&',amount);
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    response.write(string);
    response.statusCode = 200;
    response.end()
  } else if(path === '/x'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write(`body{color: red;}`)
    response.end()
  } else if(path === '/pay' && method.toUpperCase() === 'GET'){
    response.setHeader('Content-Type','application/javascrpit')
    if(Math.random()>0.5){
      var amount = fs.readFileSync('./db.txt','utf8');
      var newAmount = amount - 1;
      fs.writeFileSync('./db.txt',newAmount);
      response.write(`
        ${query.callbackName}.call(undefined,'success')
      `);
    }else{
      response.write(` alert('fail');`)
    }
    response.end();
  }else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`你输入的路径不存在对应的内容`)
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)



