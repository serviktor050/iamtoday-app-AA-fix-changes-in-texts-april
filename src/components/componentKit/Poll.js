import React, { Component } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import { api } from '../../config.js'
import CSSModules from 'react-css-modules'
import styles from './poll.css'
import classNames from 'classnames';

const otherName = 'другое'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px',
  color: '#1F447B',
  textAlign: 'center',
}

class Poll extends Component {

  state = {
    fields: []
  }


  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }
  }

  componentDidMount(){
    this.setState({
      fields: this.props.poll.fields
    })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.poll !== this.props.poll) {
      this.setState({
        fields: nextProps.poll.fields
      })
    }
  }

  renderSelected = (selected) => {
    const fields = this.state.fields.map((field) => {
      selected.forEach((id) => {
        if (field.id === id) {
          field.select = true;
        }
      });
      return field;
    })
    this.setState({
      fields
    })
  }

  render() {
    let { poll, selectField, dispatch, id, isPollVoted, pollWasSend, customClass, disabled } = this.props;
    let { description, isMultiChoose, showTextAnswer } = poll;
    const isSelect = isPollVoted || pollWasSend.find(p => p === id);

    const totalVoted = this.state.fields.reduce((acc, curr) => {
      return acc + curr.votedCount;
    }, 0);

    return (
      <div className={classNames(styles.stageBoxBigPadding, {
        [styles.smm]: !!customClass && (customClass === 'smm')
      })}>
        <div className={styles.stageBoxInner}>
          <h5 className={styles.h2TextCenterMb30}>{description}</h5>
          <ul className={styles.optionsWhiteMb30CenterWrap}>
            {this.state.fields.map((field, index) => {
                let isActive = false;
              selectField[id] && selectField[id].forEach(id => {
                  if(id === field.id){
                    return isActive = true;
                  }
                });

                const proc = field.votedCount ? Math.round(field.votedCount * 100 / totalVoted) + '%' : `${field.votedCount}%`;
              return(
                <li
                  key={index}
                  className={classNames(styles.optionsItem, {
                    [styles.disabled]: isSelect,
                    [styles.optionsItemIsActive]: isActive && !isSelect,
                    [styles.multi]: isMultiChoose && !isSelect
                  })}
                  onClick={() => {
                    if (isSelect || disabled) {
                      return;
                    }
                      let selected = selectField[id] || [];

                      if(!selectField[id] || !selectField[id].length){
                          selected = selected.concat(field.id);
                      } else {
                        const isActive = selected.indexOf(field.id)
                          if (isActive !== -1) {
                              selected = selected.filter(i => i !== field.id)
                          } else {
                              selected = selected.concat(field.id)
                          }
                      }
                      if(!isMultiChoose){
                          selected = [field.id]
                      }

                      dispatch({type: 'SELECT_FIELD', id, selectField: selected })
                  }}
                >
                  {field.name}

                  { isMultiChoose && isActive && !isSelect &&
                    <svg className={styles.multiCheckbox}>
                      <use xlinkHref="#ico-tick"></use>
                    </svg>
                  }

                  {isSelect &&
                    <div className={styles.select}>
                      { field.select &&
                        <svg>
                          <use xlinkHref="#ico-tick"></use>
                        </svg>
                      }
                      {proc}
                    </div>
                  }

                </li>
                )
            })}
          </ul>

          <div className={styles.gridCenter}>
            <div className={styles.gridCellDesk66}>
              <div className={styles.inputBtn}>
                {/*{
                  showTextAnswer &&

                  <div className={styles.inputFieldWrap}>
                    <input
                      ref='answer'
                      type="text"
                      className={styles.inputField}
                      placeholder="Ваш ответ"
                    />
                  </div>
                }*/}
                <button
                  className={isSelect|| disabled || !selectField[id] || !selectField[id].length ? styles.btnPrimaryDisabled  : styles.btnPrimary}
                  disabled={isSelect || disabled || !selectField[id] || !selectField[id].length}
                  type='button'
                  onClick={() => {
                    if(!selectField[id] || !selectField[id].length){
                      return;
                    }
                    this.refs.loadingModal.show()

                    let data = { answerIds: selectField[id]}

                    return fetch(`${api}/poll/pollFieldUser-create`, {
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      method: 'POST',
                      body: JSON.stringify({
                        authToken: cookie.load('token'),
                        data
                      })
                    })
                    .then(response => response.json())
                    .then(json => {
                      this.refs.loadingModal.hide()
                      if (json.isSuccess) {
                        this.renderSelected(selectField[id]);
                        this.refs.successModal.show()

                        const fields = this.state.fields.map((item) => {
                          selectField[id].forEach((id) => {
                            if (item.id === id) {
                              item.votedCount  = item.votedCount + 1
                            }
                          });
                          return item;
                        });

                        this.setState({
                          fields
                        })
                      } else {
                        this.refs.errorModal.show()
                      }
                    })
                  }}
                >
                  Проголосовать
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
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
        <Modal ref='successModal' contentStyle={contentStyle}>
          <h2>Ваш ответ отправлен!</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => {
            this.refs.successModal.hide()
            dispatch({ type: 'POLL_WAS_SEND', pollWasSend: id })
          }}>
            Продолжить
          </button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { selectField: state.selectField, selectedTaskDay: state.selectedTaskDay }
}

Poll = connect(
  mapStateToProps
)(Poll)

export default CSSModules(Poll, styles)
