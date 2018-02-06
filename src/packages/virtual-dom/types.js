// @flow

export type Props = string | Array<Object>
export type Node = string | number | {
  id: ?string,
  component: Component,
  props: ?Props,
  children: Array<Node>
}
export type Children = Array<Node>
export type Component = string | Function
