import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './conditionItem.css'

class ConditionItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: ''
    }
  }

  handleClick(filter) {
    this.setState({
      selected: filter
    })
    this.props.onChangeCondition(filter)
  }

  render() {
    const { item, input } = this.props

    // switch(item.filter) {
    // case 'good':
    //   if (this.props.selected === item.filter) {
    //
    //   } else {
    //
    //   }
    //   break
    // case 'middle':
    //   break
    // case 'bad':
    //   break
    // default:
    //   break
    // }

    // {'your-condition__item ' + (this.props.selected === item.filter ? 'your-condition__item--active' : '')}

    return (
      <li
        onClick={this.handleClick.bind(this, item.filter)}
        className={this.props.selected === item.filter ? styles.yourConditionItemActive : styles.yourConditionItem }
      >
        {/* <input {...input} type='radio' className={styles.conditionInput}/>
        <span className={styles.yourConditionIco}>
          <svg className={'svg-icon ' + item.class}>
            <use xlinkHref={'#' + item.class}></use>
          </svg>
        </span>
        <p className={styles.yourConditionTitle}>{item.title}</p> */}
        <input {...input} type='radio' className={styles.conditionInput}/>
        <span className={item.class}></span>
        <p className="your-condition__title">{item.title}</p>
      </li>
    )
  }
}

export default CSSModules(ConditionItem, styles)
