import V, { render, updateNode } from '../../src/packages/virtual-dom'

/*
  TODO
  Arbitrary/custom components
 */
const ArbitraryComponent = ({ children }) => (
  <div className='arbitrary-component'>{children}</div>
)

const Vtree = (
  <ul className='v-list'>

  </ul>
)

const $root = document.getElementById('root')

render(Vtree, $root)

console.log(Vtree)

createAddButton()
createRemoveButton()

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
