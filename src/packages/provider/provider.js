// @flow
import { Children, Component, type Element } from 'react'
import PropTypes from 'prop-types'

type Props = {
  version: string,
  children: Component<*> | Element<*> | string
}

export function createVersionProvider (contextKey: string = '__IYA_VERSION__') {
  return class VersionProvider extends Component<Props> {
    static childContextTypes = {
      [contextKey]: PropTypes.string.isRequired
    }

    getChildContext () {
      return { [contextKey]: this.props.version }
    }

    render () {
      return Children.only(this.props.children)
    }
  }
}

export default createVersionProvider()
