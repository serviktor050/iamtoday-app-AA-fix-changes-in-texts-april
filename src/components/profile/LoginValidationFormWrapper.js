import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginValidationForm from './LoginValidationForm'
import classNames from "classnames/bind";
import { EntryCarousel } from "./EntryCarousel"
import { browserHistory } from 'react-router'
import cookie from 'react-cookie'
import { api, domen } from '../../config.js'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './loginValidationForm.css'
import { dict } from 'dict';
import { RESPONSE_CODE_ACCESS_BLOCKED } from "../../routes";

const cx = classNames.bind(styles);

let contentStyle = {
  borderRadius: '18px',
  fontSize: '22px',
  padding: '30px',
  maxWidth: '90vw',
  margin: '0 auto',
}
const modalStyle = {
  maxWidth: '500px',
  width: '90%'
}
const isAlfa = domen.isAlfa;

class LoginValidationFormWrapper extends Component {

  handleSubmit = (data) => {
    const { setToken, setAuth, setSimpleRegs, setUserProfile } = this.props;
    if (isAlfa) {
      //return this.props.modalDialog();
    }
    //loadingModal.show()
    this.refs.loadingModal.show()
    return fetch(`${api}/user/authenticate`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        ...data,
        lang: this.getLangValue(data)
      })
    })
      .then(response => response.json())
      .then(json => {
        //loadingModal.hide()
        this.refs.loadingModal.hide();
        if (json.data && json.errorCode === 1 && json.data.role === 4) {
          cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
          const data = {
            firstName: json.data.firstName,
            lastName: json.data.lastName,
            program: json.data.program,
            photo: json.data.photo,
            gender: json.data.gender,
            role: json.data.role
          }
          setAuth(true);
          setSimpleRegs(true);
          setUserProfile(data);
          return;
        }
        if (json.data && json.errorCode === 1 && json.data.paidState !== 0) {
          cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
          setToken(json.data.authToken)
          setAuth(true)
          cookie.save('userProgram', json.data.program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
          cookie.save('fullName', json.data.firstName + ' ' + json.data.lastName, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 10
          })

          if (json.data.paidState === 2) {
            // browserHistory.push('/signup/pay/success')
          } else if (json.data.paidState === -1) {
            //browserHistory.push('/signup/params')
          } else if (!json.data.emailConfirmed) {
            browserHistory.push('/trainings')
          } else if (json.data.isFirstEdit) {

            browserHistory.push('/profile')
          } else if (json.data.role === 2) {

            browserHistory.push('/admin/profiles')

          } else {

            browserHistory.push('/trainings')
            //browserHistory.push('/signup/pay/success')
          }
        // Todo Узнать случай, когда может выполниться данное условие
        } else if (json.data && json.errorCode === 1 && json.data.paidState === 0){
          browserHistory.push('/trainings')
          //setAuth(true)

          //browserHistory.push('/signup/pay/success')
        } else if (RESPONSE_CODE_ACCESS_BLOCKED === json.errorCode) {
          this.refs.accessDenied.show()
        } else {
          this.refs.errorModal.show()
        }
      })
  }

  getLangValue = data => data.lang ? data.lang.value : null;

  render() {
    const { smm, lang } = this.props;
    let isUnipro = domen.isUnipro
    let isTele2Lk = domen.isTele2
    return (
      <div className={cx(smm && "wrapper", "entry")}>
        <EntryCarousel />
        <LoginValidationForm smm={smm} onSubmit={(data) => this.handleSubmit(data)} />

        <Modal ref='isNotRegs' modalStyle={modalStyle} contentStyle={contentStyle}>
          <div className={styles.entryHeader}>
            <h2 className={styles.textCenter}>Авторизоваться, комментировать и лайкать вы сможете с 11 ноября.</h2>
          </div>
          <div className={styles.btnsModal}>
            <button className={styles.buttonAction} onClick={() => {
              this.refs.isNotRegs.hide()
            }}>
              {dict[lang]['regs.continue']}
            </button>
          </div>
        </Modal>
        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
        <Modal ref='errorModal' contentStyle={contentStyle}>
          <h2> {dict[lang]['regs.wrongEmailOrPassword']}</h2>
          <br />
          <button className={styles.buttonAction} onClick={() => this.refs.errorModal.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
        <Modal modalStyle={modalStyle} ref='accessDenied' contentStyle={contentStyle}>
          <h2 className={styles.accessDenied}>{dict[lang]['regs.accessDenied']}</h2>
          <br />
          <button className={styles.buttonAction} onClick={() => this.refs.accessDenied.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
      </div>
    )
  }

}

export default CSSModules(LoginValidationFormWrapper, styles)
