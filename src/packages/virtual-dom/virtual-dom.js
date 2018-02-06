// @flow

function V (component, props, ...children) {
  return {
    component,
    props,
    children
  }
}

function createNode (node) {
  if (typeof node === 'string') {
    return document.createElement
  }

  const { component, children } = node
  const element = document.createElement(component)

  children.map(createNode)

  return element
}

function render (app, root) {
  root.appendChild(createNode(app))
}

export default V
export {
  createNode,
  render
}
