'use strict'

const ObjectId = require('mongodb').ObjectId

const POSTS = 'posts'

async function find (db, query = {}) {
    return (await db.collection(POSTS).find(query)).toArray()
}

function findById (db, id) {
    return db.collection(POSTS).findOne({ _id: ObjectId(id) })
}

function updateById (db, id, data = {}, opts = {}) {
    const query = {
        _id: ObjectId(id)
    }
    const update = {
        $set: data
    }
    const defaultOpts = {
        returnOriginal: false
    }
    const options = Object.assign({}, defaultOpts, opts)
    return db.collection(POSTS).findOneAndUpdate(query, update, options)
}

async function create (db, post = {}) {
    return (await db.collection(POSTS).insertOne(post)).ops[0]
}

function setupPost (db) {
    return db.createCollection(POSTS)
}

module.exports = {
    create,
    find,
    findById,
    updateById,
    setupPost
}