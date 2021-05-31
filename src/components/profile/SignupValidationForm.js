import React, { Component } from 'react'
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import * as actions from '../../actions'
import InputProfile from '../componentKit2/InputProfile'
import CheckboxOfert from '../componentKit/CheckboxOfert'
import RadioProfile from '../componentKit/RadioProfile'
import SelectComponent from '../componentKit/SelectComponent'
import CheckboxProfile from '../componentKit/CheckboxProfile';
import { api, host, domen } from '../../config.js'
import CSSModules from 'react-css-modules'
import styles from './signupValidationForm.css'
import { cities, citiesUnipro } from '../../utils/data';
import { dict } from 'dict';
import classNames from 'classnames';

let contentStyle = {
  borderRadius: '18px',
  padding: '30px',
  textAlign: 'center'
};
const isAlfa = domen.isAlfa;
const FB = window.FB;



class SignupValidationForm extends Component {

  state = {
    users: [1],
    agreed: false,
    isDoctor: false
  }

  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }
  }

  componentDidMount() {
    const { change, email, card, keyCard, code, service } = this.props

    if (email) {
      change('email', email)
    }

    document.addEventListener('DOMContentLoaded', function () {
      window.addEventListener('message', function (event) {
        if (event.data.name === 'okAuth') {
          browserHistory.push({ pathname: '/social/ok', query: { code: event.data.code } })
        }
      }, false)
    }, false)

  }

  addUser = () => {
    const users = this.state.users;
    this.setState({
      users: users.concat(users.length + 1),
    })
  }

  render() {
    const { errorsValidate, handleSubmit, sign, packageType, program, onSubmit, promo, isTest, serviceIsFamily } = this.props
    const { host, isSimpleRegs } = sign
    const lang = cookie.load('AA.lang') || this.props.lang;

    const isAlfa = domen.isAlfa
    const isTele2Lk = domen.isTele2
    const isUnipro = domen.isUnipro

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

      window.location = `https://oauth.vk.com/authorize?client_id=5750682&scope=offline&redirect_uri=${host}/social/vk&display=page&response_type=code`
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

      const url = `https://connect.ok.ru/oauth/authorize?client_id=1248995328&scope=VALUABLE_ACCESS,LONG_ACCESS_TOKEN,PHOTO_CONTENT,GET_EMAIL&response_type=code&redirect_uri=${host}/social/ok`
      window.open(url, 'Odnoklassniki', 'width=700, height=400')
    }

    const redirectFb = () => {
      let uri

      if (program) {
        uri = encodeURI(`${host}/social/fb?type=${packageType},${program},${promo}`)
      } else {
        uri = encodeURI(`${host}/social/fb`)
      }

      window.location = encodeURI('https://www.facebook.com/dialog/oauth?client_id=602675109923486&redirect_uri=' + uri + '&response_type=token')
    }

    const loginFb = () => {
      const self = this
      FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          const token = response.authResponse.accessToken
          const userId = response.authResponse.userID
          const payload = { userId, token }
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

    const AgreedLabel = () => (<div className={styles.note}>{dict[lang]['regs.agreed.1']}<Link to="/offer" target="_blank" className={styles.noteLink}>{dict[lang]['regs.agreed.2']}</Link></div>);

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={classNames(styles.entryBox, {
          [styles.alfa]: isAlfa
        })}
      >
        <FieldArray
          name="users"
          lang={lang}
          component={renderUsers}
          isTest={isTest}
          isTele2Lk={isTele2Lk}
          serviceIsFamily={serviceIsFamily}
          errorsValidate={errorsValidate}
          dispatch={this.props.dispatch}
        />


        <div className={styles.checkboxes}>
          <div className={styles.checkbox}>
            <Field className={styles.signupCheckbox}
              name='agreed'
              id='agreed'
              value={this.state.agreed}
              component={CheckboxProfile}
              kind='sign'
              titleComponent={AgreedLabel}
              onChange={(agreed) => {
                this.setState({
                  agreed
                })
              }}
            />
          </div>

          <div className={styles.checkbox}>
            <Field className={styles.signupCheckbox}
              name='isDoctor'
              id='isDoctor'
              kind='sign'
              value={this.state.isDoctor}
              component={CheckboxProfile}
              title={dict[lang]['regs.iamDoctor']}
              onChange={(isDoctor) => {
                this.setState({
                  isDoctor
                })
              }}
            />
          </div>
        </div>


        {/* {error && <strong>{error}</strong>}*/}

        <button type='submit' className={classNames(styles.buttonSecondaryWide, {
          [styles.alfaBg]: isAlfa
        })}>
          {dict[lang]['regs.signUp']}
        </button>

        {/*{ isTest ?
          <div className={styles.checkboxes}>
            <Field
              checked ={true}
              name='accept'
              title='Принять условия '
              id='accept'
              isTest ={isTest}
              component={CheckboxOfert} />
          </div>
          : null }*/}


        {/*{ !isAlfa && <hr className="gender__down"/> }*/}

        <ul className={styles.entryNav}>
          <li className={styles.entryNavItem}>
            <p>{dict[lang]['regs.hasAccount']}</p>
            <Link className={styles.entryNavLink} to="/">{dict[lang]['regs.entranceToLk']}</Link>
          </li>
        </ul>

        {/* <p className={styles.textCenterMb10}>Войти через социальные сети</p>

        <ul className={styles.socialSignin}>
          <li className={styles.socialSigninItemFb} onClick={loginFb}>
            <svg className={styles.svgIcoFb}>
              <use xlinkHref="#fb"></use>
            </svg>
          </li>
          <li className={styles.socialSigninItemVk} onClick={loginVk}>
            <svg className={styles.svgIcoVk}>
              <use xlinkHref="#vk"></use>
            </svg>
          </li>
          <li className={styles.socialSigninItemOk} onClick={loginOk}>
            <svg className={styles.svgIcoOk}>
              <use xlinkHref="#odnoklassniki"></use>
            </svg>
          </li>
        </ul> */}
      </form>
    )
  }
}

