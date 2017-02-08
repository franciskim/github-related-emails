const https = require('https')
let argv = require('yargs').argv

let options = {
    hostname: 'api.github.com',
    headers: {'user-agent': 'Mozilla/5.0'},
    port: 443,
    method: 'GET'
}

const clean = emails => {
    let uniq = emails
        .map(email => {
            return {count: 1, name: email}
        })
        .reduce((a, b) => {
            a[b.name] = (a[b.name] || 0) + b.count
            return a
        }, {})

    let sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])
    return sorted.filter(e => {
        return !e.includes('github.com') && !e.includes('example.com')
    })
}

const process = (options, resolve, reject) => {
    https.get(options, res => {
        if (res.statusCode !== 200) console.error(`Status code: ${res.statusCode}`)
        let body = ''
        let emails
        res.on('data', d => {
            body += d
        })
        res.on('end', () => {
            emails = body.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm)
            if (emails != null && emails.length > 0) {
                emails = clean(emails)
            }
            if (typeof resolve === 'function') {
                // module usage
                resolve(emails)
            }
            else if (argv.user) {
                // CLI usage
                if (emails != null && emails.length > 0) {
                    console.log(emails)
                }
                else console.log('Nothing found!')
            }
        })
    }).on('error', e => {
        reject(e)
    })
}

if (argv.user) {
    options.path = `/users/${argv.user}/events/public`
    process(options)
}

module.exports = user => {
    return new Promise((resolve, reject) => {
        options.path = `/users/${user}/events/public`
        process(options, resolve, reject)
    })
}