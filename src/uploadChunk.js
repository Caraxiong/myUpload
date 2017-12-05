const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const fs = require('fs')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const ss = require('socket.io-stream')
const shell = require('shelljs')

app.use(cors())
app.use(bodyParser.json())
// 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
// urlencoded解析body中的urlencoded字符
app.use(bodyParser.urlencoded({ extended: false }))

//__filename：全局变量，存储的是文件名  app\test\index.html
//__dirname：全局变量，存储的是文件所在的文件目录  app\test
app.use('/static', express.static(path.join(__dirname),'static'))
app.engine('.html', require('ejs').__express)
app.set('view engine','html')

//取stream.js 静态资源
app.get('stream.js', function(req, res){
    fs.createReadStream(__dirname + '/node_modules/socket.io-stream/socket.io-stream.js').pipe(res);
})

app.get('/upload', function(req, res){
    res.render('upload')
})

function path_exist(p){
    return fs.existsSync(path.join(__dirname,'upload',path.dirname(p)))
}

function create_folder(p) {
    shell.mkdir('-p',path.join(__dirname,'upload',path.dirname(p)))
}

io.of('caraxiong').on('connection', functiom(socket, files) {
    ss(socket).on('upload', function(read_stream, data){
        
    })
})
