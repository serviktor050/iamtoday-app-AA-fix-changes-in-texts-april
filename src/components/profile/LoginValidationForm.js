import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as actions from '../../actions';
import cookie from 'react-cookie';
import InputProfile from '../componentKit2/InputProfile';
import { api, host, domen } from '../../config.js';
import CSSModules from 'react-css-modules';
import styles from './loginValidationForm.css';
import LogoLink from '../componentKit/LogoLink';
import BackgroundTester from '../componentKit2/BackgroundTester';
import classNames from 'classnames';
import { dict } from 'dict';
import SelectComponent from "../componentKit/SelectComponent";
import Select from "react-select";

const isAlfa = domen.isAlfa;
let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const defaultBg = <img className={styles.alfaBg} src="/assets/img/antiage/bg.jpg" alt="" />;

const FB = window.FB

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
class LoginValidationForm extends Component {
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }
  }

  componentDidMount() {
    document.addEventListener('DOMContentLoaded', function () {
      window.addEventListener('message', function (event) {
        if (event.data.name === 'okAuth') {
          browserHistory.push({ pathname: '/social/ok', query: { code: event.data.code } })
        }
      }, false)
    }, false)
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

    const { handleSubmit, packageType, program, promo, siteSettings, smm } = this.props
    const isTele2Lk = domen.isTele2
    const isUnipro = domen.isUnipro
    const lang = cookie.load('AA.lang') || this.props.lang;

    let bg = defaultBg
    let url = isTele2Lk ? 'https://tele2lk.todayme.ru' : 'https://lk.todayme.ru';

    const isAccept = localStorage.getItem('accept');

    const tester = cookie.load('tester')
    let renderSmm = {}
    if (siteSettings.data) {
      siteSettings.data.enabledSocialNetworks.forEach((item, idx) => {
        renderSmm[item] = true
      })
    }

    const loginVk = () => {
      if (packageType) {
        cookie.save('packageType', packageType, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      if (program) {
        cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      if (promo) {
        cookie.save('promoName', promo, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      window.location = `https://oauth.vk.com/authorize?client_id=6420905&scope=wall,offline&redirect_uri=${url}/social/vk&display=page&response_type=token&v=5.73`
    }

    const loginOk = () => {
      if (packageType) {
        cookie.save('packageType', packageType, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      if (program) {
        cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      if (promo) {
        cookie.save('promoName', promo, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      }
      const urlOk = `https://connect.ok.ru/oauth/authorize?client_id=1264634880&scope=VALUABLE_ACCESS,LONG_ACCESS_TOKEN,PHOTO_CONTENT,GET_EMAIL&response_type=token&redirect_uri=${url}/social/ok`
      window.open(urlOk, 'Odnoklassniki', 'width=700,height=400')
    }

    const redirectFb = () => {
      let uri

      if (program && packageType) {
        uri = encodeURI(`${url}/social/fb?type=${packageType},${program},${promo}`)
      } else {
        uri = encodeURI(`${url}/social/fb`)
      }

      window.location = encodeURI('https://www.facebook.com/dialog/oauth?client_id=978521608971564&redirect_uri=' + uri + '&response_type=token')
    }

    const loginFb = () => {
      const self = this
      FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          const token = response.authResponse.accessToken
          const userId = response.authResponse.userID
          const socialNetType = 3
          const payload = { userId, token, socialNetType }
          return fetch(`${api}/user/authenticate-social`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
          })
            .then(response => response.json())
            .then(json => {
              if (json.errorCode === 1 && json.data && json.data.authToken) {
                cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                self.props.setToken(json.data.authToken)
                browserHistory.push('/signup/pay')
              } else {
                redirectFb()
              }
            })
        } else {
          redirectFb()
        }
      }, { scope: 'email' })
    }


    return (
      <div className={classNames(styles.layoutEntry, {
        [styles.layoutEntrySmm]: smm,
        [styles.alfa]: isAlfa
      })}>
        {!smm && <div className={styles.gridEntryHeader}>
          <div className={styles.gridCellTodaymeLogo}>
            <LogoLink />
          </div>
        </div>}
        <div className={classNames(styles.entryMin, {
          [styles.entryMinSmm]: smm
        })}>
          <div className={isTele2Lk ? styles.entryInnerTele2 : styles.entryInner}>
            <div className={styles.entryHeader}>
              {isTele2Lk ?
                <div className={styles.tele2Wrap}>
                  <img src="/assets/img/tele2/tele2_logo_black.png" className={styles.tele2Logo} alt="" />
                  <h2 className={styles.entryTitleCenterTele2}>Спорт по другим правилам</h2>
                </div>
                :
                <h1 className={classNames(styles.entryTitleCenter, {
                  [styles.colorAlfa]: isAlfa
                })}>{dict[lang]['regs.logInLk']}</h1>
              }
            </div>

            <form
              onSubmit={handleSubmit(this.props.onSubmit)}
              className={classNames(styles.entryBox, {
                [styles.entryBoxSmm]: smm
              })}>

              <div className={styles.input}>
                <label>{dict[lang]['regs.yourEmail']}</label>
                <Field
                  smm={smm}
                  cls={styles.inputCustom}
                  name='email'
                  id='login[1]'
                  placeholder={dict[lang]['regs.placeholder.yourEmail']}
                  component={InputProfile}
                //disabled={isAlfa ? true : null}

                />
              </div>
              <div className={styles.input}>
                <label>{dict[lang]['regs.yourPassword']}</label>
                <Field
                  smm={smm}
                  cls={styles.inputCustom}
                  name='password' id='login[2]'
                  placeholder={dict[lang]['regs.placeholder.yourPassword']}
                  type='password'
                  component={InputProfile}
                //disabled={isAlfa ? true : null}
                />
              </div>

              {/*{
                !isAccept &&

                <div className={styles.checkboxes}>
                    <Field isAccept={true} name='accept' title='Принять условия ' id='accept'
                           component={CheckboxOfert}/>
                </div>
              }*/}
              <div className={styles.entryNavMtb20}>
                <Link className={styles.entryNavLink} to="/restore">{dict[lang]['regs.fogotPassword']}</Link>
              </div>
              <button
                type='submit'
                //disabled={isAlfa ? true : null}
                className={classNames(styles.buttonSecondaryWide, {
                  [styles.bgAlfa]: isAlfa
                })}>{dict[lang]['regs.logIn']}</button>

              <div className={styles.entryNavRegister}>
                <p>{dict[lang]['regs.notRegistered']}</p>
                <Link className={styles.entryNavLink} to="/signup">{dict[lang]['regs.registration']}</Link>
              </div>
            </form>

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

        {tester ? <BackgroundTester /> : null}

      </div>
    )
  }
}

const validate = (data, props) => {
  const errors = {}
  const lang = cookie.load('AA.lang') || props.lang || dict.default;
  if (!data.email) {
    errors.email = dict[lang]['regs.emailMustNotEmpty'];
  } else if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(data.email)) {
    errors.email = dict[lang]['regs.emailWrong'];
  }

  if (!data.password) {
    errors.password = dict[lang]['regs.passMustNotEmpty'];
  }
  return errors
}

LoginValidationForm = reduxForm({
  form: 'loginValidation',
  validate: isAlfa ? null : validate
})(LoginValidationForm)

const mapStateToProps = state => {
  let { program, packageType, promo, siteSettings, lang } = state

  return {
    program,
    siteSettings,
    packageType,
    promo,
    lang
  }
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch)
})

LoginValidationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginValidationForm)

export default CSSModules(LoginValidationForm, styles)
