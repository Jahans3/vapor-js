import Vapor, { render, updateNode } from '../../src/packages/virtual-dom'

/*
  TODO
  ReactVapor
  Each Vapor component is a react app
  All apps subscribe to the same store
 */

/*
  TODO
  Arbitrary/custom components
 */
const ArbitraryComponent = ({ children }) => (
  <div className='arbitrary-component'>{children}</div>
)

const Vtree = (
  <ul className='v-list'>
    <li href='https://www.not-real.com' className='v-item'>Item 1</li>
    <li href='https://www.not-real.com' className='v-item'>Item 2</li>
    <li href='https://www.not-real.com' className='v-item'>Item 3</li>
    <li href='https://www.not-real.com' className='v-item'>Item 4</li>
  </ul>
)

const Vtree2 = (
  <ul className='v-list'>
    <img src='https://www.watertechonline.com/wp-content/uploads/2015/11/iStock_000004135118_800x533.jpg' />
    <span>Welcome to Vapor!</span>
  </ul>
)

const $root = document.getElementById('root')

render(Vtree, $root)

console.log(Vtree)

createAddButton()
createRemoveButton()
createSwapButton()

function createSwapButton () {
  let originalPosition = true

  document.getElementById('update-list-swap').addEventListener('click', function () {
    if (originalPosition) updateNode($root, Vtree2, Vtree)
    else updateNode($root, Vtree, Vtree2)

    originalPosition = !originalPosition
  })
}

function createRemoveButton () {
  document.getElementById('update-list-remove').addEventListener('click', function () {
    updateNode($root)
  })
}

function createAddButton () {
  let i = 0

  document.getElementById('update-list-add').addEventListener('click', function () {
    updateNode($root, <div>Div {++i}</div>)
  })
}
