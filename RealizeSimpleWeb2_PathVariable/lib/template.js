module.exports = {
    html : (title, list, controls, contents) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CAPITALS OF THE WORLD | ${title}</title>
        </head>
        <body>
            <h2><a href="/">CAPITALS OF THE WORLD</a></h2>
            <ul>
                ${list}
            </ul>
            <div class="controls">${controls}</div>
            <h3>${title}</h3>
            <p>${contents}</p>
        </body>
        <html>
        `
    },
    list : (filelist) => {
        let li = ``;
        for(var i in filelist){
            li += `<li><a href="/${filelist[i]}">${filelist[i]}</a></li>`;
        };
        return li;
    }
}