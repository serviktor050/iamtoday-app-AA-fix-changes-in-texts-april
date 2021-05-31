import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../actions'
import Layout from '../components/componentKit2/Layout'
import Loader from '../components/componentKit/Loader'

import MainComponent from '../components/food/MainComponent'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './food.css'

// import fetchTaskDayIfNeeded from '../actions/taskDay'

/**
 *  Контейнер Food.
 *  Используется для отображения страницы Питание (/food)
 *
 */
class Food extends Component {
  /**
   * @memberof Food
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {string} propTypes.selectedFood Выбор питания
   * @prop {food} propTypes.food Объект данных для рендеринга страницы питание
   * @prop {taskDay} propTypes.taskDay Объект данных для рендеринга страницы дня
   *
   * */
  static propTypes = {
    selectedFood: PropTypes.string.isRequired,
    food: PropTypes.object.isRequired,
    taskDay: PropTypes.object.isRequired
  }
  componentDidMount() {
    const { dispatch, selectedFood } = this.props
    //dispatch({ type: 'SET_MENU_LIST', page: 'food' })
    dispatch(actions.fetchFoodProgramIfNeeded(selectedFood))
    dispatch(actions.fetchTaskDayIfNeeded(selectedFood))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFood !== this.props.selectedFood) {
      const { dispatch, selectedFood } = nextProps
      dispatch(actions.fetchFoodProgramIfNeeded(selectedFood))
    }
  }

  handleChange = nextFood => {
    this.props.dispatch(actions.selectFood(nextFood))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, selectedFood } = this.props
    dispatch(actions.invalidateFood(selectedFood))
    dispatch(actions.fetchFoodProgramIfNeeded(selectedFood))
  }

  render() {
    const { food, token, isFetching, taskDay, userInfo, foodData, location } = this.props

    const isEmpty = (!food || !food[0]) && (!taskDay || !taskDay.data || taskDay.data.length === 0)
    const isLoader = foodData.load && !foodData.isFetch

    return (
        <Layout location={location} page={'food'} prevSeasons={userInfo.data.prevSeasons}>
            {foodData.load && !foodData.isFetch ?
                <MainComponent token={token} food={foodData.data} taskDay={taskDay.data[0]} /> :
                <Loader />
            }
        </Layout>


    )
  }
}

const mapStateToProps = state => {
  const { selectedFood, selectedTaskDay, userInfo, recivedTaskDay, recivedFood, userToken, foodData } = state

  const {
    isFetching,
    lastUpdated,
    food
  } = recivedFood[selectedFood] || {
    isFetching: true,
    food: {}
  }
  const {taskDay} = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {}
  }

  return {
    selectedFood,
    foodData,
    userInfo,
    isFetching,
    lastUpdated,
    food,
    taskDay,
    recivedTaskDay,
    token: userToken.token
  }
}

Food = connect(
  mapStateToProps
)(Food)

export default CSSModules(Food, styles)
