const {join: joinPath, parse: parsePath} = require('path')
const {existsSync, readFileSync} = require('fs')
const {parse: parseUrl} = require('url')
const {parse: parseQuery} = require('querystring')

const {send} = require('micro')

const fourOhFour = res => send(res, 404, 'gif not found')

module.exports = async function (req, res) {
  const parsedUrl = parseUrl(req.url);
  const pathname = parsedUrl.pathname.slice(1)

  if (!pathname) { // TODO: landing page or something
    return fourOhFour(res)
  }

  let filePath = joinPath('gifs', pathname)
  filePath = parsePath(filePath).ext === '' ? `${filePath}.gif` : filePath

  if (existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/gif')

    return send(res, 200, await readFileSync(filePath))
  }
  fourOhFour(res)
}
