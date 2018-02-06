// @flow
import type { Component, Children, Props, Node } from './types'

function V (component: Component, props: Props, ...children: Children): Node {
  return {
    component,
    props,
    children
  }
}

function createNode (node: Node): Object {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  /*
    TODO
    - Check local cache to see if node has already been rendered
    - If no cached component is found then generate the component
    - If cached component is found pull it from storage (need good pattern/convention for storing components)
   */
  if (typeof node.component === 'function') {
    node.component = node.component(node.children)
    return createNode(node)
  }

  const element = document.createElement(node.component)

  node.children.map(function (child) {
    element.appendChild(createNode(child))
  })

  return element
}

function render (app: Node, root: Object): void {
  root.appendChild(createNode(app))
}

export default V
export {
  createNode,
  render
}
