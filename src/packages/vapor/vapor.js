// @flow
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import type { Element } from 'react'
import type { CreateVapor, Vapor, GetHTML, GetInitialRender } from './types'

/**
 * Get the app's initial render
 * @param components
 * @param component
 * @param store
 * @returns {*}
 */
export function getInitialRender ({ components, component, store }: GetInitialRender): string {
  // $FlowFixMe
  const App: Function = components[component]
  const Root: Element<*> = createElement(App, {}, null)

  console.log('Vape 2.5')

  return 'your mum'

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
 * @returns {Promise.<XML|string>}
 */
export function getHTML ({ template, initialState = {}, initialRender }: GetHTML): Promise<string> {
  return fs.readFile(template)
    .then(html => html
      .replace('{{{app}}}', initialRender)
      .replace('{{{state}}}', JSON.stringify(initialState)))
}

/**
 * Initialise Vapor
 * @param template
 * @param components
 * @param store
 * @param componentReducer
 * @returns {Function}
 */
export default function createVapor ({ template, components, store, componentReducer }: CreateVapor): Function {
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

  return function ({ component, props }: Vapor): Promise<string> {
    console.log('Vape 1')
    const initialState: Object = store ? componentReducer({ component, props, store }) : {}
    console.log('Vape 2')
    const initialRender: string = getInitialRender({ components, component, store })
    console.log('Vape 3')

    return getHTML({ template, initialState, initialRender })
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
