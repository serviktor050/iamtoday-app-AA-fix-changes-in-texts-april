import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import Header from '../componentKit/Header'
import FoodEditorValidationForm from './FoodEditorValidationForm'
import LoadingView from '../componentKit/LoadingView'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './foodEditor.css'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

class FoodEditor extends Component {
  componentDidMount() {
    const { dispatch, selectedFood, selectedPrograms } = this.props
    dispatch(actions.fetchFoodIfNeeded(selectedFood))
    dispatch(actions.fetchProgramsIfNeeded(selectedPrograms))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedFood, selectedPrograms } = nextProps

    if (nextProps.selectedFood !== this.props.selectedFood) {
      dispatch(actions.fetchFoodIfNeeded(selectedFood))
    }

    if (nextProps.selectedPrograms !== this.props.selectedPrograms) {
      dispatch(actions.fetchProgramsIfNeeded(selectedPrograms))
    }
  }

  render() {
    const { food, token, isFetching, programs, program, selectedFood, dispatch, editor, content } = this.props
    const isEmpty = !programs || !food

    return (
      <div className={styles.layout}>
        <Header burger={false} />
        {isEmpty
          ? isFetching
            ? <LoadingView title="Загружается..."/>
            : <LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех поддержки (внизу справа)"/>
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <div className={styles.layoutInner}>
                <FoodEditorValidationForm
                  food={food}
                  program={this.props.params.program}
                  programs={programs}
                  foodProgram={program}
                  editor={editor}
                  onSubmit={ data => {
                    this.refs.loadingModal.show()

                    content.forEach((c, i) => {
                      const payload = {
                        authToken: token ? token : cookie.load('token'),
                        data: {
                          program: i + 1,
                          description: 'test',
                          content: JSON.stringify(c)
                        }
                      }

                      const headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }

                      const method = 'POST'
                      return fetch(`${api}/day/food-update`, {
                        headers,
                        method,
                        body: JSON.stringify(payload)
                      })
                      .then(response => response.json())
                      .then(json => {
                        this.refs.loadingModal.hide()
                        if (json.errorCode === 1) {
                          dispatch(actions.fetchFoodIfNeeded(selectedFood))
                          this.refs.successPromoModal.show()
                        } else {
                          this.refs.errorModal.show()
                        }
                      })
                    })
                  }}
                />
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
                  <button className={styles.btnAction} onClick={() => this.refs.errorModal.hide()}>
                    Продолжить
                  </button>
                </Modal>
                <Modal ref='successPromoModal' contentStyle={contentStyle}>
                  <h2>Изменения сохранены</h2>
                  <br/>
                  <button className={styles.btnAction} onClick={() => this.refs.successPromoModal.hide()}>
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
  const { selectedPrograms, recivedPrograms, selectedFood, recivedFood,
    userToken, foodProgram, foodDescription, editor, content } = state
  const {
    isFetching,
    food
  } = recivedFood[selectedFood] || {
    isFetching: true,
    food: []
  }

  const { programs } = recivedPrograms[selectedPrograms] || []

  return {
    selectedFood,
    selectedPrograms,
    isFetching,
    food,
    program: foodProgram,
    foodDescription,
    programs,
    editor,
    content,
    token: userToken.token
  }
}

FoodEditor = connect(
  mapStateToProps
)(FoodEditor)

export default CSSModules(FoodEditor, styles)
