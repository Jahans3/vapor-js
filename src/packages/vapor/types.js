// @flow
export type Vapor = {
  component: string,
  props?: Object
}

export type CreateVapor = {
  templatePath: string,
  path: string,
  store?: Object,
  componentReducer: Function
}

export type GetHTML = {
  templatePath: string,
  initialState?: Object,
  initialRender: string
}

export type GetInitialRender = {
  path: string,
  component: string,
  store?: Object
}
