// @flow
import V, { render } from '../../src/packages/virtual-dom'

/*
  TODO
  Arbitrary/custom components
 */
const ArbitraryComponent = ({ children }) => (
  <div className='arbitrary-component'>{children}</div>
)

const Vtree = (
  <ul className='v-list' arbitraryProp={(() => 'I should exist!')()}>
    <li className='v-list-item'>Item 1</li>
    <li className='v-list-item'>Item 2</li>
    <li className='v-list-item'>Item 3</li>
  </ul>
)

render(Vtree, document.getElementById('root'))
