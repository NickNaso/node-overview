'use strict'

const bcrypt = require('bcrypt')
const mongoConnect = require('./lib/db')
const cfg = require('./config')
const posts = require('./seeds/posts.json')
// const users = require('./seeds/users.json')

function crypt (user) {
    user.password =  bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
    return user
}

async function seed() {
    const dbConnection = mongoConnect(cfg.database)
    try {
        await dbConnection.connect()
        const db = dbConnection.db
        await Promise.all([
            db.collection('posts').insertMany(posts),
            // db.collection('users').insertMany(users.map(crypt))
        ])
        await dbConnection.close()
        process.exit(0)
    } catch (err) {
        console.error('Error happened executing seeds script')
        console.error(err)
        await dbConnection.close()
    }
}

seed().catch( err => {console.error(err) })