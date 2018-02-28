// @flow
import fs from 'fs-extra'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import type { Element } from 'react'
import type { CreateVapor, Vapor, GetHTML, GetInitialRender } from './types'

/**
 * Get the app's initial render
 * @param path
 * @param component
 * @param store
 * @returns {*}
 */
export function getInitialRender ({ path, component, store }: GetInitialRender): string {
  // $FlowFixMe
  const App: Function = require(path + component)
  const Root: Element<*> = createElement(App, {}, null)

  if (store) {
    return renderToString(Root)
  } else {
    return renderToString(createElement(Provider, { store }, Root))
  }
}

/**
 * Fetch initial HTML and append state and initial render
 * @param templatePath
 * @param initialState
 * @param initialRender
 * @returns {Promise.<XML|string>}
 */
export async function getHTML ({ templatePath, initialState = {}, initialRender }: GetHTML): Promise<string> {
  const html = await fs.readFile(templatePath)

  return html
    .replace('{{{app}}}', initialRender)
    .replace('{{{state}}}', JSON.stringify(initialState))
}

/**
 * Initialise Vapor
 * @param templatePath
 * @param path
 * @param store
 * @param componentReducer
 * @returns {Function}
 */
export default function createVapor ({ templatePath, path, store, componentReducer }: CreateVapor): Function {
  assert({
    expression: typeof templatePath === 'string',
    message: 'Vapor expects param \'templatePath\' to be a string'
  })

  assert({
    expression: typeof path === 'string',
    message: 'Vapor expects param \'path\' to be a string'
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
    const initialState: Object = store ? componentReducer({ component, props }) : {}
    const initialRender: string = getInitialRender({ path, component, store })

    return getHTML({ templatePath, initialState, initialRender })
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