const validate = (data, props) => {
  let errors = {};
  const lang = cookie.load('AA.lang') || props.lang || dict.default;
  if (!data.users || !data.users.length) {
    errors.users = { _error: 'At least one member must be entered' }
  } else {
    const userArrayErrors = [];
    data.users.forEach((user, userIndex) => {
      const userErrors = {};
      if (user.email) {
        user.email = user.email.replace(/ /g, '');
        let email = user.email.split('@');

        // if (isAlfa && email[1] !== 'alfabank.ru' && user.email !== 'muhanov@list.ru') {
        //   userErrors.email = 'Почта должна быть в домене @alfabank.ru ';
        //   userArrayErrors[userIndex] = userErrors;
        // }
      }
      // if (!user.workCard) {
      // userErrors.workCard = 'ID партнера должно быть заполнено';
      // userArrayErrors[userIndex] = userErrors;
      // }
      // if (user.workCard && (user.workCard.length < 6 || user.workCard.length > 6)) {
      // userErrors.workCard = 'Поле должно состоять из 6 цифр.';
      // userArrayErrors[userIndex] = userErrors;
      // }
      //
      // if(user.workCard && !/^\d+$/i.test(user.workCard)){
      // userErrors.workCard = 'Поле должно состоить только из цифр.';
      // userArrayErrors[userIndex] = userErrors;
      // }

      switch (true) {
        case !user.email:
          userErrors.email = dict[lang]['regs.emailMustNotEmpty'];
          userArrayErrors[userIndex] = userErrors;
          break;
        case !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(user.email):
          userErrors.email = dict[lang]['regs.emailWrong'];
          userArrayErrors[userIndex] = userErrors;
          break;
        default:
          break
      }

      switch (true) {
        case !user.password:
          userErrors.password = dict[lang]['regs.passMustNotEmpty'];
          userArrayErrors[userIndex] = userErrors;
          break;
        case user.password.length < 6:

          userErrors.password = dict[lang]['regs.passMustMore'];
          userArrayErrors[userIndex] = userErrors;
          break;
        case user.password.length > 20:

          userErrors.password = dict[lang]['regs.passMustLess'];
          userArrayErrors[userIndex] = userErrors;
          break;
        case /["]/g.test(user.password):

          userErrors.password = dict[lang]['regs.passCanNotSign'];
          userArrayErrors[userIndex] = userErrors;
          break;
        default:
          break
      }

      if (user.password !== user.passwordAgain) {
        userErrors.passwordAgain = dict[lang]['regs.passMustEqual'];
        userArrayErrors[userIndex] = userErrors;
      }
    });

    if (userArrayErrors.length) {
      errors.users = userArrayErrors;
    }

  }

  if (!data.agreed) {
    errors.agreed = dict[lang]['regs.mustBeAgreed'];
  }
  if (!data.isDoctor) {
    errors.isDoctor = dict[lang]['regs.regsOnlyDoctor'];
  }
  return errors
}

const asyncValidate = (values, props) => {
  const lang = props.lang;
  return fetch(`${api}/user/user-check`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ email: values.email })
  })
    .then(response => response.json())
    .then(json => {

      if (json.data) {
        throw { email: dict[lang]['regs.emailIs'] }
      }
    })
}

