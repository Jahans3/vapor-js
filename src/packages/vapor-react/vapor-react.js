import React from 'react'
import { renderToString } from 'react-dom/server'
import htmlParser from 'react-html-parser'

// 1. Render a React app
// 2. Each <FetchComponentHOC /> checks to see if it can find a cached version of itself
// 3. If found exact same component, mount it
// 4. Otherwise, render, cache, and mount the component
// 5. How to handle children.........?

const cacheComponent = Component => {
  const html = renderToString(<Component />)
  window.localStorage.setItem('__test__', html)
  return html
}

const getCachedComponent = () => {
  const component = window.localStorage.getItem('__test__')
  console.log('component:')
  console.log(component)
  const parsedComponent = htmlParser(component)
  console.log('parsed component:')
  console.log(parsedComponent)
  return parsedComponent
}

const FetchComponentHOC = Component => {
  return class extends React.Component {
    _renderComponent = () => {
      const cachedComponentExists = window.localStorage.getItem('__test__')

      if (cachedComponentExists) {
        console.log('Cached component exists')
        // Render cached component

        return getCachedComponent()
      } else {
        console.log('Cached component doesn\'t exist')
        // Render component as string
        // Cache against given URL
        // Mount the rendered string
        // If unable to mount string as
        cacheComponent(Component)

        // return (
        //   <Component {...this.props} />
        // )
      }
    }

    render () {
      return this._renderComponent()
    }
  }
}

const FetchComponentServerHOC = Component => {
  return class extends React.Component<*, *> { }
}

export default typeof window === 'undefined'
  ? FetchComponentServerHOC
  : FetchComponentHOC
