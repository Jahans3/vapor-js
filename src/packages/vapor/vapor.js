// @flow
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import type { Element } from 'react'
import type { GetComponent, CreateVapor, Vapor, BuildHTML, GetInitialRender } from './types'

/**
 * Get a component from the set of given components
 * @param component
 * @param components
 * @returns {*}
 */
function getComponent ({ component, components }: GetComponent): Function {
  const App = components[component]

  assert({
    expression: !!App,
    message: (`
      No Component named '${component}' found.
      Ensure that you have configured Vapor correctly with all of your Components.
    `)
  })

  return App
}

/**
 * Get the app's initial render
 * @param components
 * @param component
 * @param store
 * @returns {*}
 */
export function getInitialRender ({ components, component, store }: GetInitialRender): string {
  const App: Function = getComponent({ components, component })
  const Root: Element<*> = createElement(App, {}, null)

  if (store) {
    return renderToString(createElement(Provider, { store }, Root))
  } else {
    return renderToString(Root)
  }
}

/**
 * Fetch initial HTML and append state and initial render
 * @param template
 * @param initialState
 * @param initialRender
 * @param initialStyles
 * @returns {Promise.<XML|string>}
 */
export function buildHTML ({ template, initialState = {}, initialRender, initialStyles }: BuildHTML): string {
  return template
    .replace('{{{style}}}', initialStyles)
    .replace('{{{app}}}', initialRender)
    .replace('{{{state}}}', JSON.stringify(initialState))
}

/**
 * Initialise Vapor
 * @param template
 * @param components
 * @param store
 * @param componentReducer
 * @param styles
 * @returns {Function}
 */
export default function createVapor ({ template, components, store, componentReducer, styles }: CreateVapor): Function {
  assert({
    expression: typeof template === 'string',
    message: 'Vapor expects param \'template\' to be a string'
  })

  assert({
    expression: typeof components === 'object',
    message: 'Vapor expects param \'components\' to be an object'
  })

  assert({
    expression: typeof componentReducer === 'function',
    message: 'Vapor expects param \'componentReducer\' to be a function'
  })

  if (store) {
    assert({
      expression: typeof store === 'object',
      message: 'Vapor expects param \'store\' to be an Object'
    })
  }

  return function vapor ({ component, props }: Vapor): string {
    const initialState: Object = store ? componentReducer({ component, props, store }) : {}
    const initialRender: string = getInitialRender({ components, component, store })

    return buildHTML({ template, initialState, initialRender, initialStyles: styles })
  }
}

/**
 * Assert expression is true
 * @param expression
 * @param message
 */
function assert ({ expression, message }) {
  if (!expression) throw new Error(message)

  return true
}
