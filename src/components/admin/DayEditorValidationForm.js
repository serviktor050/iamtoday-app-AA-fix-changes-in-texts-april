import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg'
// import Editor from '../Editor'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import * as actions from '../../actions'
import draftToHtml from 'draftjs-to-html'
import RadioProfile from '../componentKit/RadioProfile'
import { Field, FieldArray, reduxForm } from 'redux-form'
import InputProfile from '../componentKit/InputProfile'
import Calendar from './Calendar'
import MenuButton from '../componentKit/MenuButton'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './dayEditorValidationForm.css'
import { programsData } from '../../utils/data'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const renderExercises = ({ fields, change, meta: { touched, error } }) => {
  return (
  <ul>
    <h4>Упражнения:</h4>
    {fields.map((exercise, index) => (
      <li key={index}>
        <br/>
        <div className={styles.gender}>
          <div className={styles.low}>{index + 1}-е упражение </div>
          <span className={styles.baseTableBtnDel}>
            <svg className={styles.svgIcoTrash} onClick={() => fields.remove(index)}>
              <use xlinkHref="#ico-trash"></use>
            </svg>
          </span>
        </div>
        <Field
          id="select"
          name={`${exercise}.exerciseType`}
          component="select"
          onChange={() => {
            document.getElementById('select').blur();
          }}
        >
          <option value="0">Видео</option>
          <option value="1">Текст</option>
          <option value="2">Фото</option>
        </Field>
        <br/>
        <br/>
        <Field name={`${exercise}.count`} placeholder="Количество раз" component={InputProfile} />
        <Field name={`${exercise}.description`} placeholder="Описание упражения" component={InputProfile} />
        {fields.get(index).exerciseType === '2'
          ? <div>
            <span className={styles.uploadGalleryItemInner}>
              <input type="file" accept="image/*" className={styles.uploadFileInput} onChange={input => {
                const { target } = input
                if (target.files && target.files[0]) {
                  var reader = new FileReader()

                  reader.onload = e => {
                    const content = reader.result.replace(/data:image\/\w+;base64,/, '')
                    const name = target.files[0].name
                    const payload = {
                      authToken: cookie.load('token'),
                      data: {
                        name,
                        content
                      }
                    }

                    const headers = {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }

                    return fetch(`${api}/data/file-upload`, {
                      headers,
                      method: 'POST',
                      body: JSON.stringify(payload)
                    })
                    .then(response => response.json())
                    .then(json => {
                      change(`${exercise}.video`, `${api}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, ''))
                    })
                  }

                  reader.readAsDataURL(target.files[0])
                }
              }}/>
            </span>

            <br/>
            <br/>

            <Field name={`${exercise}.video`} placeholder="Фото" component={InputProfile} />
          </div>
          : <Field name={`${exercise}.video`} placeholder="Ссылка на youtube/Текст описания" component={InputProfile} />
        }
      </li>
    ))}
    <li>
      <a href='#' onClick={e => {
        e.preventDefault()
        fields.push({})
      }}>Добавить</a>
    </li>
  </ul>
)}

const renderTasks = ({ fields, change, meta: { error } }) => (
  <ul>
    {fields.map((task, index) => (
      <li key={index}>
        <br/>
        <div className={styles.gender}>
          <h4 className={styles.low}>Задание - {index + 1}:</h4>
          <span className={styles.baseTableBtnDel}>
            <svg className={styles.svgIcoTrash} onClick={() => fields.remove(index)}>
              <use xlinkHref="#ico-trash"></use>
            </svg>
          </span>
        </div>
        <br/>
        <div className={styles.gender}>
          <p className={styles.genderTitle}>Пол</p>
          <Field name={`${task}.gender`} value="male" type='radio' title="Мужчина" id={`gender${index}[1]`} component={RadioProfile} />
          <Field name={`${task}.gender`} value="female" type='radio' title="Женщина" id={`gender${index}[2]`} component={RadioProfile} />
          <Field name={`${task}.gender`} value="all" type='radio' title="Для всех" id={`gender${index}[3]`} component={RadioProfile} />
        </div>
        <br/>
        <Field name={`${task}.name`} placeholder="Название" component={InputProfile} />
        <Field name={`${task}.description`} placeholder="Описание" component={InputProfile} />
        <FieldArray name={`${task}.exercises`} change={change} component={renderExercises} />
      </li>
    ))}
    <li>
      <br/>
      <button type="button" className={styles.btnPrimary} onClick={() => fields.push({})}>Добавить задание</button>
    </li>
  </ul>
)

const renderPollFields = ({ fields, meta: { error } }) => (
  <ul>
    <h4>Варианты опроса:</h4>
    <br/>
    {fields.map((field, index) => (
      <li key={index}>
        <div className={styles.grid}>
          <div className={styles.gridCellLayout66}>
            <Field name={`${field}.name`} placeholder="Название" component={InputProfile} />
          </div>
          <div className={styles.gridCellLayout33}>
            <span className={styles.baseTableBtnDel}>
              <svg className={styles.svgIcoTrash} onClick={() => fields.remove(index)}>
                <use xlinkHref="#ico-trash"></use>
              </svg>
            </span>
          </div>
        </div>
      </li>
    ))}
    <li>
      <br/>
      <a href='#' onClick={e => {
        e.preventDefault()
        fields.push({})
      }}>Добавить</a>
    </li>
  </ul>
)
/**
 *  Компонент DayEditorValidationForm.
 *  Используется для формы редактора в админке
 *
 */
class DayEditorValidationForm extends Component {
  /**
   * @memberof DayEditorValidationForm
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.reset Очистка календаря
   * @prop {func} propTypes.change Выбор программы
   * @prop {object} propTypes.calendar Объект данных для рендеринга календаря
   * @prop {bool} propTypes.hideCreatePoll Показать или скрыть опрос
   *
   * */
  static propTypes = {
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    calendar: PropTypes.object.isRequired,
    hideCreatePoll: PropTypes.bool.isRequired
  }
  constructor(props) {
    super()

    this.state = {
      isVideo: false,
      editorMin: '',
      editor: '',
      editorContentMin: '',
      editorContent: ''
    }
  }

  onEditorChange = (editorContent) => {
    const { dispatch } = this.props
    dispatch({ type: 'CONTENT', content: editorContent })
    dispatch({ type: 'DAY_INTRO', intro: draftToHtml(editorContent) })
  }

  uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.imgur.com/3/image')
      xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        resolve(response)
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  componentDidMount() {
    const { change, programs, dispatch, editorMin, editor } = this.props
    change('programTasks', programs)
    dispatch({ type: 'ISVIDEO', value: false })

    this.setState({
      editorMin: editorMin,
      editor: editor
    })
  }

  onChangeIsVideo() {
    const {isVideo, dispatch} = this.props
    dispatch({ type: 'ISVIDEO', value: !isVideo })
  }

  render() {
    const { reset, hideCreatePoll, handleSubmit, onSubmit, dispatch, calendar,
      change, date, programs, programShow, selectedDays, editor, dayId, isVideo,
      editorMin } = this.props
    const handleDateChange = date => {
      dispatch({ type: 'CONTENT_RESET' })
      dispatch({ type: 'DAY_INTRO_RESET' })
      dispatch({ type: 'EDITOR_RESET' })
      dispatch({ type: 'CONTENT_MIN_RESET' })
      dispatch({ type: 'DAY_INTRO_MIN_RESET' })
      dispatch({ type: 'EDITOR_MIN_RESET' })
      dispatch({ type: 'DAY_ID', id: '-' })
      change('programTasks', programs)
      dispatch({ type: 'PROGRAM_SHOW', programShow: 0 })
      dispatch({ type: 'DAY_DATE', date: date })
      dispatch(actions.fetchDaysIfNeeded(selectedDays))
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.grid}>
        <div className={styles.gridCellLayoutMenu14}>
          <div className={styles.gridLayoutMenuInner}>
            <div className={styles.gridCellLayout66}>
              <ul className={styles.mainNav}>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'CONTENT_MIN_RESET' })
                    dispatch({ type: 'DAY_INTRO_MIN_RESET' })
                    dispatch({ type: 'EDITOR_MIN_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    change('programTasks', [])
                    dispatch({ type: 'ISVIDEO', value: false })
                    dispatch({ type: 'PROGRAM_SHOW', programShow: programsData.hero })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }} icon="ico-m-book">
                    #Я ГЕРОЙ
                  </MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'CONTENT_MIN_RESET' })
                    dispatch({ type: 'DAY_INTRO_MIN_RESET' })
                    dispatch({ type: 'EDITOR_MIN_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    dispatch({ type: 'ISVIDEO', value: false })
                    change('programTasks', [])
                    dispatch({ type: 'PROGRAM_SHOW', programShow: programsData.mommy })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }} icon="ico-m-book">
                    #МАМА МОЖЕТ
                  </MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'CONTENT_MIN_RESET' })
                    dispatch({ type: 'DAY_INTRO_MIN_RESET' })
                    dispatch({ type: 'EDITOR_MIN_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    dispatch({ type: 'ISVIDEO', value: false })
                    change('programTasks', [])
                    dispatch({ type: 'PROGRAM_SHOW', programShow: programsData.extreme })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }} icon="ico-m-book">
                    #ЭКСТРЕМАЛЬНАЯ СУШКА
                  </MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'CONTENT_MIN_RESET' })
                    dispatch({ type: 'DAY_INTRO_MIN_RESET' })
                    dispatch({ type: 'EDITOR_MIN_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    dispatch({ type: 'ISVIDEO', value: false })
                    change('programTasks', [])
                    dispatch({ type: 'PROGRAM_SHOW', programShow: programsData.yoga })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }} icon="ico-m-book">
                    #ЙОГА
                  </MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    dispatch({ type: 'CONTENT_RESET' })
                    dispatch({ type: 'DAY_INTRO_RESET' })
                    dispatch({ type: 'EDITOR_RESET' })
                    dispatch({ type: 'CONTENT_MIN_RESET' })
                    dispatch({ type: 'DAY_INTRO_MIN_RESET' })
                    dispatch({ type: 'EDITOR_MIN_RESET' })
                    dispatch({ type: 'DAY_ID', id: '-' })
                    dispatch({ type: 'ISVIDEO', value: false })
                    change('programTasks', [])
                    dispatch({ type: 'PROGRAM_SHOW', programShow: programsData.family })
                    dispatch(actions.fetchDaysIfNeeded(selectedDays))
                  }} icon="ico-m-book">
                    #СЕМЬЯ
                  </MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    browserHistory.push('/userReports/pendingProfiles')
                  }} icon="ico-m-tasks">Отчеты</MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    browserHistory.push('/superadmin/food')
                  }} icon="ico-m-food">Питание</MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    browserHistory.push('/superadmin/photos')
                    dispatch({
                      type: 'SELECT_PHOTO_FAQ',
                      value:'UserPhotoCaptionMan'
                     })
                  }} icon="ico-m-faq">Инструкция фото - М</MenuButton>
                </li>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => {
                    browserHistory.push('/superadmin/photosWoman')
                    dispatch({
                      type: 'SELECT_PHOTO_FAQ',
                      value:'UserPhotoCaptionWoman'
                     })
                  }} icon="ico-m-faq">Инструкция фото - Ж</MenuButton>
                </li>
              </ul>
            </div>
            <div className={styles.gridCellLayout33}>
              <ul className={styles.minCalendar}>
                {calendar && calendar.map((field, index) => (

                  <li key={index}>
                    <Calendar onClick={() => {
                      reset()
                      this.setState({
                        editorContentMin: '',
                        editorContent: ''
                      })
                      dispatch({ type: 'DAY_ID', id: calendar[index].id })
                      dispatch({ type: 'ISVIDEO', value: calendar[index].isVideo })
                      change('customName', field.intro[0].customName)
                      change('customIcon', field.intro[0].customIcon)
                      const intro = calendar[index].intro.find(i => i.program === programShow)
                      dispatch({ type: 'EDITOR', editor: JSON.parse(intro.intro), index: 0 })
                      dispatch({ type: 'EDITOR_MIN', editor: JSON.parse(intro.introMin), index: 0 })
                      const programTask = calendar[index].programTasks.find(p => p.program === programShow)
                      dispatch({ type: 'DAY_DATE', date: moment(date, 'YYYY-MM-DD') })
                      change('customIcon', calendar[index].customIcon)
                      change('tasks', programTask
                        ? programTask.tasks.map((task) => {
                          task.exercises = task.exercises.map((exercise) => {
                            exercise.exerciseType += ''
                            return exercise
                          })
                          return task
                        })
                        : []
                      )

                      if (calendar[index].poll && calendar[index].poll.description) {
                        dispatch({ type: 'HIDE_POLL', hideCreatePoll: true })
                        change('poll.description', calendar[index].poll.description)
                        change('poll.fields', calendar[index].poll.fields)
                      } else {
                        dispatch({ type: 'HIDE_POLL', hideCreatePoll: false })
                      }
                    }}
                    onTrashClick={() => {
                      this.refs[`deleteModal${index}`].show()
                    }}
                    key={index}
                    number={field.id}
                    date={field.date}
                  >
                    {moment(field.date).format('DDddd')}
                  </Calendar>
                    <Modal ref={`deleteModal${index}`} contentStyle={contentStyle}>
                      <h2>Хотите удалить запись?</h2>
                      <br/>
                      <button className={styles.btnAction} onClick={() => {
                        const payload = {
                          authToken: cookie.load('token'),
                          data: {
                            id: field.id
                          }
                        }

                        const headers = {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        }

                        const method = 'POST'
                        return fetch(`${api}/data/adminday-delete`, {
                          headers,
                          method,
                          body: JSON.stringify(payload)
                        })
                        .then(response => response.json())
                        .then(json => {
                          if (json.errorCode === 1) {
                            dispatch(actions.fetchDaysIfNeeded(selectedDays))
                          }
                        })
                      }}>
                        Удалить
                      </button>
                    </Modal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.gridCellLayoutContentPocket34}>
          <div className={styles.stageBoxSmallPadding}>
            <div className={styles.grid}>
              <div className={styles.deskGridCell12Mb30}>
                <button type className={styles.btnPrimary}>
                  Сохранить
                </button>
              </div>
            </div>

            <h2 className='h2'>Id: {dayId} Program: {programShow}</h2>
            <span>Дата:</span>
            <div className="divider" />
            <DatePicker selected={date} onChange={handleDateChange} />
            <br/>
            <br/>

            {/* <Field name="program" id="program" options={[
              { name: '#Я ГЕРОЙ', value: '1'},
              { name: '#МАМА МОЖЕТ', value: '2' },
              { name: '#ЭКСТРЕМАЛЬНАЯ СУШКА', value: '3' },
            ]} component={SelectProgram} /> */}

            {/* <FieldArray name='programTasks' component={renderPrograms} /> */}
            <br/>
            <div className={styles.grid}>
              <div className={styles.gridCellLayout50}>
                <Field name='customName' placeholder="Название дня" component={InputProfile}/>
              </div>
              <div className={styles.gridCellLayout50}>
                <Field name='customIcon' placeholder="Выберите иконку" component={InputProfile} />
              </div>

              <div className={styles.gridCellLayoutIsVideo50}>
                <div className={styles.isVideoBox}>

                </div>

                <label htmlFor="isVideo" className={styles.isVideoLabel}>
                  <input id="isVideo" type="checkbox"
                         onChange={this.onChangeIsVideo.bind(this)}
                         checked={isVideo}/>
                  Ссылка на видео</label>
              </div>

            </div>

            <div className={styles.titleField}>
              <h2 className={styles.title}>Кратко</h2>
              <button type="button" className={styles.btnSecondary} onClick={() => {
                let content = this.state.editorContent.length ? this.state.editorContent : this.state.editor
                this.setState({
                  editorMin: content,
                  editorContentMin: ''
                })
              }}>
                Скопировать из Подробно
              </button>
            </div>

            {this.state.editorMin
              ? <div className='home-root'>
                <Editor
                  toolbarClassName="home-toolbar"
                  wrapperClassName="home-wrapper"
                  editorClassName="home-editor"
                  placeholder="Вставьте текст..."
                  onChange={(editorContent) => {
                    this.setState({
                      editorContentMin:  [editorContent]
                    })
                    const { dispatch } = this.props
                    dispatch({ type: 'CONTENT_MIN', content: editorContent, index: 0 })
                    dispatch({ type: 'DAY_INTRO_MIN', intro: draftToHtml(editorContent), index: 0 })
                  }}
                  contentState={this.state.editorMin[0]}
                  uploadCallback={this.uploadImageCallBack}
                />
              </div>
              : <div className='home-root'>
                <Editor
                  toolbarClassName="home-toolbar"
                  wrapperClassName="home-wrapper"
                  editorClassName="home-editor"
                  placeholder="Вставьте текст..."
                  onChange={(editorContent) => {
                    this.setState({
                      editorContentMin:  [editorContent]
                    })
                    const { dispatch } = this.props
                    dispatch({ type: 'CONTENT_MIN', content: editorContent, index: 0 })
                    dispatch({ type: 'DAY_INTRO_MIN', intro: draftToHtml(editorContent), index: 0 })
                  }}
                  uploadCallback={this.uploadImageCallBack}
                />
              </div>
            }

            <br/>
            <div className={styles.titleField}>
              <h2 className={styles.title}>Подробно</h2>
              <button type="button" className={styles.btnSecondary} onClick={() => {
                let content = this.state.editorContentMin.length ?  this.state.editorContentMin : this.state.editorMin
                this.setState({
                  editor: content,
                  editorContent: ''
                })
              }}>
                Скопировать из Кратко
              </button>
            </div>

            {this.state.editor
              ? <div className='home-root'>
                <Editor
                  toolbarClassName="home-toolbar"
                  wrapperClassName="home-wrapper"
                  editorClassName="home-editor"
                  placeholder="Вставьте текст..."
                  onChange={(editorContent) => {
                    this.setState({
                      editorContent:  [editorContent]
                    })
                    const { dispatch } = this.props
                    dispatch({ type: 'CONTENT', content: editorContent, index: 0 })
                    dispatch({ type: 'DAY_INTRO', intro: draftToHtml(editorContent), index: 0 })
                  }}
                  contentState={this.state.editor[0]}
                  uploadCallback={this.uploadImageCallBack}
                />
              </div>
              : <div className='home-root'>
                <Editor
                  toolbarClassName="home-toolbar"
                  wrapperClassName="home-wrapper"
                  editorClassName="home-editor"
                  placeholder="Вставьте текст..."
                  onChange={(editorContent) => {
                    this.setState({
                      editorContent:  [editorContent]
                    })
                    const { dispatch } = this.props
                    dispatch({ type: 'CONTENT', content: editorContent, index: 0 })
                    dispatch({ type: 'DAY_INTRO', intro: draftToHtml(editorContent), index: 0 })
                  }}
                  uploadCallback={this.uploadImageCallBack}
                />
              </div>
            }

            <br/>
            <br/>

            <FieldArray name='tasks' change={change} component={renderTasks} />

            <br/>
            <button type="button" className={styles.btnSecondary} onClick={() => {
              dispatch({ type: 'HIDE_POLL', hideCreatePoll: !hideCreatePoll })
            }}>
              {!hideCreatePoll ? 'Добавить опрос' : 'Убрать опрос' }
            </button>
            {hideCreatePoll &&
              <div>
                <br/>
                <Field name='poll.description' placeholder="Описание опроса" component={InputProfile} />
                <FieldArray name='poll.fields' component={renderPollFields} />
              </div>
            }
          </div>
        </div>
      </form>
    )
  }
}

DayEditorValidationForm = reduxForm({
  form: 'dayEditor',
  fields: ['tasks', 'customName', 'customIcon']
})(DayEditorValidationForm)

const mapStateToProps = state => {
  const { selectedDays, selectedPrograms, recivedPrograms, hidePoll, programShow, dayId, isVideo } = state
  const { programs } = recivedPrograms[selectedPrograms] || []
  return {
    hideCreatePoll: hidePoll,
    programShow,
    dayId,
    isVideo,
    programs,
    selectedDays
  }
}

DayEditorValidationForm = connect(
  mapStateToProps
)(DayEditorValidationForm)

export default CSSModules(DayEditorValidationForm, styles)
