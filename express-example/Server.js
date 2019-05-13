'use strict'

const http = require('http')
const express = require('express')
const compression = require('compression')
const time = require('response-time')
const responsePoweredBy = require('response-powered-by')
const errorhandler = require('errorhandler')
const morgan = require('morgan')
const body = require('body-parser')
const path = require('path')
const serve = require('express').static
const favicon = require('serve-favicon')
const initSocket = require('./socket')
const mongoConnect = require('./lib/db')
const Post = require('./dao/Post')
const { DB } = require('./lib/utility')

class Application {
    constructor(cfg = {}) {
        this.cfg = cfg
        this.app = express()
        this.http = http.Server(this.app)
        this.dbConnection = mongoConnect(this.cfg.database)
        this.ctx = {}
        this.ctx.cfg = this.cfg
        this.ctx.dbConnection = this.dbConnection
        this.app.ctx = this.ctx
    }
    async initDB() {
        await this.dbConnection.connect()
        const initializers = [Post.setupPost]
        await DB.setupCollections(this.dbConnection.db, initializers)
    }
    async closeDB() {
        await this.dbConnection.close()
    }
    initSocket() {
        // Start the web socket
        initSocket(this.http)
    }
    initExpress() {
        if (this.cfg.server.proxy) {
            this.app.enable('trust proxy')
        } else {     
            this.app.disable('trust proxy')
        }    
        this.app.set('port', this.cfg.server.port)
    }
    initMiddlewares() {
        this.app.use(errorhandler())

        // Set express server port
        this.app.set('port', process.env.PORT || this.cfg.server.port)

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
     // Inizialize http connection and attach express app to it
     initHttp() {
        return new Promise((resolve, reject) => {
            this.http.listen(this.cfg.server.port, this.cfg.server.host, (err) => {
                if (err) {
                    reject(err)
                } else {
                    const cfg = this.cfg.server
                    console.log(`Server started at: ${cfg.protocol}://${cfg.host}:${cfg.port}`)
                    resolve()
                }
            })
        })
    }
    // Close http connection
    closeHttp() {
        return new Promise((resolve, reject) => {
            if(this.http) {
                this.http.close((err) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.http = null
                        resolve()
                    }  
                })
            }  
        })
    }
}

module.exports = function createServer(cfg = {}) {
     // Init Application
    const app = new Application(cfg)
    // Expose function to start the server
    async function start () {
        await app.initDB()
        app.initSocket()
        app.initMiddlewares()
        app.initSubApp()
        await app.initHttp()
    }
    // Expose function to stop the server
    async function stop () {
        await app.closeDB()
        await app.closeHttp()
    }
    return {
        start,
        stop
    }
}