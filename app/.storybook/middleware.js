const proxy = require('http-proxy-middleware')

const expressMiddleWare = router => {
    router.use('/graphql', proxy({
        target: 'http://localhost:4000/',
        changeOrigin: true
        }))
}

module.exports = expressMiddleWare