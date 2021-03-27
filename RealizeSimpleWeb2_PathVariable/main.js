const express = require('express')
const app = express()
const fs = require('fs');
const qs = require('qs');
const bodyParser = require('body-parser');
const template = require('./lib/template.js');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static('public'));

app.get('*', (req, res, next) => {
    fs.readdir('./data', (err, filelist) => {
        req.list = filelist;
        next();
    });
});

app.get('/', (req, res) => {
        var title = 'WELCOME';
        var contents = `
            <h3>${title}</h3>
            <img src="/images/${title}.jpg" alt="${title} image" width="300">
            <p>Find out about splendid capital cities around the world!</p>
        `;
        var controls = `<a href="/add">Add</a>`;

        var list = template.list(req.list);
        var html = template.html(title, list, controls, contents);
        res.send(html);
});

app.get('/page/:pageId', (req, res) => {
    var title = req.params.pageId;
    var list = template.list(req.list);
    var controls = template.controls(title);
    fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
        var contents = `
            <h3>${title}</h3>
            <p>${data}</p>
        `;
        var html = template.html(title, list, controls, contents);
        res.send(html);
    }); 
});

app.get('/add', (req, res) => {
    var title = "Add";
    var list = template.list(req.list);
    var controls = '';
    var contents = `
        <form action="/add" name="adding" method="post">
            <label for="title">Title</label><br><br>
            <input type="text" name="title" id="title"/><br><br>
            <label for="description">Description</label><br><br>
            <textarea name="description" id="description"></textarea><br><br>
            <button type="submit">Add this city!</button>
        </form>
    `;
    var html = template.html(title, list, controls, contents);
    res.send(html);
});

app.post('/add', (req, res) => {
    var post = req.body;
    var title = post.title;
    var description = post.description;

    fs.writeFile(`./data/${title}`, description, 'utf-8', (err) => {
        res.redirect(`/page/${title}`);
    });
});

app.get('/update/:pageId', (req, res) => {
    var id = req.params.pageId;
    var list = template.list(req.list);
    var controls = '';
    fs.readFile(`./data/${id}`, 'utf-8', (err, data) => {
        var contents = `
        <form action="/update" name="adding" method="post">
            <input type="hidden" name="id" value="${id}">
            <label for="title">Title</label><br><br>
            <input type="text" name="title" id="title" value="${id}"/><br><br>
            <label for="description">Description</label><br><br>
            <textarea name="description" id="description">${data}</textarea><br><br>
            <button type="submit">Add this city!</button>
        </form>
    `;
    var html = template.html('Update', list, controls, contents);
    res.send(html);
    });
});

app.post('/update', (req, res) => {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;

    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        fs.writeFile(`./data/${title}`, description, 'utf-8', (err) => {
            res.redirect(`/page/${title}`);
        });
    });
});

app.post('/delete', (req, res) => {
    var toDelete = req.body.id;
    fs.unlink(`./data/${toDelete}`, (err) => {
        res.redirect(`/`);
    });
});

app.listen(3000);