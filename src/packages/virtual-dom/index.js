const V = require('./virtual-dom')

/*
    Plugin required for custom JSX transforms

    ["transform-react-jsx", {
      "pragma": "Vapor"
    }],
 */

module.exports = V
module.exports.V = V.default ? V.default : V
