####`Work in progress! `

# Vapor-js
A server-side renderer for segmented React applications with built-in Redux support.

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
const componentReducer = ({ component, store, props }) => ({ Feed })[component]({ store, props })
```

###### `store`
A global Redux store, useful for when multiple components need to share state. If a component has a `store` property the global store is ignored.

###### `template`
A global HTML template for rendering your applications into. If a component has a `template` property the global template is ignored.

### Basic Setup
###### 1. Break application into smaller chunks
First, create separate bundles for each of the sub-apps you wish to pre-render and export each root component.

###### 2. Create a `componentReducer`
Your component reducer should just be a function that accepts `store`, `component`, and `props` parameters and uses them to prepare your store for each of your Vapor components. To prepare the store, simply dispatch actions until your store is in the desired state, then return the store.

The simplest way to do this, as with Redux, is with a `switch/case` statement. In the below example each reducer has been exported into their own function, however this is not necessary.

`componentReducer/index.js`:
```
import { City, Onboarding, Feed } from './reducers'

export default function componentReducer ({ store, component, props }) {
  switch (component) {
    case 'City':
      return City({ store, props })
    case 'Onboarding':
      return Onboarding({ store, props })
    case 'Feed':
      return Feed({ store, props })
  }
}
```
Or you could use an object lookup table to reduce boilerplate:
```
import { City, Onboarding, Feed } from './reducers'

export default ({ store, component, props }) => ({ City, Onboarding, Feed })[component]({ store, props })
```
`componentReducer/reducers.js`:
```
export function City ({ store, props }) {
  const { annotation_uri: [ annotationUri ], city, feed } = props

  store.dispatch(fetchAnnotationUriSuccess({ annotationUri }))
  store.dispatch(fetchFeedSuccess({ feed }))
  store.dispatch(fetchCitySuccess({ city }))

  return store.getState()
}

export function Onboarding ({ store, props }) {
  // ...
}

export function Feed ({ store, props }) {
  // ...
}
```

###### 3. Initialise Vapor
Import your apps (`Components`) and pass them into `createVapor`. If you are using Redux, pass in your store too.

Import your HTML template, this is what your React applications and Redux store will be injected into. Here we are `require`ing an HTML string from a `.js` file, but this can be done any way you like (e.g. `fs.readFile`).

Import your `componentReducer`, as defined in step 2.

Create a `components` object, each property of which should be one of your Vapor components (a self-contained React tree).

`vaporSetup.js`:
```
import createVapor from 'vapor-js'
import store from '../store'
import template from '../template'
import componentReducer from '../componentReducer'

const components = {
  City: require('../Components/City'),
  Onboarding: require('../Components/Onboarding'),
  Feed: require('../Components/Feed)
}

export default createVapor({ template, store, components, componentReducer })
```

###### 4. Render your app
When you call `createVapor` an object with two methods is returned, `exists` and `build`.

`exists` accepts a component name and checks to see if it exists, you can use this to determine when to `404`, amongst other things. Returns `true` if the component exists, `false` otherwise.

`build` accepts a component name and props, the props will be passed to your component reducer to prepare your stores.

When you call `build` the return value will be a fully server-rendered React application, which you can send directly to your client (don't forget to also serve your client-side bundle, which should call `react-dom/server`'s `hydrate` method).

`server.js`:
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

### With Redux
* If you use Redux, simply pass in your store
    * TODO - handle multiple stores for each component
* Pass in a function (componentReducer) that will generate required initial state for your app
    * This should just be a function that dispatches actions

Your `componentReducer` should take a single parameter, an object with the following properties:
* `store` - an instance of your store from Redux's `createStore`
* `component` - this is the Vapor component representing a portion of your app
* `props` - props to be used to generate your initial Redux state

The `componentReducer` should simply check for different components and build a state accordingly, the easiest way to do this is using a `switch/case` statement:

```
const componentReducer = ({ store, component, props = {} }) => {
  switch (component) {
    case 'Onboarding':
      const { city } = props

      store.dispatch(fetchCitySuccess({ city }))

      return store.getState()
  }
}
```

API docs - TODO

### Installation
Install `vapor-js`:
```
yarn add vapor-js
```