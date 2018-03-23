####`Work in progress! `

# Vapor-js
A server-side renderer for segmented React applications with built-in Redux support.

### Installation
```
yarn add vapor-js
```

### Using Vapor
Vapor allows you to easily break a large React application into smaller, more manageable apps, which can have a big effect on performance.

### API
#### `createVapor`
Accepts a config object and returns an object with two methods, `build` and `exists`.

Usage:
```
import createVapor from 'vapor-js'

const vapor = createVapor(options)
```

Returns:
```
{
    build: Function,
    exists: Function
}
```

##### Options
Options should be an object of the following shape (details below):

```
{
    components: Object,
    componentReducer?: Function,
    store?: Object,
    template?: string
}
```

###### `components`
An object lookup table for your components. Each property should be either a valid React component or a object of the following shape:

```
{
    component: Function,
    store?: Object,
    template?: string
}
```

###### Example:
```
const components = {
    Landing: require('../Landing'),
    Feed: {
        store: feedStore,
        template: feedTemplate,
        component: require('../Feed')
    }
}
```

###### `componentReducer`
A function that accepts a single object parameter with `component`, `store`, and `props` properties. The function should check the value of `component` to determine which state to prepare for your app's initial render.

The easiest way to prepare your state is to dispatch actions with values from `props` (`props` should be generated on the server before calling `vapor.build`).

The API is shown below, actual implementation is up to you:

```
({ component, store, props }) => state
```

###### Example
The easiest way is to use a `switch/case` statement:

```
function componentReducer ({ component, store, props }) {
    switch (component) {
        case 'Feed':
            store.dispatch(fetchFeedSuccess({ feed: props.feed }))
            return store.getState()
    }
}
```

Using a lookup table can reduce boilerplate:

```
const Feed = ({ store: { dispatch, getState }, props }) => {
    dispatch(fetchFeedSuccess({ feed: props.feed }))
    return getState()
}
const componentReducer = ({ component, store, props }) => ({ Feed })[component]({ store, props })
```

###### `store`
A global Redux store, useful for when multiple components need to share state. If a component has a `store` property the global store is ignored.

###### `template`
A global HTML template for rendering your applications into. If a component has a `template` property the global template is ignored.

### Basic Server Example:
```
import express from 'express'
import vapor from './vaporSetup'

const app = express()
const port = 8080

app.use(express.static('path/to/assets'))

app.get('/', async (req, res) => {
  const component = 'Landing'
  
  if (!vapor.exists({ component })) {
    res.status(404)
    res.send('Oopsie...')
    return
  }
  
  const props = await request(options)
  const initialRender = vapor.build({ component, props })
  
  res.send(initialRender)
})

app.listen(port, () => { console.log(`Server listening on ${port}`) })
```