// @flow
// todo
// 1. Write Vapor class to extend for components
// 2. Write render function
//
// Need vapor_fetch to handle fetching props: fetch(props), props = {}
// Need vapor_render to render components: render(<Component />)
import React, { type Element, Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

// Extend Vapor
// Vapor provides own render method
// When Vapor.render is called it passes

function _vaporFetch (options) {
  // Caches each URL fetched
  // If URL not present, cache the rendered component in a map against the URL string
}

class Vapor extends Component<*> {
  _inspectCache: Function = (): void => {
    // Check given URL for component
  }

  render (): Element<*> {
    if (typeof this.display !== 'function') {
      throw new Error('Vapor: No display method was found.')
    }

    return this.display()
  }
}

class App extends Vapor<*> {
  vapor: Function = (): Object => ({
    component: 'App',
    props: {}
  })

  componentDidMount (): void {
    console.log('mounted')
  }

  display () {
    return (
      <div style={styles}>
        <Hello name="CodeSandbox" />
        <h2>Start editing to see some magic happen {'\u2728'}</h2>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'));
