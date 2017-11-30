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
})
let server = app.listen(3000, function() {
    let host = server.address().address
    let port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
