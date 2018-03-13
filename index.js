const Vapor = require('./lib/vapor.node')

console.log('-------------')
console.log(Vapor)
console.log('-------------')

module.exports = Vapor.default ? Vapor.default : Vapor
