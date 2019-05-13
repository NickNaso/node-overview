'use strict'

const Post = require('../../dao/Post')
const Hertzy = require('hertzy')
const fqp = Hertzy.tune('posts')

module.exports = {
    
    async getPosts (req, res, next) {
        try {
            const db = req.app.ctx.dbConnection.db
            const posts = await Post.find(db)
            res.status(200).json(posts)
        } catch (err) {
            next(err)
        }
    },

    async getPost (req, res, next) {
        try {
            const db = req.app.ctx.dbConnection.db
            const post = await Post.findById(db, req.params.id) 
            res.status(200).json(post)
        } catch (err) {
            next(err)
        }
    },

    async updatePost (req, res, next) {
        try {
            const db = req.app.ctx.dbConnection.db
            let post = await Post.updateById(db, req.params.id, req.body)
            fqp.emit('post:update', post)
            res.status(200).json(post)
        } catch (err) {
            next(err)
        }
    }, 

    async createPost (req, res, next) {
        try {
            const db = req.app.ctx.dbConnection.db
            const post = await Post.create(db, req.body)
            fqp.emit('post:create', post)
            res.status(201).json(post)
        } catch (err) {
            next(err)
        }
    }

}