SignupValidationForm = reduxForm({
  form: 'signupFormValidation',
  validate,
  //asyncValidate,
  //asyncBlurFields: [ 'email' ]
})(SignupValidationForm)

const mapStateToProps = state => {
  const { sign, errorsValidate } = state;
  let { program, packageType, promo } = state.profile;

  return {
    program,
    errorsValidate,
    sign,
    packageType,
    promo
  }
};

const mapDispatchToProps = dispatch => ({
  setToken: bindActionCreators(actions.setToken, dispatch)
});

SignupValidationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupValidationForm);

export default CSSModules(SignupValidationForm, styles)


class renderUsers extends Component {

  componentDidMount() {
    this.props.fields.push({})
  }

  removeUser = (index) => {
    this.props.fields.remove(index)
  }
  render() {
    const { fields, isTest, isTele2Lk, serviceIsFamily, errorsValidate, lang } = this.props;

    return (
      <div>
        {
          fields.map((user, index) => {
            return (
              <div className={styles.user} key={index}>

                {index !== 0 && <hr className={styles.hrUser} />}

                {index !== 0 &&
                  <div className={styles.userClose} onClick={() => this.removeUser(index)}>
                    Удалить участника
                </div>
                }

                {
                  serviceIsFamily &&
                  <div className={styles.genderTitle}>{`Участник ${index + 1}`}</div>
                }

                <div className={styles.input}>
                  <label>{dict[lang]['regs.yourEmail']}</label>
                  <Field
                    name={`${user}.email`}
                    id='login[1]'
                    placeholder={dict[lang]['regs.placeholder.yourEmail']}
                    component={InputProfile}
                    cls={styles.inputCustom}
                  />

                </div>
                <div className={styles.input}>
                  <label>{dict[lang]['regs.yourPassword']}</label>
                  <Field
                    name={`${user}.password`}
                    id='login[2]'
                    placeholder={dict[lang]['regs.placeholder.yourPassword']}
                    type='password'
                    cls={styles.inputCustom}
                    component={InputProfile}
                  />
                </div>

                <div className={styles.input}>
                  <label>{dict[lang]['regs.passwordRepeate']}</label>
                  <Field
                    name={`${user}.passwordAgain`}
                    id='login[3]'
                    placeholder={dict[lang]['regs.placeholder.passwordRepeate']}
                    type='password'
                    cls={styles.inputCustom}
                    component={InputProfile}
                  />
                </div>
                <div className={styles.inputSelect}>
                  <Field
                    name={`${user}.lang`}
                    val={{ value: lang, label: dict[lang][`language.option.${lang}`] }}
                    cls={styles.inputSelect}
                    onChange={(value) => {
                      const langValue = value.value;
                      cookie.save('AA.lang', langValue, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                      this.props.dispatch({
                        type: 'SET_LANG',
                        data: langValue
                      })
                    }}
                    customStyles={{
                      container: (provided) => ({
                        ...provided,
                        width: 150,
                      }),

                      control: (provided, state) => ({
                        ...provided,
                        background: 'transparent',
                        height: '46px',
                        marginTop: '5px',
                        borderStyle: 'none',
                        backgroundColor: 'white',
                        width: 150
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: '#8A8A8A'
                      }),
                      placeholder: (provided, state) => ({
                        ...provided,
                        color: '#8A8A8A'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        top: '-70px',
                        width: 150
                      }),

                      dropdownIndicator: (provided) => ({
                        ...provided,
                        transform: 'rotate(180deg)'
                      }),

                      indicatorSeparator: () => ({
                        display: 'none'
                      })
                    }}
                    options={[
                      { label: dict[lang]['language.option.ru'], value: 'ru' },
                      { label: dict[lang]['language.option.en'], value: 'en' },
                    ]}
                    component={SelectComponent}

                  />
                </div>
              </div>
            )
          })
        }

        {
          serviceIsFamily && fields.getAll() && fields.getAll().length < 3 &&
          <button
            className={styles.buttonActionWide}
            onClick={() => fields.push({})}
            type='button'
          >
            Добавить участника
          </button>
        }
      </div>

    )
  }
}
