'use strict'

const createServer = require('./Server')
const mongoConnect = require('./lib/db')
const cfg = require('./config')

async function run () {
    try {
        await mongoConnect(cfg.database)
        createServer(cfg)
    } catch (err) {
        console.error('Sorry error happened on starting the application ... ')
        console.error(err)
    }
}

run()