// @flow
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import type { Element } from 'react'
import type {
  InitialState,
  GetTemplate,
  GetInitialState,
  GetComponent,
  CreateVapor,
  Vapor,
  Build,
  Exists,
  BuildHTML,
  GetInitialRender,
  Assertion,
  ComponentConfig
} from './types'

/**
 * Assert expression is true
 * @param expression
 * @param message
 */
export function assert ({ expression, message }: Assertion): boolean {
  if (!expression && process.env.NODE_ENV === 'development') {
    throw new Error(message)
  }

  return true
}

/**
 * Get a component from the set of given components
 * @param component
 * @param components
 * @returns {*}
 */
export function getComponent ({ component, components }: GetComponent): Function {
  const App: ComponentConfig = components[component]

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
 * Get the initial state for a component, fall back to global store if none found in config
 * @param componentReducer
 * @param components
 * @param component
 * @param props
 * @param store
 * @returns {*}
 */
export function getInitialState ({ componentReducer, components, component, props, globalStore }: GetInitialState): InitialState {
  const thisComponent: ComponentConfig = components[component]

  if (thisComponent && thisComponent.store) {
    return {
      store: thisComponent.store,
      initialState: componentReducer({ component, store: thisComponent.store, props })
    }
  }

  if (globalStore) {
    return {
      store: globalStore,
      initialState: componentReducer({ component, store: globalStore, props })
    }
  }

  return {}
}

/**
 * Get the app's initial render
 * @param components
 * @param component
 * @param store
 * @param rootProps
 * @returns {*}
 */
export function getInitialRender ({ components, component, store, rootProps = {} }: GetInitialRender): string {
  const App: Function = getComponent({ components, component })
  const Root: Element<*> = createElement(App, rootProps, null)

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
export function getInitialStyles ({ components, component }: GetComponent): string {
  const thisComponent: ComponentConfig = components[component]

  if (thisComponent && thisComponent.style) {
    return thisComponent.style
  }

  return ''
}

/**
 * Get a component's template
 * @param components
 * @param component
 * @param template
 * @returns {*}
 */
export function getTemplate ({ components, component, template }: GetTemplate): string {
  const thisComponent: ComponentConfig = components[component]

  if (thisComponent && thisComponent.template) {
    return thisComponent.template
  }

  return template
}

/**
 * Fetch initial HTML and append state and initial render
 * @param template
 * @param components
 * @param component
 * @param initialState
 * @param initialRender
 * @param initialStyles
 * @returns {Promise.<XML|string>}
 */
export function buildHTML ({ template, components, component, initialState = {}, initialRender, initialStyles }: BuildHTML): string {
  const componentTemplate: string = getTemplate({ components, component, template })

  return componentTemplate
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
 * @returns {Function}
 */
export default function createVapor ({ template, components, store: globalStore, componentReducer }: CreateVapor): Vapor {
  assert({
    expression: typeof components === 'object',
    message: 'createVapor expects param \'components\' to be an object'
  })

  if (template) {
    assert({
      expression: typeof template === 'string',
      message: 'createVapor expects param \'template\' to be a string'
    })
  }

  if (componentReducer) {
    assert({
      expression: typeof componentReducer === 'function',
      message: 'createVapor expects param \'componentReducer\' to be a function'
    })
  }

  if (globalStore) {
    assert({
      expression: typeof globalStore === 'object',
      message: 'createVapor expects param \'store\' to be an object'
    })
  }

  return {
    /*
      TODO
      - Rename props and rootProps, too confusing
        - props and storeProps? rootProps and storeProps?
        - props, split by a 'pick' option?
     */
    build ({ component, props, rootProps }: Build): string {
      const { initialState, store }: InitialState = getInitialState({ componentReducer, components, component, globalStore, props })
      const initialRender: string = getInitialRender({ components, component, store, props, rootProps })
      const initialStyles: string = getInitialStyles({ components, component })

      return buildHTML({ template, components, component, initialState, initialRender, initialStyles })
    },

    exists ({ component }: Exists): boolean {
      return !!components[component]
    }
  }
}
