// @flow

export type Props = Object
export type Component = string | Function
export type Node = {
  id: ?string,
  component: Component,
  props: ?Props,
  children: Array<Node>
}
export type Children = Array<Node>
