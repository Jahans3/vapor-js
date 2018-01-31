const vaporChildrenId = '{V{children}V}'

// Make a Vapor HOC that intercepts children somehow?

// Import from './renderer.js soon
const renderer = async ({ tree }) => {
  const { component, data: { children, ...data } } = tree
  const resolvedData = await component.vaporFetch()
  const renderChildren = await Promise.all(children.map(async child => renderer({ tree: child })))
  const renderedComponent = component({ ...data, ...resolvedData })
  // Replace TemplateRoutes with rendered child components
  return renderedComponent.replace(vaporChildrenId, renderChildren)
}

// Basic idea of what Vapor class might look like (may also need to extend React.Component)
class Vapor {
  static vaporFetch (...args) {
  return new Promise(resolve => {
  setTimeout(() => { resolve({ title: 'Welcome to Vapor!', content: 'Lorem ipsum...' }) }, 500)
})
}
}

// Example Vapor component (final will use React)
class Example extends Vapor {
  render = ({ title, content } = this.props) => (`
    <div class="example">
      <h1>${title}</h1>
      <p>${content}</p>
      {V{children}V}
    </div>
  `)
  }

  ;(async function () {
  const Component = new Example({ content: 'Content wooo' })
  const props = await Example.vaporFetch()
  const c = Component.render(props)

  if (c.match(/{V{children}V}/g)) {
  // call on children
  // recursively append children until we get back to top-level Vapor component
  }

  console.log(c)
  })()

// 1-Deep
  const VaporTree = {
  component: Example,
  props: {
  title: 'Example Title!',
  content: 'Lorem ipsum...',
  children: []
  }
  }

// N-Deep
