var http = require('http')
var querystring = require('querystring');

http.createServer(function(req, res) {
  req.cookies = parseCookie(req.headers.cookie)
  if (req.method == 'POST') {
    reqPostData(req, res)
  } else {
    reqGetHandle(req, res)
  }
}).listen(3000)

console.log('server running at http://127.0.0.1:3000');

//解析cookie
var parseCookie = function(arg) {
  var cookie = {}
  if (!arg) {
    return arg
  }
  var list = arg.split(';')
  for (var i = 0; i < list.length; i++) {
    var pair = list[i].split('=')
    cookie[pair[0].trim()] = pair[1]
  }
  return cookie
}

//处理request
var reqGetHandle = function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  if (req.cookies == undefined) {
    res.write('<form action="/username" method="post">' +
      'username <input type="text" name="username"><br><br>' +
      'password <input type="text" name="password"><br><br> ' +
      '<input type="submit" value="submit"></form>')
    res.end()
  } else {
    if (!req.cookies.a) {
      res.end('welcome first time')
    } else {
      res.end('welcome again')
    }
  }
}

//表单post数据
var reqPostData = function(req, res) {
  var postData = '';
  req.on('data', function(data) {
    postData += data;
  });
  req.on('end', function() {
    var params = querystring.parse(postData);
    console.log(params)
    res.writeHead(200, {
      'Location': params.username
    });
    res.end('welcome ' + params.username)
  });
}
