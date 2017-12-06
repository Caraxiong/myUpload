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
app.use('/css', express.static(path.join(__dirname,'css')))
console.log(path.join(__dirname,'css'))
app.engine('.html', require('ejs').__express)
app.set('view engine','html')

//取stream.js 静态资源
app.get('/stream.js',function (req, res) {
    console.log(fs.createReadStream(__dirname, '/node_modules/socket.io-stream/socket.io-stream.js').pipe(res))
    fs.createReadStream(__dirname, '/node_modules/socket.io-stream/socket.io-stream.js').pipe(res);
})
//上传接口
app.get('/', function(req, res){
    res.render('upload')
})

function path_exist(p){
    return fs.existsSync(path.join(__dirname,'uploadFolder',path.dirname(p)))
}

function create_folder(p) {
    shell.mkdir('-p',path.join(__dirname,'uploadFolder',path.dirname(p)))
}

io.of('caraxiong').on('connection', function(socket, files) {
    ss(socket).on('upload', function(read_stream, data){
        console.log(data, 'receive upload event')
        if(!path_exist(data.path)){
            create_folder(data.path)
        }

        var files = {}
        files[data.path] = 0
        //  { 'src/compoents/hello.vue':10,'src/statice/jquery.js':124,'src/css/style.css':256}
        var p = path.join(__dirname,'uploadFolder',data.path)
        var write_stream = fs.createWriteStream(p)
        var size = 0
        read_stream.on('data', function(chunk){
            if(!file[data.path]){
                files[data.path] = 0
            }
            files[data.path] += chunk.length
            //防止读取太快，写入太慢发生卡顿
            if(!write_stream.write(chunk)){
                read_stream.pause()
            }

            socket.emit('progress', { current: files[data.path], totle:data.size, path:data.path})
        })

        //防止爆仓，当写完之后开始读取
        write_stream.on('drain', function(){
            read_stream.resume()
        })

        read_stream.on('end', function(){
            socket.emit('progress', { current: files[data.path], totle:data.size, path:data.path})
            socket.emit('end',{path: data.path})
            delete files[data.path]
            write_stream.end()
        })
    })
})

server.listen(7500)
