'use strict'

function setupCollections (db, initializers = []) {   
    return Promise.all(initializers.map(fn => { return fn(db) }))
}

module.exports = {
    setupCollections
}