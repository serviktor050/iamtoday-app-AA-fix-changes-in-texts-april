import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import YoutubeModal from './YoutubeModal'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { taskDone } from '../../actions'
import CSSModules from 'react-css-modules'
import styles from './taskItem.css'
import Scroll from 'react-scroll'
import { browserHistory, Link } from 'react-router'

class TaskItem extends Component {
  constructor(props) {
    super()

    this.state = {
      isDone: props.task.isDone
    }
  }

  save(index) {
    if (this.state.isDone) {
      const element = document.getElementById(`task-${index + 1}`);
      const sendReport = document.getElementById('send-report');
      const taskTop = element
        ? element.offsetTop + document.getElementById('exercises').offsetTop
        : sendReport ? sendReport.offsetTop: null

      if (taskTop) {
				Scroll.animateScroll.scrollTo(taskTop - 100)
      }
    }

    this.reqIsDone()
  }

  changeHandler(index) {
    this.setState({ isDone: !this.state.isDone }, () => this.save(index))
  }

  reqIsDone() {
    const {token, task} = this.props
    const payload = {
      authToken: token ? token : cookie.load('token'),
      data: {
        task: task.id,
        isDone: this.state.isDone
      }
    }

    this.props.taskDone(payload)
  }

  render() {
    const { task, index, activeItems, deleteItem, addItem } = this.props
    const checked = this.state.isDone ? 'checked' : ''
    const active = this.state.isDone ? 'task__item--complete' : ''
    const mobile = window.mobileAndTabletcheck()

    const checkIsActive = item => (activeItems.indexOf(item) !== -1)
    const activeItem = (item) => {
      if (checkIsActive(item)) {
        deleteItem(item)
      } else {
        addItem(item)
      }
    }

    return (
        <div>
          <p className={styles.basePrag}>{task.description}</p>
          {/* <div className={styles.taskHeader}>
            <div className={styles.taskTitle}>
                    <span className={!this.state.isDone ? styles.taskNumber : styles.taskNumberActive}>
                      <span>{index + 1}</span>
                    </span>
              <span className={styles.taskName}>{task.name}</span>
            </div>

            <div id={`btn${index}`} className={!this.state.isDone ? styles.btnTasks : styles.btnTasksActive}>
                    <span className={styles.checkbox}>
                      <label className={styles.checkboxLabel} htmlFor={`task[${index}]`}>
                        <span className={styles.checkboxTitle}>{task.gender === 'male' ? 'Выполнил' : 'Выполнила'}</span>
                        <input className={styles.checkboxFieldBtnTasks}
                               id={`task[${index}]`}
                               checked={checked}
                               onChange={this.changeHandler.bind(this)}
                                type="checkbox"/>
                        <span className={styles.checkboxPh}>
                          <svg className={styles.svgIcoTick}>
                            <use xlinkHref="#ico-tick"></use>
                          </svg>
                        </span>
                      </label>
                    </span>
            </div>
          </div> */}
          <ul className={styles.taskMb30}>
            {task.exercises.map((exercise, ind) => {
              let exerciseType = styles.svgIcoTaskPlay
              let exerciseTypeString = '#ico-task-play'
              switch (exercise.exerciseType) {
                case 0:
                  break
                case 1:
                  exerciseType = styles.svgIcoTaskDescription
                  exerciseTypeString = '#ico-task-description'
                  break
                case 2:
                  exerciseType = styles.svgIcoTaskPhoto
                  exerciseTypeString = '#ico-task-photo'
                  break
                default:
                  break
              }
              return (<li
                  key={ind}
                  className={checkIsActive(ind) ? styles.taskItemActive : styles.taskItem}
                >
                  <YoutubeModal
                    exercise={exercise}
                    ind={ind}
                    isActive={checkIsActive(ind)}
                    activeItem={() => activeItem(ind)}
                  />
                </li>)
            })}
          </ul>
          <div
            className={!this.state.isDone ? styles.btnTask : styles.btnTaskDone}
            onClick={() => this.changeHandler(index)}
          >
            <span className={styles.btnTaskTitle}>Готово</span>
            <div className={styles.btnTaskIco}>
              <svg className={styles.svgIconTaskProgress}>
                <use xlinkHref="#ico-task-progress"></use>
              </svg>
              <svg className={styles.svgIconTaskDone}>
                <use xlinkHref="#ico-task-done"></use>
              </svg>
            </div>
          </div>
          {/* <div className={styles.taskDescription}>
            <h3 className={styles.h3}>Как правильно выполнять</h3>
            <p className={styles.subTitleLine}>Как правильно выполнять показано на видео. Правильная техника важна - следи за собой :)</p>
            <p className={styles.basePragTextCenter}>{task.description}</p>
            <ul className={styles.numList}>
              {task.exercises.map((exercise, ind) => (
                  <li key={ind} className={styles.numListItem}>
                    <span className={styles.numListNumber}>{ind + 1}</span>
                    <YoutubeModal exercise={exercise}
                                  ind={ind}>{exercise.description}
                    </YoutubeModal>
                  </li>
              ))}
            </ul>
          </div> */}

        </div>
    )
  }
}

const mapStateToProps = state => {
  const { activeItems } = state

  return {
    activeItems
  }
}

const mapDispatchToProps = dispatch => ({
  addItem: bindActionCreators(
    item => dispatch({ type: 'ADD_EXERCISE_ITEM', item }),
    dispatch
  ),
  deleteItem: bindActionCreators(
    item => dispatch({ type: 'DELETE_EXERCISE_ITEM', item }),
    dispatch
  ),
})

TaskItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskItem)

export default CSSModules(connect(null, {taskDone})(TaskItem), styles)
