// @flow
export type Vapor = {
  build: Function,
  exists: Function
}

export type ComponentConfig = Function | {
  component: Function,
  template?: string,
  store?: Object,
  style?: string
}

export type GetInitialState = {
  components: Object,
  component: string,
  componentReducer: Function,
  props?: Object,
  globalStore?: Object
}

export type InitialState = {
  initialState?: Object,
  store?: Object
}

export type GetTemplate = {
  components: Object,
  component: string,
  template: string
}

export type GetComponent = {
  component: string,
  components: Object
}

export type Build = {
  component: string,
  props?: Object,
  rootProps?: Object
}

export type Exists = {
  component: string
}

export type CreateVapor = {
  template: string,
  components: Object,
  store?: Object,
  componentReducer: Function,
  styles: string
}

export type BuildHTML = {
  template: string,
  components: Object,
  component: string,
  initialState?: Object,
  initialRender: string,
  initialStyles: string
}

export type GetInitialRender = {
  components: Object,
  component: string,
  store?: Object,
  rootProps?: Object
}

export type Assertion = {
  expression: boolean,
  message: string
}
