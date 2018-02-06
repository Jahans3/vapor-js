// @flow

type Component = string | Function
type Props = string | Array<Object>

function V (component: Component, props: Props, ...children: ): { component: Component, props: Props, children} {
  return {
    component,
    props,
    children
  }
}

function createNode (node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  /*
    TODO
    - Check local cache to see if node has already been rendered
    - If no cached component is found then generate the component
    - If cached component is found pull it from storage (need good pattern/convention for storing components)
   */
  const element = document.createElement(node.component)

  node.children.map(createNode)

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
