// @flow
import type { Component, Children, Props, Node } from './types'

/**
 * Parse a JSX node to JavaScript
 * @param component
 * @param props
 * @param children
 * @returns {{component: Component, props: V.props, children: Children[]}}
 * @constructor
 */
function V (component: Component, props: Props, ...children: Children): Node {
  return {
    component,
    props,
    children
  }
}

/**
 * Check if a node has updated
 * @param oldNode
 * @param newNode
 * @returns {boolean}
 */
function changed (oldNode: Node, newNode: Node): boolean {
  return typeof oldNode !== typeof newNode || // If node1 is in any way different to node2
    typeof oldNode === 'string' && oldNode !== newNode || // If both nodes are strings but are different
    typeof oldNode.type !== newNode.type // If both are Vapor components but types are
}

/**
 * Update a node
 * @param $parent
 * @param newNode
 * @param oldNode
 * @param index
 */
function updateNode ($parent: Object, newNode: Node, oldNode: Node, index: number = 0): void {
  if (!oldNode) {
    $parent.appendChild(createNode(newNode))
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index])
  }
}

/**
 * Create a node
 * @param node
 * @returns {*}
 */
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

  const $element: Object = document.createElement(node.component)

  node.children.map(function (child) {
    $element.appendChild(createNode(child))
  })

  return $element
}

function render (app: Node, root: Object): void {
  root.appendChild(createNode(app))
}

export default V
export {
  createNode,
  render
}
