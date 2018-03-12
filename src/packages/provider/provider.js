// @flow
import { Children, Component } from 'react'
import PropTypes from 'prop-types'
import type { Props } from './types'

const key = '__IYA_VERSION__'

export function createVersionProvider (contextKey: string = key) {
  return class VersionProvider extends Component<Props> {
    static childContextTypes = {
      [contextKey]: PropTypes.string.isRequired
    }

    getChildContext = () => ({
      __IYA_VERSION__: this.props.version
    })

    render () {
      return Children.only(this.props.children)
    }
  }
}

export default createVersionProvider()
