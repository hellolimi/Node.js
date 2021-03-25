const express = require('express')
const app = express()
const fs = require('fs');
const qs = require('qs');
const template = require('./lib/template.js');


app.get('/', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        let title = 'WELCOME';
        let contents = 'Find out about splendid cpital cities around the world!';
        let controls = `<a href="/create">Add a City</a>`;

        let list = template.list(filelist);
        let html = template.html(title, list, controls, contents);
        
        res.send(html);
    });
});

app.get('/:pageId', (req, res) => {
    let title = req.params.pageId;
    fs.readdir(`./data/${title}`, (err, filelist) => {
        let controls = `
        <a href="/create">Add</a>
        <a href="/update">Update</a>
        <form action="/delete" method="post">
            <input type="hidden" value="${title}" name="id"/> 
            <button>Delete</button> 
        </form>
        `;
        let list = template.list(filelist);
        fs.readFile(`./data/${title}`, 'utf-8', (err, contents) => {
            let html = template.html(title, list, controls, contents);
            res.send(html);
        }); 
    });
});

app.get('/create', (req, res) => {
    
});


app.listen(3000);