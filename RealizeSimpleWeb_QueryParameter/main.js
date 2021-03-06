var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

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
          <a href="/update?id=${title}">Update this list</a>
          <form action="/delete" name="delete" method="post">
            <input type="hidden" value="${title}" name="id">
            <button type="submit">Delete this list</button>
          </form>
          `;
        }
        fs.readdir('./data', (err, fileList) => {
          var list = template.list(fileList);
          var html = template.html(title, list, description, button);
          response.writeHead(200);
          response.end(html);
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
        var list = template.list(fileList);
        var html = template.html(title, list, description, button);
        response.writeHead(200);
        response.end(html);
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
    }else if(pathname == '/update'){
      fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
          description = `
          <br><br>
          <form action="http://localhost:3000/update_process" method="post" name="newList">
            <input type="hidden" value="${title}" name="id">
            <label for="title">Title</label><br>
            <input type="text" name="title" id="title" value="${title}"><br><br>
            <label for="description">Description</label><br>
            <textarea name="description">${data}</textarea><br><br>
            <button type="submit">Update</button>
          </form>
        `;
        button = '';
        fs.readdir('./data', (err, fileList) => {
        var list = template.list(fileList);
        var html = template.html(title, list, description, button);
        response.writeHead(200);
        response.end(html);
        });
      });
    }else if(pathname == '/update_process'){
      var body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
          fs.writeFile(`data/${title}`, description, 'utf-8', ()=> {
            response.writeHead(302, {Location:`/?id=${title}`});
            response.end();
          });
        });
      });
    }else if(pathname == '/delete'){
      var body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, (err) => {
          response.writeHead(302, {Location:`/`});
          response.end();
        });
      });
    }else{
      response.writeHead(404);
      response.end('Not Found');
    } 

});
app.listen(3000);