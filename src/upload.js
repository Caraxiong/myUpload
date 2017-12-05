const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multipart = require('connect-multiparty')
const shell = require('shelljs')

const app = express()

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.get('/', function(req, res){
    res.render('index')
})

app.post('/upload', multipart(), function(req, res) {
    let files = req.files.files
    console.log(files)

    for(let i = 0; i < files.length; i++){
        let f = files[i]
        if(!path_exist(f.name)){
            console.log('no path_exist')
            create_folder(f.name)
        }

        let p = path.join(__dirname,'uploadFolder', f.name)
        fs.createReadStream(f.path).pipe(fs.createWriteStream(p))
    }
})
let path_exist = function(p) {
    // fs.exists() 的同步版本。 如果文件存在，则返回 true，否则返回 false。
    return fs.existsSync(path.join(__dirname, 'uploadFolder', path.dirname(p)))
}

let create_folder = function(p) {
    //
    shell.mkdir('-p', path.join(__dirname,'uploadFolder', path.dirname(p)))
}

let server = app.listen(3000, function() {
    let host = server.address().address
    let port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
