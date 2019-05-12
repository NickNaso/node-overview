

'use strict'

const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const readFileP = promisify(readFile)
const writeFileP = promisify(writeFile)

async function run () {
    const [, , src, dest] = process.argv
    const content = await readFileP(src)
    await writeFileP(dest, content)
}

run().catch( err => console.error(err))