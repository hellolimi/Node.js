const express = require('express')
const app = express()
const fs = require('fs');
const qs = require('qs');
const template = require('./lib/template.js');

app.get('/', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        var title = 'WELCOME';
        var contents = 'Find out about splendid cpital cities around the world!';
        var controls = `<a href="/add">Add a City</a>`;

        var list = template.list(filelist);
        var html = template.html(title, list, controls, contents);
        res.send(html);
    });
});

app.get('/page/:pageId', (req, res) => {
    var title = req.params.pageId;
    fs.readdir(`./data/`, (err, filelist) => {
        var list = template.list(filelist);
        var controls = template.controls(title);
        fs.readFile(`./data/${title}`, 'utf-8', (err, contents) => {

            var html = template.html(title, list, controls, contents);
            res.send(html);
        }); 
    });
});

app.get('/add', (req, res) => {
    fs.readdir('./data/', (err, filelist) => {
        var title = "Add";
        var list = template.list(filelist);
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
});

app.post('/add', (req, res) => {
    var formData = '';
    req.on('data', (data) => {
        formData += data;
    });
    req.on('end', () => {
        var post = qs.parse(formData);
        var title = post.title;
        var description = post.description;

        fs.writeFile(`./data/${title}`, description, 'utf-8', (err) => {
            res.redirect(`/page/${title}`);
        });
    });
});

app.get('/update/:pageId', (req, res) => {
    var id = req.params.pageId;
    fs.readdir('./data/', (err, filelist) => {
        var list = template.list(filelist);
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
});

app.post('/update', (req, res) => {
    var formData = '';
    req.on('data', (data) => {
        formData += data;
    });
    req.on('end', () => {
        var post = qs.parse(formData);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
            fs.writeFile(`./data/${title}`, description, 'utf-8', (err) => {
                res.redirect(`/page/${title}`);
            });
        });
    });
});

app.post('/delete', (req, res) => {
    var formData = '';
    req.on('data', (data) => {
        formData += data;
    });
    req.on('end', () => {
        var toDelete = qs.parse(formData).id;
        fs.unlink(`./data/${toDelete}`, (err) => {
            res.redirect(`/`);
        });
    });
});

app.listen(3000);