'use strict'

const cfg = require('./config')
const createServer = require('./Server')

async function run () {
    try {
        const app = createServer(cfg)
        await app.start()
        /* Handling termination of server. This handler take in regard of
        'SIGTERM' (CTRL+C termination) signals. It is not supported on Windows, 
        it can be listened on */
        process.on('SIGTERM', async () => {
            await app.stop()
            process.exit(0)
        })

        /* Handling termination of server. This handler take in regard of
        'SIGINT' (CTRL+C termination) signals. It is not supported on Windows, it
        can be listened on */
        process.on('SIGINT', async () => {
            await app.stop()
            process.exit(0)
        })

        /* This event is only emitted when Node.js exits explicitly by 
        process.exit() or implicitly by the event loop draining. */
        process.on('exit', () => {
            // ---
        })

        process.on('unhandledRejection', async (err) => {
            console.error('Error details: ')
            console.error(err)
            await app.stop()
            await app.start()
        })

        process.on('uncaughtException', async (err) => {
            console.error('Error details: ')
            consoles.error(err)
            await app.stop()
            await app.start()
        })    
    } catch (err) {
        console.error('Sorry error happened on starting the application ... ')
        console.error(err)
        await server.stop()
    }
}

run()