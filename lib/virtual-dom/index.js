// @flow

const V = (component, props, ...children) => ({
  component,
  props: {
    ...props,
    ...children
  }
})

const example = {
  component: 'Name',
  props: {
    key: 'value'
  }
}

const e = (
  <ul className="list">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
)

console.log(e)

export default e

// const V = require('./virtual-dom')
//
// module.exports = V.default ? V.default : V
