var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

templateHTML = (title, list, body, button) =>{
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${button}
    ${body}
  </body>
  </html>
  `;
}
templateList = (fileList) => {
  var list = '<ul>';
  for(var i=0;i<fileList.length;i++){
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
  }
  list += '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    var description;

    if(pathname == '/'){
      fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
        if(title == undefined){
          description =`
          <h2>WELOCME</h2>
          <p>Hello, Node.js</p>
          `;
          button = `
          <a href="/create">Creat a list</a>
          `;
        }else{
          description = `
          <h2>${title}</h2>
          <p>${data}</p>
          `;
          button = `
          <a href="/create">Creat a list</a>
          <a href="/update/?id=${title}">Update this list</a>
          `;
        }
        fs.readdir('./data', (err, fileList) => {
          response.writeHead(200);
          response.end(templateHTML(title, templateList(fileList), description, button));
        });
      });
      
    }else if(pathname == '/create'){
      title = 'WEB - create a list';
      description = `
        <br><br>
        <form action="http://localhost:3000/create_process" method="post" name="newList">
          <label for="title">Title</label><br>
          <input type="text" name="title" id="title"><br><br>
          <label for="description">Description</label><br>
          <textarea name="description"></textarea><br><br>
          <button type="submit">Submit</button>
        </form>
      `;
      button = '';
      fs.readdir('./data', (err, fileList) => {
        response.writeHead(200);
        response.end(templateHTML(title, templateList(fileList), description, button));
      });
    }else if(pathname == '/create_process'){
      var body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        fs.writeFile(`data/${title}`, description, 'utf-8', ()=> {
          response.writeHead(302, {Location:`/?id=${title}`});
          response.end();
        });
      });
    }else{
      response.writeHead(404);
      response.end('Not Found');
    } 

});
app.listen(3000);