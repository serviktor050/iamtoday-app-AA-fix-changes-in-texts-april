import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions'
import Header from '../componentKit/Header'
import DayEditorValidationForm from './DayEditorValidationForm'
import LoadingView from '../componentKit/LoadingView'
import cookie from 'react-cookie'
import moment from 'moment'
import { api } from '../../config.js'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './dayEditor.css'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}
/**
 *  Компонент DayEditor.
 *  Используется для отображения страницы редактора в админке
 *
 */
class DayEditor extends Component {
  /**
   * @memberof DayEditor
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {string} propTypes.selectedDays Выбор дня
   * @prop {object} propTypes.days Объект данных для рендеринга календаря
   * @prop {bool} propTypes.isVideo Флаг есть ли поле видео
   * @prop {number} propTypes.dayId Номер дня
   *
   * */
  static propTypes = {
    selectedDays: PropTypes.string.isRequired,
    days: PropTypes.object.isRequired,
    isVideo: PropTypes.bool.isRequired,
    dayId: PropTypes.number.isRequired
  }
  componentDidMount() {
    const { dispatch, selectedDays, selectedPrograms } = this.props
    dispatch(actions.fetchDaysIfNeeded(selectedDays))
    dispatch(actions.fetchProgramsIfNeeded(selectedPrograms))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedDays, selectedPrograms } = nextProps

    if (nextProps.selectedDays !== this.props.selectedDays) {
      dispatch(actions.fetchDaysIfNeeded(selectedDays))
    }

    if (nextProps.selectedPrograms !== this.props.selectedPrograms) {
      dispatch(actions.fetchProgramsIfNeeded(selectedPrograms))
    }
  }

  render() {
    const { days, token, isFetching, editDay, dayIntro, dayDate,
      programs, editor, content, programShow, selectedDays, dispatch, dayId, isVideo,
      editorMin, contentMin } = this.props
    // const isEmpty = !programs || !days
    // const id = this.props.params.id
    // let initialValues = {}

    //
    // if (days && days[0] && id) {
    //   initialValues = {
    //     tasks: days[id].tasks || [],
    //     customIcon: days[id].customIcon || '',
    //     customName: days[id].customName || ''
    //   }
    // }

    return (
      <div className={styles.layout}>
        <Header burger={false} isTask={true}/>
        {isFetching
          ? <LoadingView title="Загружается..."/>
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <div className={styles.layoutInner}>
                <DayEditorValidationForm
                  calendar={days}
                  program={this.props.params.program}
                  editDay={editDay}
                  hideCreatePoll={false}
                  date={dayDate}
                  programs={programs}
                  editor={editor}
                  editorMin={editorMin}
                  content={content}
                  onSubmit={data => {
                    this.refs.loadingModal.show()
                    data.isVideo = isVideo
                    dispatch({ type: 'ISVIDEO', value: false })
                    const otherName = 'другое'

                    if (data && data.poll && data.poll.fields &&
                      !data.poll.fields.find(f => f.name === otherName)) {
                      data.poll.fields.push({ name: otherName })
                    }

                    if (data && data.tasks && data.tasks[0]) {
                      data.programTasks = [{}]
                      data.programTasks[0].customName = data.customName ? data.customName : ''
                      data.programTasks[0].program = programShow
                      data.programTasks[0].intro = content[0]
                        ? JSON.stringify(content[0])
                        : JSON.stringify(editor[0])
                      data.programTasks[0].introMin = contentMin[0]
                        ? JSON.stringify(contentMin[0])
                        : JSON.stringify(editorMin[0])
                      data.programTasks[0].program = programShow
                      data.programTasks[0].tasks = data.tasks
                    } else {
                      data.programTasks = [{}]
                      data.programTasks[0] = {
                        customName: data.customName,
                        customIcon: data.customIcon,
                        program: programShow,
                        intro: content[0]
                          ? JSON.stringify(content[0])
                          : JSON.stringify(editor[0]),
                        introMin: contentMin[0]
                          ? JSON.stringify(contentMin[0])
                          : JSON.stringify(editorMin[0])
                      }
                    }

                    delete data.program
                    delete data.tasks

                    if (data.programTasks.length) {
                      for (let i = 0; i < data.programTasks.length; i++) {
                        if (data.programTasks[i].intro) {
                          data.programTasks[i].intro = data.programTasks[i].intro.replace(/http:/g, 'https:')
                          data.programTasks[i].introMin = data.programTasks[i].introMin.replace(/http:/g, 'https:')
                        }
                      }
                    }

                    let url = `${api}/data/adminday-create`
                    data.date = moment(dayDate).format('YYYY-MM-DD')
                    if (dayId && dayId !== '-') {
                      data.id = dayId
                      url = `${api}/data/adminday-update`
                    } else {
                      data.forceNew = true
                    }
                    const payload = {
                      authToken: token ? token : cookie.load('token'),
                      customName: data.customName,
                      customIcon: data.customIcon,
                      data
                    }

                    const headers = {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                    const method = 'POST'
                    if (((content[0] && contentMin[0])) || (editor[0] && programShow)) {
                      return fetch(url, {
                        headers,
                        method,
                        body: JSON.stringify(payload)
                      })
                      .then(response => response.json())
                      .then(json => {
                        this.refs.loadingModal.hide()
                        if (json.errorCode === 1) {
                          this.refs.successPromoModal.show()
                        } else {
                          this.refs.errorModal.show()
                        }
                      })
                    } else {
                      this.refs.errorModal.show()
                    }
                  }
                }/>
                <Modal ref='loadingModal' contentStyle={contentStyle}>
                  <div className={styles.entryHeader}>
                    <h2 className={styles.entryTitleCenter}>Загружается...</h2>
                  </div>
                  <div className={styles.textCenter}>
                    <div className={styles.loaderMain}></div>
                  </div>
                </Modal>
                <Modal ref='errorModal' contentStyle={contentStyle}>
                  <h2>Что-то пошло не так, попробуйте снова</h2>
                  <br/>
                  <button className={styles.btnAction} onClick={() => {
                    this.refs.loadingModal.hide()
                    this.refs.errorModal.hide()
                  }}>
                    Продолжить
                  </button>
                </Modal>
                <Modal ref='successPromoModal' contentStyle={contentStyle}>
                  <h2>Изменения сохранены</h2>
                  <br/>
                  <button className={styles.btnAction} onClick={() => {
                    this.refs.loadingModal.hide()
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    dispatch({ type: 'PROGRAM_SHOW', programShow: 0 })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }}>
                    Продолжить
                  </button>
                </Modal>
              </div>
            </div>
          }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedPrograms, recivedPrograms, selectedDays, recivedDays,
    userToken, editDay, dayIntro, dayDate, editor, content, programShow, dayId, isVideo,
    editorMin, contentMin } = state
  const {
    isFetching,
    days
  } = recivedDays[selectedDays] || {
    isFetching: true,
    days: []
  }

  const { programs } = recivedPrograms[selectedPrograms] || []

  return {
    selectedDays,
    selectedPrograms,
    isFetching,
    days,
    editDay,
    dayIntro,
    contentMin,
    dayDate,
    programs,
    programShow,
    editor,
    editorMin,
    content,
    dayId,
    isVideo,
    token: userToken.token
  }
}

DayEditor = connect(
  mapStateToProps
)(DayEditor)

export default CSSModules(DayEditor, styles)
