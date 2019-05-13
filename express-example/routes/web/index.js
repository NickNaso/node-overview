'use strict'

const express = require('express')
const ctrl = require('./ctrl')

module.exports = function (app) {

    // SOMETIMES YOU WANT TO DO WITH MAIN EXPRESS APPLICATION

    const web = express.Router()
    web.ctx = app.ctx

    web.get('/', ctrl.index)
    
    return web
    
}