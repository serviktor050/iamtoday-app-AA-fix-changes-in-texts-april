import React, { Component } from 'react'
import { Field } from 'redux-form'
import { connect } from 'react-redux'

import InputProfile from '../componentKit/InputProfile'
import InputDayPicker from './InputDayPicker'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import { api } from '../../config.js'
import MobileDayPicker from './MobileDayPicker'
import CSSModules from 'react-css-modules'
import styles from './insurance.css'
import ReactTooltip from 'react-tooltip'


let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const labelStyle = {
  marginBottom: '10px',
  fontSize: '1.6rem'
}

class InsuranceValidationForm extends Component {
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    const { dispatch, docs } = this.props
    dispatch({
      type: 'SAVE_INSURANCE_DOCS',
      docs
    })
  }

  render() {
    const { birthday, userInfo } = this.props
    const { fullName } = userInfo.data
    // const docsNames = insuranceDocs.map(doc => doc.name)
    // const docsString = docsNames.join()

    return (
      <div>
        <h3 className={styles.h3}>Страховка</h3>
        <p className={styles.subTitle}>Обеспечь свою безопасность. Это займет всего 2 минуты</p>

        <div className={styles.grid}>
          <div data-tip data-for='fullName' className="2/3--desk 1/1--pocket grid__cell">
            <p className={styles.h3} style={labelStyle}>ФИО</p>
            <Field disabled={fullName ? true : false} ref="fullName" name="fullName" placeholder="" component={InputProfile} />
            { fullName ?<ReactTooltip id='fullName'>
              <p>Для изменения обратитесь</p>
              <p>в службу поддержки!</p>
            </ReactTooltip> : null}
          </div>
          <div className="1/3--desk 1/1--pocket grid__cell">
            <p className={styles.h3} style={labelStyle}>Дата рождения</p>
            {/* <div className={styles.inputBoxMb30}>
              <input ref="birthday" name="birthday" value={birthday} placeholder="д/М/гггг" type='text' className={styles.inputFieldDate}/>
            </div> */}
            {window.mobilecheck()
              ? <Field name="birthday" placeholder="дд-мм-гггг" component={MobileDayPicker} />
              : <Field name="birthday" placeholder="дд-мм-гггг" component={InputDayPicker} />
            }
            {/* <Field ref="birthday" name="birthday" placeholder="д/М/гггг" component={InputProfileBirthday} /> */}
            {/* <Field val={insurance.birthday} name="insuranceBirthday" placeholder="д/М/гггг" component={InputProfile} /> */}
          </div>
        </div>

        <p className={styles.h3} style={labelStyle}>Профессия/Должность</p>
        <Field ref="profession" name="profession" placeholder="" component={InputProfile} />

        <p className={styles.h3} style={labelStyle}>Паспортные данные</p>
        <Field ref="passport" name="passport" placeholder="" component={InputProfile} />

        <p className={styles.h3} style={labelStyle}>Адрес регистрации</p>
        <Field ref="address" name="address" placeholder="" component={InputProfile} />

        <p className={styles.h3} style={labelStyle}>Индивидуальная страховая сумма по договору:</p>
        <div className={styles.inputBox}>
          <input disabled type="text" className={styles.inputField} placeholder="" value="100 000 руб."/>
        </div>

        {/* <hr/>

        <h3 className={styles.h3}>Подтверждающие документы. Скан паспорта</h3>
        <p className={styles.subTitle}>Необходимо прикрепить сканы 1 и 2 страницы, а так же ВСЕХ заполненных страниц в паспорте!</p>

        <div className="grid grid--center">
          <div className="1/3--desk grid__cell">
            <ul className="upload-list mb20">
              {insuranceDocs.map((doc, index) => (
                <li key={index} className="upload-list__item">
                  <span className="upload-list__title">{doc.name.slice(0,20)}</span>
                  <span className="upload-list__btn-del">
                    <svg className={styles.svgIcoTrash} onClick={e => {
                      e.preventDefault()
                      const payload = {
                        authToken: cookie.load('token'),
                        data: { uid: doc.uid }
                      }

                      const headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }

                      dispatch({
                        type: 'REMOVE_INSURANCE_DOC',
                        doc
                      })

                      insuranceFiles.splice(insuranceFiles.indexOf(doc.uid), 1)

                      return fetch(`${api}/user/insuranceFile-delete`, {
                          headers,
                          method: 'POST',
                          body: JSON.stringify(payload)
                        })
                        .then(response => response.json())
                        .then(json => {
                        })
                    }}>
                      <use xlinkHref="#ico-trash"></use>
                    </svg>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="2/3--desk grid__cell">
            <div className={styles.inputBoxBtn}>
              <span className="input__text" style={{ width: '100%' }}>{docsString}</span>
              <input multiple id="file-upload" type="file" className={styles.inputField} placeholder="" onChange={input => {
                const { target } = input
                if (target.files && target.files[0]) {
                  var reader = new FileReader()

                  reader.onload = e => {
                    //this.refs.avatar.src = e.target.result

                    const payload = {
                      authToken: cookie.load('token'),
                      data: {
                        name: target.files[0].name,
                        content: target.files[0].type === 'application/pdf'
                          ? reader.result.replace(/data:application\/pdf;base64,/, '')
                          : reader.result.replace(/data:image\/\w+;base64,/, '')
                      }
                    }

                    this.refs.loadingModal.show()

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
                        this.refs.loadingModal.hide()
                        if (json.errorCode === 1 && json.data) {
                          insuranceFiles.push(json.data.uid)

                          dispatch({
                            type: 'ADD_INSURANCE_DOC',
                            name: target.files[0].name,
                            uid: json.data.uid
                          })
                        }
                      })
                  }

                  reader.readAsDataURL(target.files[0])
                }
              }}/>
              <label htmlFor="file-upload" className={styles.btnSecondary}>Прикрепить файл</label>
            </div>
          </div>
        </div> */}

        <div className={styles.textCenterMb30}>
          <div className={styles.btnPrimary} onClick={e => {
            const payload = {
              authToken: cookie.load('token'),
              data: {
                fullName: this.refs.fullName.value,
                birthday,
                profession: this.refs.profession.value,
                passport: this.refs.passport.value,
                address: this.refs.address.value,
                dateStart: '2016-05-29',
                dateEnd: '2016-11-29',
                amount: 100000,
                isActive: false
              }
            }

            return fetch(`${api}/user/insurance-create`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(json => {
              if (json.errorCode === 1 && json.data &&
                this.refs.fullName.value && birthday &&
                this.refs.profession.value && this.refs.passport.value &&
                this.refs.address.value) {
                this.refs.successModal.show()
                // insuranceFiles.map(uid => {
                //   const payload = {
                //     authToken: cookie.load('token'),
                //     data: { uid, insurance: json.data.id }
                //   }
                //
                //   const headers = {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                //   }
                //
                //   return fetch(`${api}/user/insuranceFile-create`, {
                //       headers,
                //       method: 'POST',
                //       body: JSON.stringify(payload)
                //     })
                //     .then(response => response.json())
                //     .then(json => {
                //       if (json.errorCode === 1) {
                //         this.refs.successModal.show()
                //       } else {
                //         this.refs.failModal.show()
                //       }
                //     })
                // })
              } else {
                this.refs.failModal.show()
              }
            })
          }}>
            Активировать страховку
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
        <Modal ref='failModal' contentStyle={contentStyle}>
          <h2>Что-то пошло не так, возможно не все данные по старховке заполнены</h2>
          <br/>
          <div className={styles.btnAction} onClick={() => this.refs.failModal.hide()}>
            Продолжить
          </div>
        </Modal>
        <Modal ref='successModal' contentStyle={contentStyle}>
          <h2>Данные отправлены! В случае выявления ошибок мы свяжемся с вами дополнительно.</h2>
          <br/>
          <div className={styles.btnAction} onClick={e => this.refs.successModal.hide()}>
            Продолжить
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { insuranceDocs, birthday, userInfo } = state
  return {
    insuranceDocs,
    userInfo,
    birthday
  }
}

InsuranceValidationForm = connect(
  mapStateToProps
)(InsuranceValidationForm)

export default CSSModules(InsuranceValidationForm, styles)
