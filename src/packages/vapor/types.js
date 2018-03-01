// @flow
export type Vapor = {
  component: string,
  props?: Object
}

export type CreateVapor = {
  template: string,
  components: Object,
  store?: Object,
  componentReducer: Function
}

export type BuildHTML = {
  template: string,
  initialState?: Object,
  initialRender: string
}

export type GetInitialRender = {
  components: Object,
  component: string,
  store?: Object
}
