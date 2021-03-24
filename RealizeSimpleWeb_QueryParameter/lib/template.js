module.exports = {
    html : (title, list, body, button) =>{
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
    },
    list : (fileList) => {
      var list = '<ul>';
      for(var i=0;i<fileList.length;i++){
        list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      }
      list += '</ul>';
      return list;
    }
  }