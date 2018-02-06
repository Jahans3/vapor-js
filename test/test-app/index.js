// @flow
import V, { render } from '../../src/packages/virtual-dom'

const ArbitraryComponent = ({ children }) => (
  <div className='arbitrary-component'>{children}</div>
)

const Vtree = (
  <ul className='v-list'>
    <li className='v-list-item'>Item 1</li>
    <li className='v-list-item'>Item 2</li>
    <li className='v-list-item'>Item 3</li>
  </ul>
)

render(Vtree, document.getElementById('root'))
