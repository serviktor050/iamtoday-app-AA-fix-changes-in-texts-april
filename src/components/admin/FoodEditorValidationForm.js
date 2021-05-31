import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { reduxForm } from 'redux-form'
import MenuButton from '../componentKit/MenuButton'
import 'react-datepicker/dist/react-datepicker.css'
import CSSModules from 'react-css-modules'
import styles from './foodEditorValidationForm.css'
/**
 *  Компонент FoodEditorValidationForm.
 *  Используется редактирования страницы питания в админке
 *
 */
class FoodEditorValidationForm extends Component {
  /**
   * @memberof FoodEditorValidationForm
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {number} propTypes.foodProgram номер программы
   * @prop {object} propTypes.food Объект данны питание
   * @prop {object} propTypes.editor Объект редактора editor
   *
   * */
  static propTypes = {
    foodProgram: PropTypes.number.isRequired,
    food: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired
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
    const { change, programs } = this.props
    change('programTasks', programs)
  }

  render() {
    const { handleSubmit, onSubmit, dispatch, food, programs, editor, foodProgram } = this.props

    const onEditorChange = (editorContent) => {
      const { dispatch } = this.props
      dispatch({ type: 'CONTENT', content: editorContent, index: foodProgram - 1 })
      dispatch({ type: 'FOOD_DESCRIPTION', description: draftToHtml(editorContent) })
    }

    let contentEditor
    if (foodProgram && editor[foodProgram - 1]) {
      contentEditor = (
        <div className='home-root'>
          <Editor ref='introEditor'
            toolbarClassName="home-toolbar"
            wrapperClassName="home-wrapper"
            editorClassName="home-editor"
            placeholder="Вставьте текст..."
            onChange={onEditorChange}
            contentState={editor[foodProgram - 1]}
            uploadCallback={this.uploadImageCallBack}
          />
        </div>
      )
    } else if (foodProgram && !editor[foodProgram - 1]) {
      contentEditor = (
        <div className='home-root'>
          <Editor ref='introEditor'
            toolbarClassName="home-toolbar"
            wrapperClassName="home-wrapper"
            editorClassName="home-editor"
            placeholder="Вставьте текст..."
            onChange={onEditorChange}
            uploadCallback={this.uploadImageCallBack}
          />
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.grid}>
        <div className={styles.gridCellLayoutMenu14}>
          <div className={styles.gridLayoutMenuInner}>
            <div className={styles.gridCellLayout66}>
              <ul className={styles.mainNav}>
                <li className={styles.mainNavItem}>
                  <MenuButton onClick={() => browserHistory.push('/superadmin/day')} icon="ico-m-book">
                    Создать день
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
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.gridCellLayoutContentPocket34}>
          <div className={styles.stageBoxSmallPadding}>
            <div className={styles.grid}>
              <div className={styles.deskGridCell12Mb30}>
                <button type='submit' className={styles.btnPrimary}>
                  Сохранить
                </button>
              </div>
            </div>

            <div className={styles.shareBox}>
              <ul className={styles.btnSocial}>
                {programs.map((program, index) => {
                  if (program.id !== 8) {
                    return (
                      <li key={index} className={foodProgram !== index + 1
                        ? 'btn-social__item btn-social__item--vk'
                        : 'btn-social__item btn-social__item--odnoklassniki'}>
                        <span className={styles.btnSocialTitle} onClick={() => {
                          dispatch({ type: 'FOOD_PROGRAM', program: index + 1 })
                          if (food[index] && food[index].content) {
                            dispatch({ type: 'EDITOR', editor: JSON.parse(food[index].content), index })
                          }
                        }}>
                          {program.name}
                        </span>
                      </li>
                    )
                  }
                })}
              </ul>
            </div>

            {contentEditor}

          </div>
        </div>
      </form>
    )
  }
}

FoodEditorValidationForm = reduxForm({
  form: 'dayEditor'
})(FoodEditorValidationForm)

const mapStateToProps = state => {
  const { selectedFood, selectedPrograms, recivedPrograms, hidePoll, programShow } = state
  const { programs } = recivedPrograms[selectedPrograms] || []
  return {
    hideCreatePoll: hidePoll,
    programShow,
    programs,
    selectedFood
  }
}

FoodEditorValidationForm = connect(
  mapStateToProps
)(FoodEditorValidationForm)

export default CSSModules(FoodEditorValidationForm, styles)
