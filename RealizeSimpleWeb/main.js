var http = require('http');
var fs = require('fs');
var url = require('url');

templateHTML = (title, list, body) =>{
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
        }else{
          description = `
          <h2>${title}</h2>
          <p>${data}</p>
          `;
        }
        fs.readdir('./data', (err, fileList) => {
          response.writeHead(200);
          response.end(templateHTML(title, templateList(fileList), description));
        });
      });
      
    }else{
      response.writeHead(404);
      response.end('Not Found');
    } 

});
app.listen(3000);