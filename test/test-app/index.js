// @flow
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
    <li className='list-item'>Item 1</li>
    <li className='list-item'>Item 2</li>
    <li className='list-item'>Item 3</li>
    <li className='list-item'>Item 4</li>
  </ul>
)

console.log(Vtree)

render(Vtree, document.getElementById('root'))
