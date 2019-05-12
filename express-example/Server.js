'use strict'

const http = require('http')
const express = require('express')
const compression = require('compression')
const time = require('response-time')
const responsePoweredBy = require('response-powered-by')
const errorhandler = require('errorhandler')
const morgan = require('morgan')
const cfg = require('./config')
const body = require('body-parser')
const path = require('path')
const serve = require('express').static
const favicon = require('serve-favicon')
const initSocket = require('./socket')
const mongoConnect = require('./lib/db')

module.exports = createServer

function onStart() {
    let port = cfg.server.port
    let protocol = cfg.server.protocol
    let host = cfg.server.host
    console.log(`Server started at ${protocol}://${host}:${port}/`)
}

function createServer () {
    const app = express()

    const server = http.Server(app)
    // Start the web socket
    initSocket(server)

    app.use(errorhandler())

    // Set express server port

    app.set('port', process.env.PORT || cfg.server.port)

    app.use(time())
    app.use(compression())
    app.use(morgan('dev'))
    app.use(responsePoweredBy("@NickNaso"))

    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs').__express);
    app.set('views', path.join(__dirname, 'views'))
    
    app.use(serve(path.join(__dirname, 'public')))
    app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
    
    app.use(body.urlencoded({extended: false, inflate: true}))
    app.use(body.json({strict: true, inflate: true}))

    // Routes
    app.use('/', require('./routes/web')(app))
    app.use('/api', require('./routes/api')(app))

    // Create http server and attach express app on it
    server.listen(app.get('port'), cfg.server.host, onStart)
}

class Application {
    constructor() {
        this.cfg = cfg
        this.app = express()
        this.http = http.Server(app)
        this.dbConnection = mongoConnect(this.cfg.database)
    }
    initDB() {

    }
    closeDB() {

    }
    initSocket() {
        
    }
    initMiddlewares() {
        this.app.use(errorhandler())

        // Set express server port
        this.app.set('port', process.env.PORT || cfg.server.port)

        this.app.use(time())
        this.app.use(compression())
        this.app.use(morgan('dev'))
        this.app.use(responsePoweredBy("@NickNaso"))

        this.app.set('view engine', 'ejs');
        this.app.engine('ejs', require('ejs').__express);
        this.app.set('views', path.join(__dirname, 'views'))
        
        this.app.use(serve(path.join(__dirname, 'public')))
        this.app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
        
        this.app.use(body.urlencoded({extended: false, inflate: true}))
        this.app.use(body.json({strict: true, inflate: true}))
    }
    initSubApp() {
         // Routes
        this.app.use('/', require('./routes/web')(this.app))
        this.app.use('/api', require('./routes/api')(this.app))
    }
}

module.exports = function Server() {
     // Init Application
    const app = new Application()
    // Expose function to start the server
    async function start () {

    }
    // Expose function to stop the server
    async function stop () {

    }
    return {
        start,
        stop
    }
}