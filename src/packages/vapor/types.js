// @flow
export type GetComponent = {
  component: string,
  components: Object
}

export type Vapor = {
  component: string,
  props?: Object
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
  initialState?: Object,
  initialRender: string,
  initialStyles: string
}

export type GetInitialRender = {
  components: Object,
  component: string,
  store?: Object
}
