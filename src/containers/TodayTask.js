import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { api, domen } from '../config.js'
import {
  selectTaskDay,
  invalidateTaskDay,
  fetchTaskDayIfNeeded
} from '../actions'

import MainComponent from '../components/todayTask/MainComponent'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './todayTask.css'
/**
 *  Контейнер TodayTask.
 *  Используется для отображения страницы 'Задания' (/task)
 *
 */
class TodayTask extends Component {
  /**
   * @memberof TodayTask
   * @prop {Object} propTypes - the props that are passed to this component
   * @prop {Object} propTypes.taskDay Данные для ренденринга страницы 'Задания'
   * @prop {func} propTypes.selectTaskDay Функция для выбора дня
   * @prop {func} propTypes.fetchTaskDayIfNeeded Функция для получения данных с сервера для рендеринга страницы 'Задания'.
   *
   * */
  static propTypes = {
    taskDay: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    /**
     * Функция для выбора дня
     * @memberof TodayTask
     * @param {number} day - Номер дня.
     */
    selectTaskDay: PropTypes.func.isRequired,
    invalidateTaskDay: PropTypes.func.isRequired,
    /**
     * Функция для получения данных с сервера для рендеринга страницы 'Задания'.
     * @memberof TodayTask
     * @param {number} day - Номер дня.
     */
    fetchTaskDayIfNeeded: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchTaskDayIfNeeded, selectedTaskDay, recivedTaskDay, dispatch } = this.props
    dispatch({type: 'SET_MENU_LIST', page: 'tasks'})

    if (this.props.params.id) {
      dispatch({type: 'SELECT_DAY_ID', id: this.props.params.id})
    }
    fetchTaskDayIfNeeded(selectedTaskDay)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTaskDay !== this.props.selectedTaskDay) {
      const { fetchTaskDayIfNeeded, selectedTaskDay } = nextProps
      fetchTaskDayIfNeeded(selectedTaskDay)
    }
  }

 /* handleChange = nextTaskDay => {
    const { selectTaskDay } = this.props
    selectTaskDay(nextTaskDay)
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { invalidateTaskDay, fetchTaskDayIfNeeded, selectedTaskDay } = this.props
    invalidateTaskDay(selectedTaskDay)
    fetchTaskDayIfNeeded(selectedTaskDay)
  }*/

  render() {
    const { taskDay, token, isFetching, sign, location } = this.props
    const isEmpty = !taskDay || !taskDay.data || taskDay.data.length === 0
    return (
      <div className={isEmpty ? styles.entryInner : styles.layout}>
        {isEmpty
          ? (isFetching ? <LoadingView isAlfa={domen.isAlfa} title="Загружается..."/> : <LoadingView isAlfa={sign.host === 'alfa'} title="Если вы видите это окно, значит возникла ошибка! Напишите нам на почту av@todayme.ru и опишите сложившуюся ситуацию."/>)
          : <div>
              <MainComponent
                params = {this.props.params}
                token={token}
                taskDay={taskDay.data[0]}
                location={location}
              />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedTaskDay, recivedTaskDay, userToken, sign } = state

  const {
    isFetching,
    lastUpdated,
    taskDay
  } = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {}
  }

  return {
    selectedTaskDay,
    sign,
    isFetching,
    lastUpdated,
    taskDay,
    token: userToken.token
  }
}

const mapDispatchToProps = dispatch => ({
  selectTaskDay: bindActionCreators(selectTaskDay, dispatch),
  invalidateTaskDay: bindActionCreators(invalidateTaskDay, dispatch),
  fetchTaskDayIfNeeded: bindActionCreators(fetchTaskDayIfNeeded, dispatch),
  dispatch
})

TodayTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodayTask)

export default CSSModules(TodayTask, styles)
