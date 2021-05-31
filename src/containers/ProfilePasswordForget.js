import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'
import PasswordForgetValidationForm from '../components/profile/PasswordForgetValidationForm'
import Modal from 'boron-react-modal/FadeModal'
import { api, host, domen } from '../config.js'
import CSSModules from 'react-css-modules'
import styles from './profilePasswordForget.css'
import LogoLink from '../components/componentKit/LogoLink'
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import { dict } from 'dict';
import cookie from 'react-cookie';
import { EntryCarousel } from "../components/profile/EntryCarousel";
import Select from "react-select";

let contentStyle = {
  borderRadius: '18px',
  padding: '30px',
  maxWidth: "300px"
};

const modalStyle = {
  maxWidth: "300px"
}

const dropdownStyles = {

  control: (provided) => ({
    ...provided,
    background: 'transparent',
    height: '46px',
    marginTop: '5px',
    borderStyle: 'none',
    backgroundColor: 'white',
    width: 150
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#8A8A8A'
  }),
  placeholder: () => ({
    color: '#8A8A8A',
  }),

  menu: (provided) => ({
    ...provided,
    top: '-70px'
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    transform: 'rotate(180deg)'
  })
}
let src = "/assets/img/antiage/bg.jpg";
const isAlfa = domen.isAlfa;
if (isAlfa) {
  src = "/assets/img/alfa/alfa-energy2.jpg";
}
const defaultBg = <img className={styles.alfaBg} src={src} alt="" />;
/**
 *  Контейнер ProfilePasswordForget.
 *  Используется для отображения страницы 'Восстановление пароля' (/restore)
 *
 */
class ProfilePasswordForget extends Component {
  state = {
    failMessage: ""
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }
  }

  handleSubmit = (data) => {
    const lang = cookie.load('AA.lang') || dict.default;
    //let failMessage = dict[lang]['regs.userNotFound'];    

    data.url = `${host}/restore/create`
    return fetch(`${api}/user/user-sendRestorePassword`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(json => {
        if (json.errorCode === 1 && json.data) {
          if (json.data.resultCode === 1) {
            this.refs.successModal.show()
          } else {
            this.setState({ failMessage: json.data.resultText })
            this.refs.failModal.show()
          }
        } else {
          throw new SubmissionError({
            password: '',
            _error: dict[lang]['regs.smthWrong']
          })
        }
      })
  }

  handleSelectLanguage = (value) => {
    const { dispatch } = this.props;
    const langValue = value.value;

    cookie.save('AA.lang', langValue, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
    dispatch({
      type: 'SET_LANG',
      data: langValue
    })

  }

  render() {
    const isTele2Lk = domen.isTele2;
    const isUnipro = domen.isUnipro;
    const lang = cookie.load('AA.lang') || dict.default;
    //let failMessage = dict[lang]['regs.userNotFound'];

    let bg = defaultBg;
    if (isAlfa) {
      document.body.style.backgroundColor = "#213349"
    }

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/unipro.css" />
        </Helmet>
        <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="assets/img/symbol-sprite.svg" alt />
        <div className={classNames(styles.layoutEntry, {
          [styles.alfaBgMobile]: isAlfa
        })}>
          < EntryCarousel />
          <div className={styles.gridEntry}>
            <div className={classNames(styles.gridEntryHeader, {
              [styles.center]: isAlfa
            })}>
              <div className={styles.gridCellTodaymeLogo}>
                <LogoLink isUnipro={isUnipro} />
              </div>
            </div>

            <div className={classNames(styles.entryMin, {
              [styles.alfa]: isAlfa
            })}>
              <div className={styles.entryInner}>
                <div className={styles.entryHeader}>
                  <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.recovery']}</h2>
                </div>

                <Modal ref='successModal' className={styles.modal} modalStyle={modalStyle} contentStyle={contentStyle}>
                  <h2>{dict[lang]['regs.letterSend']}</h2>
                </Modal>

                <Modal ref='failModal' className={styles.modal} modalStyle={modalStyle} contentStyle={contentStyle}>
                  <h2>{this.state.failMessage}</h2>
                </Modal>

                <PasswordForgetValidationForm onSubmit={this.handleSubmit} />
              </div>

              <div className={styles.entryNavRegister}>
                <Select
                  id="login[3]"
                  name="lang"
                  onChange={this.handleSelectLanguage}
                  isSearchable={false}
                  placeholder={dict[lang]['language.option.ru']}
                  options={[{ label: dict[lang]['language.option.ru'], value: 'ru' },
                  { label: dict[lang]['language.option.en'], value: 'en' },]}
                  styles={dropdownStyles}
                  components={{
                    IndicatorSeparator: () => null,
                  }} />
              </div>
            </div>

            {/*<div className={styles.entryBg}>
            {bg}
        </div>*/}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  program: state.profile.program,
  sign: state.sign,
  amount: state.profile.amount,
  packageType: state.profile.packageType,
  lang: state.lang
})

ProfilePasswordForget = connect(
  mapStateToProps,
)(ProfilePasswordForget)

export default CSSModules(ProfilePasswordForget, styles)
