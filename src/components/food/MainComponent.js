import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CSSModules from 'react-css-modules'
import TaskIntro from '../todayTask/TaskIntro'
import styles from './mainComponent.css'

class MainComponent extends Component {


  render() {
    const { food, sign } = this.props
    const introJSON = food && food.content ? JSON.parse(food.content) : null
    return (
    <div>
      <TaskIntro sign={sign} json={introJSON} />
    </div>
    )
  }
}

const mapStateToProps = state => {
  const { showMobileLeftMenu, foodTab, sign } = state

  return {
    showMobileLeftMenu,
    sign,
    foodTab
  }
}

const mapDispatchToProps = dispatch => ({
  showLeftMenu: bindActionCreators(
    () => dispatch({ type: 'SHOW_LEFT_MENU', show: true }),
    dispatch
  ),
  hideLeftMenu: bindActionCreators(
    () => dispatch({ type: 'SHOW_LEFT_MENU', show: false }),
    dispatch
  ),
  chooseTab: bindActionCreators(
    tab => dispatch({ type: 'CHANGE_FOOD_TAB', tab }),
    dispatch
  ),
})

MainComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainComponent)

export default CSSModules(MainComponent, styles)
