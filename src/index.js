import React from 'react'
import express from 'express'

const app = express()
const port = 1337
const vaporChildrenId = '{V{children}V}'

// Make a Vapor HOC that intercepts children somehow?
// HOC could intercept children and replace with vaporChildrenId??

// Basic idea of what Vapor class might look like
class Vapor {
  constructor (props = {}, staticProps = {}) {
    if (typeof props !== 'object') {
      throw new Error(`Vapor: Props should be a plain object, instead found ${typeof props}`)
    }

    this.props = { ...props, ...staticProps }
  }

  static vaporFetch () {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ title: 'Welcome to Vapor!', content: 'Lorem ipsum...' })
      }, 500)
    })
  }

  hasChildren () {
    return this.render().includes(vaporChildrenId)
  }
}

class Example extends Vapor {
  render = () => (`
    <div class="example">
      <h1>${this.props.title}</h1>
      <p>${this.props.content}</p>
      ${vaporChildrenId}
    </div>
  `)
}

class ChildExample extends Vapor {
  render = () => (`
    <div class="child-example">
      <h3>${this.props.title}</h3>
      <p>${this.props.content}</p>
      ${vaporChildrenId}
    </div>
  `)
}

class ChildExample2 extends Vapor {
  render = () => (`
    <div class="child-example-2">
      <h3>${this.props.title}</h3>
      <img class="vapor-img" src="${this.props.img}" alt="Vapor">
    </div>
  `)
}

const VaporTree = {
  component: Example,
  props: {
    title: 'Example Title',
    content: 'Lorem ipsum...',
    children: [{
      component: ChildExample,
      props: {
        title: 'Child Example',
        content: 'Some more content...',
        children: [{
          component: ChildExample2,
          props: {
            title: 'About Vapor',
            img: 'http://shopvape.net/wp-content/uploads/2017/06/H%C3%9AT-VAPE-B%E1%BB%8A-S%E1%BA%B6C-V%C3%80-C%C3%81CH-KH%E1%BA%AEC-PH%E1%BB%A4C.jpg'
          }
        }]
      }
    }, {
      component: ChildExample,
      props: {
        title: 'Child Example',
        content: 'Some more content...'
      }
    }]
  }
}

// The below should happen inside an HOC in the client (React components anyway)
// VaporReact should have it's own equivalent function like this for SSR
async function renderVapor ({ component, props: { children = [], ...staticProps } = {} }) {
  const props = await component.vaporFetch()
  const Component = new component(props, staticProps)
  const renderedComponent = Component.render()
  const renderedChildren = await Promise.all(children.map(renderVapor))
  return renderedComponent.replace(vaporChildrenId, renderedChildren.join('\n'))
}

// Temporary...
const generateMarkup = ({ vapor = '', styles = '' }) => (`
  <html>
    <head>
      <title>Vapor</title>
      <style>${styles}</style>
    </head>
    <body>
      ${vapor}
    </body>
  </html>
`)

const styles = (`
  .vapor-img {
    height: 125px;
    width: 125px;
  }
`)

// Just to render something in a browser...
app.get('*', async (req, res) => {
  try {
    const vapor = await renderVapor(VaporTree)
    const html = generateMarkup({ vapor, styles })

    res.status(200)
    res.send(html)
  } catch (err) {
    res.status(500)
    res.send(err)
  }
})

app.listen(port)
