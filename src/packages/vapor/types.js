// @flow
import type { Element } from 'react'

export type Vapor = {
  build: Function,
  exists: Function
}

export type ComponentWithStyle = {
  component: Element<*>,
  style?: string
}

export type ComponentMap = {
  component: string,
  components: Object
}

export type Build = {
  component: string,
  props?: Object
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
  component: string,
  initialState?: Object,
  initialRender: string,
  initialStyles: string
}

export type GetInitialRender = {
  components: Object,
  component: string,
  store?: Object
}
