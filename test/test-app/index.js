// @flow
import V from '../../src/packages/virtual-dom/index'

const ArbitraryComponent = ({ children }) => (
  <div className='arbitrary-component'>{children}</div>
)

const v_tree = (
  <ArbitraryComponent>
    <ul className='v-list' arbitraryProp={(() => 'I should exist!')()}>
      <li className='v-list-item'>Item 1</li>
      <li className='v-list-item'>Item 2</li>
      <li className='v-list-item'>Item 3</li>
    </ul>
  </ArbitraryComponent>
)

console.log(v_tree.children[0])
