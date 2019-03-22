const http = require('http')
const https = require('https')

const url = require('url')
const path = require('path')
const fs = require('fs')

const production = Boolean(process.env.PRODUCTION)

const port = production ? 443 : 8888

let reqCount = 0

const serverHandler = function (request, response) {
    console.log( 'req #' + (reqCount++) + ': ' + request.connection.remoteAddress )

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

if(production) {
    http.createServer(function (request, response) {
        const usersUrl = url.parse(request.url)
        usersUrl.protocol = 'https'
        const to = usersUrl.href

        response.writeHead(302, {
            'Location': to
        })

        response.end()
    }).listen(80)

    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/rurururururu.ru/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/rurururururu.ru/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/rurururururu.ru/chain.pem')
    }

    https.createServer(options, serverHandler).listen(port)
} else {
    http.createServer(serverHandler).listen(port)
}

console.log('Server running at localhost.\n\nCTRL + C to shutdown')
