const http = require('http')
const https = require('https')

const url = require('url')
const path = require('path')
const fs = require('fs')

if(!process.argv[2]) {
    throw new Error('specify port')
}

const port = parseInt(process.argv[2], 10)

let reqCount = 0

const serverHandler = function (request, response) {
    // console.log( 'req #' + (reqCount++) + ': ' + request.connection.remoteAddress )

    const uri = url.parse(request.url).pathname
    let filename = path.join(process.cwd(), 'static', uri)

    const contentTypesByExtension = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
    }

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { 'Content-Type': 'text/plain' })
            response.write('404 Not Found\n')
            response.end()
            return
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html'

        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' })
                response.write(err + '\n')
                response.end()
                return
            }

            const headers = {}
            const contentType = contentTypesByExtension[path.extname(filename)]
            if (contentType) {
                headers['Content-Type'] = contentType
            }
            response.writeHead(200, headers)
            response.write(file, 'binary')
            response.end()
        })
    })
}

http.createServer(serverHandler).listen(port)

console.log(`Server running at http://localhost:/${port}`)
