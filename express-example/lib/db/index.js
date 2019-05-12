'use strict'

const { MongoClient } = require('mongodb')

function checkCredentials(user, password) {
    return user && pass && typeof user === 'string' && typeof password === 'string'
}

function url(cfg) {
    let dbUrl = cfg.protocol + '://' 
    if (checkCredentials(cfg.user, cfg.pass)) {
        dbUrl += cfg.user + ':' + cfg.pass
    }
    dbUrl += cfg.host + ':' + cfg.port + '/' + cfg.name
    return dbUrl
}

function options(cfg) {
    return Object.assign(cfg.db, cfg.server, { useNewUrlParser: true })
}

// Function that allow to instantiate a db connection in the specific to MongoDB.
// In this way it's possible to create connection on multiple database.
function mongoConnect(opts = {}) {
    if (typeof opts !== 'object') {
        throw new TypeError('Options for db connection must be an object.')
    }
    const cfg = opts
    let connection = null
    let isConnected = false

    return {
        get db() {
            if(isConnected) {
                return connection.db(cfg.name)
            }
            throw new Error('Connection to db must be first initialized before to be requested.')
        },
        async connect() {
            connection = await MongoClient.connect(url(cfg), options(cfg))
            isConnected = true
        },
        async close() {
            if (isConnected) {
                await connection.close()
                connection = null
                isConnected = false
            }
        }
    }
}

module.exports = mongoConnect