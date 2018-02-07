// @flow
import { encode } from 'base-64'
import store from 'store'
import type { Component, Children, Props, Node } from './types'

/**
 * Parse a JSX node to JavaScript
 * @param component
 * @param props
 * @param children
 * @returns {{id: *, component: Component, props: Vapor.props, children: Children[]}}
 * @constructor
 */
function Vapor (component: Component, props: Props = {}, ...children: Children): Node {
  return {
    id: encode(JSON.stringify({ component, props, children })),
    component,
    props,
    children
  }
}

/**
 * Check if a node has updated
 * @param newNode
 * @param oldNode
 * @returns {boolean}
 */
function changed (newNode: Node, oldNode: Node): boolean {
  return newNode.id !== oldNode.id
  // return typeof newNode !== typeof oldNode || // If node1 is in a different type to node2
  //   (typeof newNode === 'string' && newNode !== oldNode) || // If both nodes are strings but are different
  //   typeof newNode.component !== typeof oldNode.component // If both are Vapor components but are different
}
/**
 * Update a node
 * @param $parent
 * @param newNode
 * @param oldNode
 * @param index
 */
function updateNode ($parent: Object, newNode: Node, oldNode: Node, index: number = 0): void {
  // If no old node exists
  if (newNode && !oldNode) {
    $parent.appendChild(createNode(newNode))

  // If no old node or new node exist
  } else if (!newNode) {
    const childNode: Object = $parent.childNodes[index]

    if (childNode) {
      $parent.removeChild(childNode)
    }

  // If the node has changed
  } else if (changed(newNode, oldNode)) {
    const childNode: Object = $parent.childNodes[index]

    if (childNode) {
      $parent.replaceChild(createNode(newNode), $parent.childNodes[index])
    }

  // If new node is an element (not a string)
  } else if (newNode.component) {
    const newLength: number = newNode.children.length
    const oldLength: number = oldNode.children.length

    for (let i: number = 0; i < newLength || i < oldLength; i++) {
      updateNode(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}

/**
 * Cache a node
 * @param node
 */
function cacheNode (node: Node): void {
  const $node: string = document.createElement(node.component).outerHTML

  if (!store.get(node.id)) {
    store.set(node.id, $node)
  }
}

/**
 * Check if a node is cached
 * @param node
 * @returns {boolean}
 */
function nodeCached (node: Node): boolean {
  return !!store.get(node.id)
}

/**
 * Get a cached node
 * @param node
 * @returns {*}
 */
function getCachedNode (node: Node): Object {
  const nodeString = store.get(node.id)
  return document.createRange().createContextualFragment(nodeString)
}

/**
 * Map a JSX prop name to DOM node attrobute names
 * @param prop
 */
function mapPropNames (prop: string): string {
  const map = { className: 'class' }
  return map[prop] || prop
}

/**
 * Apply JSX props to DOM node
 * @param $target
 * @param props
 */
function applyProps ($target: Object, props: Props = {}): void {
  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      $target.setAttribute(mapPropNames(prop), props[prop])
    }
  }
}

/**
 * Create a node or retrieve an identical cached version
 * @param node
 * @returns {*}
 */
function createNode (node: Node): Object {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node))
  }

  /*
    TODO
    - Create an ID to cache each component against - just stringify node.component + node.props (or stringify entire node???)
    - Check local cache to see if node has already been rendered
    - If no cached component is found then generate the component
    - If cached component is found pull it from storage (need good pattern/convention for storing components)
   */
  // if (nodeCached(node)) {
  //   return getCachedNode(node)
  // } else {
  //   cacheNode(node)
  // }

  if (typeof node.component === 'function') {
    node.component = node.component(node.children)
    return createNode(node)
  }

  const $element: Object = document.createElement(node.component)

  applyProps($element, node.props)

  node.children.map(function (child: Node): void {
    const $tn = createNode(child)
    $element.appendChild($tn)
  })

  return $element
}

/**
 * Temporary
 * Used to set innerHTML and act as a reminder it can be harmful
 * @param root
 * @param node
 */
function dangerouslySetInnerHTML (root: Object, node: string): void {
  root.innerHTML = node
}

/**
 * Render a Vapor app to the DOM
 * @param app
 * @param root
 */
function render (app: Node, root: Object): void {
  const $node = createNode(app)

  if (typeof $node === 'string') {
    dangerouslySetInnerHTML(root, $node)
  } else {
    root.appendChild($node)
  }
}

export default Vapor
export {
  createNode,
  render,
  updateNode,
  changed
}
