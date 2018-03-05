// @flow
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import type { Element } from 'react'
import type { ComponentMap, CreateVapor, Vapor, Build, Exists, BuildHTML, GetInitialRender, Assertion } from './types'

/**
 * Get a component from the set of given components
 * @param component
 * @param components
 * @returns {*}
 */
function getComponent ({ component, components }: ComponentMap): Function {
  const App: { component: Function } | Function = components[component]

  assert({
    expression: !!App,
    message: (`
      No Component named '${component}' found.
      Ensure that you have configured Vapor correctly with all of your Components.
    `)
  })

  if (App.component) {
    return App.component
  } else {
    return App
  }
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
 * Get the app's initial styles
 * @param components
 * @param component
 * @returns {string}
 */
export function getInitialStyles ({ components, component }: ComponentMap): string {
  const thisComponent = components[component]

  if (thisComponent && thisComponent.style) {
    return thisComponent.style
  }

  return ''
}

/**
 * Fetch initial HTML and append state and initial render
 * @param template
 * @param component
 * @param initialState
 * @param initialRender
 * @param initialStyles
 * @returns {Promise.<XML|string>}
 */
export function buildHTML ({ template, component, initialState = {}, initialRender, initialStyles }: BuildHTML): string {
  return template
    .replace('{{{component}}}', component)
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
export default function createVapor ({ template, components, store, componentReducer }: CreateVapor): Vapor {
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

  return {
    build ({ component, props }: Build): string {
      const initialState: Object = store ? componentReducer({ component, props, store }) : {}
      const initialRender: string = getInitialRender({ components, component, store })
      const initialStyles: string = getInitialStyles({ components, component })

      return buildHTML({ template, component, initialState, initialRender, initialStyles })
    },

    exists ({ component }: Exists): boolean {
      return !!components[component]
    }
  }
}

/**
 * Assert expression is true
 * @param expression
 * @param message
 */
function assert ({ expression, message }: Assertion): boolean | Error {
  if (!expression) throw new Error(message)

  return true
}
