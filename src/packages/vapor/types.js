// @flow
export type Vapor = {
  component: string,
  props?: Object
}

export type CreateVapor = {
  path: string,
  store?: Object,
  componentReducer: Function
}

export type GetHTML = {
  path: string,
  component: string,
  initialState?: Object,
  initialRender: string
}

export type GetInitialRender = {
  path: string,
  component: string,
  store?: Object
}
