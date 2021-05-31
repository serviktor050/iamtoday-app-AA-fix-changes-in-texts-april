import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './tabs.css'

class TabsItem extends Component {
  render() {
    const { active, tabName } = this.props
    const isActiveClass = active === tabName ? 'tabs__nav-item--active' : 'tabs__nav-item'
    return (
      <li onClick={this.props.onClickTabs.bind(this, this.props.tabName)} className={isActiveClass}>
        <span className='tabs__tab-title'>{this.props.children}</span>
      </li>

    )
  }
}

export default CSSModules(TabsItem, styles)
