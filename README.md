# Vapor-js
A pre-built server-side renderer for React.

Work in progress!

### Using Vapor
Vapor allows you to effortlessly break a monolithic React application into smaller, more manageable applications. This can have great effects on performance, as your application can be broken down into smaller sub-apps called 'Components'.

Let's say your app has public-facing pages, where a user who is not registered can see a different, trimmed down version of your website. Not only does this part of the app not require the majority of your components, but it also does not require Redux. Using Vapor you can omit Redux from this portion of your app and serve a smaller bundle to the client.

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
      const { user: { name }, city } = props

      store.dispatch(fetchUserNameSuccess({ name }))
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