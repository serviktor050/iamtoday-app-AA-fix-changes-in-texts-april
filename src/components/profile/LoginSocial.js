import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import { browserHistory } from 'react-router'
import Modal from 'boron-react-modal/FadeModal'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import CSSModules from 'react-css-modules'
import styles from './loginSocial.css'
import LogoLink from '../componentKit/LogoLink'
import BackgroundTester from '../componentKit2/BackgroundTester'

import LoadingView from '../componentKit/LoadingView'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

let packageTypeInitial
let programInitial
let promoInitial
let token
let socialNetType
let shareInitial
let isFetching = false
let currentGender = 'male'

const ga = window.ga
//const fbq = window.fbq
const yaCounter = window.yaCounter41402064

let packagesData = []

const getAmount = (promo) => {
  return fetch(`${api}/day/package-get`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(promo ? { promoName: promo } : {})
  })
  .then(response => response.json())
  .then(json => {
    if (json.data) {
      packagesData = json.data
    }
    return { packages: json.data }
  })
}

class LoginSocial extends Component {
  componentDidMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    const { setToken, dispatch, promo, packageType, selectedPrograms } = this.props
    token = this.props.location.hash
    socialNetType = 1
    if (token) {
      token = token.slice(1).split('&')[0]
      token = token.slice(token.indexOf('=') +1)

      const payload = { socialNetType, token }
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
          if (json.data.paidState !== 0) {

            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            setToken(json.data.authToken)

            cookie.save('userProgram', json.data.program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            cookie.save('fullName', json.data.firstName + ' ' + json.data.lastName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })

            if (json.data.paidState === 2 && (json.data.program !== 12 && json.data.program !== 16)) {
              browserHistory.push('/signup/pay/success')
            } else if (json.data.paidState === 2 && (json.data.program === 12 || json.data.program === 16)) {
              browserHistory.push('/signup/pay/friend?simple=true')
            } else if (json.data.isFirstEdit) {
              browserHistory.push('/task')
            } else {
              browserHistory.push('/profile')// browserHistory.push('/signup/pay/success')
            }
          } else if (json.data && json.data.paidState !== 0 && (json.data.program === 12 || json.data.program === 16)) {

            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            browserHistory.push('/signup/pay/friend?simple=true')
          } else if (json.data && !json.data.program) {

            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            browserHistory.push('/signup/params')
          } else if (json.data && (json.data.paidState === 0 || json.data.paidState === 1)) {

            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            browserHistory.push('/signup/params')
          } else {
            // this.refs.errorModal.show()
          }
        } else {
          packageTypeInitial = cookie.load('packageType')
          programInitial = cookie.load('program')
          promoInitial = cookie.load('promoName')
          shareInitial = cookie.load('share')

          dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))

          if (!programInitial || !packageTypeInitial || programInitial + '' === '12') {
            dispatch({ type: 'PAYMENT_TYPE', paymentType: 'acc' })
            dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: 1 })

            return Promise.resolve(getAmount(promo)
              .then(data => {
                if (data.packages) {
                  dispatch({
                    type: 'CHOOSEN_AMOUNT',
                    price: data.packages[packageType ? packageType - 1 : 0].cost
                  })
                } else {
                  // this.refs.errorPromoModal.show()
                }
              })
            )
          }
        }
      })
    } else {
      dispatch({ type: 'PAYMENT_TYPE', paymentType: 'err' })
    }
  }

  render() {
    const { paymentType, dispatch, promo, setToken, signup, share, phoneFriend,
      nameFriend, choosenProgram, choosenPromo, choosenAmount, choosenTomorrowType, fetchedPrograms } = this.props
    let { packageType, emailFriend } = this.props
    const tester = cookie.load('tester')

    if (!fetchedPrograms || !fetchedPrograms[0]) {
      return (<LoadingView title="Загружается..."/>)
    }

    const programs = [
      { name: '#Ягерой',
        isActive: fetchedPrograms[0].id === choosenProgram,
        number: fetchedPrograms[0].id,
        str: 'hero',
        style: fetchedPrograms[0].id === choosenProgram ? styles.optionsItemHeroActive : styles.optionsItemHero
      },
      { name: '#Мама может',
        isActive: fetchedPrograms[1].id === choosenProgram,
        number: fetchedPrograms[1].id,
        str: 'mather',
        style: fetchedPrograms[1].id === choosenProgram ? styles.optionsItemMotherActive : styles.optionsItemMother },
      { name: '#Экстрим',
        isActive: fetchedPrograms[2].id === choosenProgram,
        number: fetchedPrograms[2].id,
        str: 'extreme',
        style: fetchedPrograms[2].id === choosenProgram ? styles.optionsItemExtremeActive : styles.optionsItemExtreme },
      { name: '#Завтра',
        isActive: fetchedPrograms[3].id === choosenProgram,
        number: fetchedPrograms[3].id,
        str: 'tomorrow',
        style: fetchedPrograms[3].id === choosenProgram ? styles.optionsItemTomorrowActive : styles.optionsItemTomorrow }
    ]

    let activeProgram = {}

    if (choosenProgram !== 0) {
      programs.forEach((p, i) => {
        if (p.number === choosenProgram) {
          // programs[i].isActive = true
          activeProgram = programs[i]
        }
      })
    }

    const packageTypes = [
      { name: '1 человек', isActive: false, number: 1 },
      { name: '1 ЧЕЛОВЕК + ФИТНЕС-БРАСЛЕТ', isActive: false, number: 5 },
      { name: '1 ЧЕЛОВЕК + КОВРИК', isActive: false, number: 6 },
      { name: '2 человека', isActive: false, number: 2 },
      { name: '3 человека', isActive: false, number: 3 }
    ]

    if (!tester) packageTypes[packageType ? packageType - 1 : 0].isActive = true

    const tomorrowTypes = [
      { name: 'Себе', isActive: false, number: 1 },
      { name: 'Другу', isActive: false, number: 2 }
    ]

    tomorrowTypes[choosenTomorrowType - 1].isActive = true

    const signupWith = (email, program, packageType, promo, share) => {
      if (!isFetching) {
        isFetching = true
        if (email) {
          email = email.replace(/ /g, '')
        }
        if (emailFriend) {
          emailFriend = emailFriend.replace(/ /g, '')
        }

        this.refs.loadingModal.show()
        const pack = program === fetchedPrograms[3].id || !packageType || packageType === 'undefined'
          ? '1' : packageType
        signup(program, undefined, pack, promo, email, share, phoneFriend, nameFriend)

        const payload = {
          email: email ? email.replace(/ /g, '') : email,
          program: program ? program : fetchedPrograms[0].id,
          package: pack,
          gender: currentGender
        }
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }

        return fetch(`${api}/user/user-create`, {
          headers,
          method: 'POST',
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(json => {

          if (json.data && json.data.authToken) {
            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            setToken(json.data.authToken)

            const payload = {
              authToken: json.data.authToken,
              data: {
                socialNetType,
                token
              }
            }
            return fetch(`${api}/user/socialNetUser-create`, {
              headers,
              method: 'POST',
              body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(json => {
              isFetching = false
              this.refs.loadingModal.hide()

              if (json && json.data) {
                const programParam = cookie.load('programParam')
                if (programParam === 'teztour' ||
                  programParam === 'alfazdrav' ||
                  programParam === 'smclinic' ||
                  programParam === 'avilon') {
                  ga('send', 'event', 'user', 'successful_registration', 'partners')
                  ga('send', 'pageview', '/virtual/successful_registration/partners/')
                  yaCounter.reachGoal('successful_registration_partners')
                } else {
                  switch (json.data.program) {
                    case fetchedPrograms[0].id:
                      ga('send', 'event', 'user', 'successful_registration', 'hero')
                      ga('send', 'pageview', '/virtual/successful_registration/hero/')
                      yaCounter.reachGoal('successful_registration_hero')
                      break
                    case fetchedPrograms[1].id:
                      ga('send', 'event', 'user', 'successful_registration', 'mama')
                      ga('send', 'pageview', '/virtual/successful_registration/mama/')
                      yaCounter.reachGoal('successful_registration_mama')
                      break
                    case fetchedPrograms[2].id:
                      ga('send', 'event', 'user', 'successful_registration', 'extreme')
                      ga('send', 'pageview', '/virtual/successful_registration/extreme/')
                      yaCounter.reachGoal('successful_registration_extreme')
                      break
                    case fetchedPrograms[3].id:
                      ga('send', 'event', 'user', 'successful_registration', 'tomorrow')
                      ga('send', 'pageview', '/virtual/successful_registration/tomorrow/')
                      yaCounter.reachGoal('successful_registration_tomorrow')

                      ga('send', 'event', 'user', ' successful_registration_friend', 'tomorrow')
                      ga('send', 'pageview', '/virtual/successful_registration_friend/tomorrow/')
                      yaCounter.reachGoal('successful_registration_friend_tomorrow')
                      break
                    default:
                      break
                  }
                }






                //fbq('track', 'successful_registration')

                browserHistory.push('/signup/params')
              } else {
                throw new SubmissionError({ password: '', _error: 'Что-то пошло не так, попробуйте снова' })
              }
            })
          } else if (json.errorCode === 129) {
            isFetching = false
            this.refs.loadingModal.hide()
            this.refs.errorEmailModal.show()
          } else {
            isFetching = false
            this.refs.loadingModal.hide()
            this.refs.errorModal.show()
            throw new SubmissionError({ password: '', _error: 'Что-то пошло не так, попробуйте снова' })
          }
        })
      }
    }

    const loginFb = () => {
      if (!programInitial || !packageTypeInitial || programInitial === fetchedPrograms[3].id) {
        signupWith(this.refs.email.value, choosenProgram, packageType, choosenPromo, share)
      } else {
        signupWith(this.refs.email.value, programInitial, packageTypeInitial, promoInitial, shareInitial)
      }
    }

    return (
      <div>
        { paymentType === 'err' ? <LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех поддержки (внизу справа)"/> : <div>

          <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="assets/img/symbol-sprite.svg"/>

          <div className={styles.layoutEntry}>

            <div className={styles.gridEntryHeader}>
              <div className={styles.deskGridCellTodaymeLogo14}>
                <LogoLink/>
              </div>
              <div className={styles.gridCellTextCenter24}>
                <div className={styles.entryStep}>
                  <span className={styles.entryStepTitle}>Шаг</span>
                  <span className={styles.entryStepNo}>#2</span>
                  <span className={styles.entryStepGoto}>из 6</span>
                </div>
              </div>
            </div>

            <div className={styles.entryMin}>
              <div className={styles.entryInner}>
                {tester
                  ? <div className={styles.entryHeader}>
                    <h2 className={styles.entryTitleCenter}>Я ХОЧУ ПОМОЧЬ</h2>
                  </div>
                  : <div className={styles.entryHeader}>
                    <h2 className={styles.entryTitleCenter}>
                      {choosenProgram !== 0 && paymentType === 'acc' ? activeProgram.name : programs[programInitial - 1]}
                    </h2>
                  </div>
                }

                {/* <div className="entry__box">

                  {(!cookie.load('program') || paymentType === 'acc') &&
                    <ul className={styles.optionsWhiteWideMb30}>
                      {programs.map((p, index) => (
                        <li key={index}
                          className={p.style}
                          onClick={() => {
                            this.setState({
                              errorSelectProgram: false
                            })
                            dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: p.number })
                            if (p.number === fetchedPrograms[3].id) {
                              dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: 1 })
                              dispatch({
                                type: 'CHOOSEN_AMOUNT',
                                choosenAmount: packagesData[0].cost
                              })
                            }
                          }
                        }>
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  }

                  {choosenProgram !== fetchedPrograms[3].id && programInitial + '' !== fetchedPrograms[3].id + '' && !tester &&
                    <ul className={styles.optionsWhiteThreeValMt30}>
                      {packageTypes.map((pt, index) => (
                        <li key={index} className={pt.isActive ? styles.optionsItemIsActive : styles.optionsItem} onClick={() => {
                          packageType = pt.number
                          dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
                          dispatch({
                            type: 'CHOOSEN_AMOUNT',
                            choosenAmount: packagesData[packageType - 1].cost
                          })
                        }}>
                          {pt.name}
                        </li>
                      ))}
                    </ul>
                  }

                  {choosenProgram === fetchedPrograms[3].id &&
                    <ul className={styles.optionsWhiteTwoVal}>
                      {tomorrowTypes.map((tt, index) => (
                        <li key={index} className={tt.isActive ? styles.optionsItemIsActive : styles.optionsItem} onClick={() => {
                          dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: tt.number })
                        }}>
                          {tt.name}
                        </li>
                      ))}
                    </ul>
                  }
                </div> */}

                <div className={styles.entryBox}>
                  {/* <p className={styles.entryProgramPriceMb10}>{choosenProgram !== fetchedPrograms[3].id ? choosenAmount : 2000} руб.</p> */}

                  <div className={styles.inputBox}>
                    <input ref='email' type="text" className={styles.inputField} placeholder="email"/>
                  </div>

                  <div>
                    <div className={styles.genderAuth}>
                      <p className={styles.genderTitle}>Ваш пол:</p>
                      <span className={styles.radio}>
                        <label className={styles.radioLabel} htmlFor="gender[1]">
                          <input name="gender" value="male" className={styles.radioField} id="gender[1]" type='radio' onChange={() => {
                            currentGender = 'male'
                          }}/>
                          <span className={styles.radioPh}></span>
                          <span>Мужчина</span>
                        </label>
                      </span>
                      <span className={styles.radio}>
                        <label className={styles.radioLabel} htmlFor="gender[2]">
                          <input name="gender" value="female" className={styles.radioField} id="gender[2]" type='radio' onChange={() => {
                            currentGender = 'female'
                          }}/>
                          <span className={styles.radioPh}></span>
                          <span>Женщина</span>
                        </label>
                      </span>
                    </div>
                    <hr className={styles.genderHr}/>
                  </div>

                  {/* <div className={styles.inputBoxBtn}>
                    <input ref='promoText' type="text" className={styles.inputField} placeholder="Eсть промокод, вводи"/>
                    <div className={styles.btnBase} onClick={() => {
                      return Promise.resolve(getAmount(this.refs.promoText.value)
                        .then(data => {
                          if (data.packages) {
                            window.ga('set', 'dimension2', this.refs.promoText.value)
                            dispatch({
                              type: 'CHOOSEN_PROMO',
                              choosenPromo: this.refs.promoText.value
                            })
                            dispatch({
                              type: 'CHOOSEN_AMOUNT',
                              choosenAmount: data.packages[packageType ? packageType - 1 : 0].cost
                            })
                          } else {
                            this.refs.errorPromoModal.show()
                          }
                        })
                      )
                    }}>Применить</div>
                  </div> */}

                  <div className={styles.buttonPrimaryWide} onClick={() => {
                    return fetch(`${api}/day/package-get`, {
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      method: 'POST',
                      body: JSON.stringify({ promoName: promo })
                    })
                    .then(response => response.json())
                    .then(json => {
                      if (json.errorCode === 1) {
                        loginFb()
                      } else {
                        this.refs.errorPromoModal.show()
                      }
                    })
                  }}>
                    Продолжить
                  </div>
                </div>
              </div>
            </div>

            {tester
              ? <BackgroundTester />
              : <div className={styles.entryBg}>
                <svg viewBox="0 0 1440 1024" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="a" x1="2.235%" y1=".835%" y2="100%">
                      <stop stopColor="#17529C" offset="0%"/>
                      <stop stopColor="#5CB7D6" offset="100%"/>
                    </linearGradient>
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <rect width="1440" height="1024" fill="url(#a)"/>
                    <g opacity=".878" transform="translate(144 139)">
                      <path fill="#7FC6F6" d="M665.57495,517.992055 C665.57495,508.985055 672.874172,501.683438 681.882642,501.683438 L681.882642,501.683438 C690.889132,501.683438 698.190334,508.986707 698.190334,517.992055 L698.190334,572.351565 C698.190334,581.358566 690.891112,588.660182 681.882642,588.660182 L681.882642,588.660182 C672.876152,588.660182 665.57495,581.356914 665.57495,572.351565 L665.57495,517.992055 Z M936.321197,545.501284 C979.561335,549.307177 1013.47239,585.614574 1013.47239,629.846599 L1013.47239,884.508649 C1013.47239,931.273244 975.565501,969.183438 928.799919,969.183438 L674.144852,969.183438 C627.38154,969.183438 589.472386,931.275514 589.472386,884.508649 L589.472386,629.846599 C589.472386,585.616488 623.381761,549.307029 666.623925,545.501243 C668.953379,551.662325 674.906455,556.043903 681.882642,556.043903 C688.984228,556.043903 695.023596,551.505922 697.262183,545.17181 L905.682919,545.17181 C907.922053,551.505548 913.962232,556.043903 921.062129,556.043903 C928.039967,556.043903 933.992283,551.662697 936.321197,545.501284 Z M904.754437,517.992055 C904.754437,508.985055 912.053659,501.683438 921.062129,501.683438 L921.062129,501.683438 C930.068619,501.683438 937.369821,508.986707 937.369821,517.992055 L937.369821,572.351565 C937.369821,581.358566 930.070599,588.660182 921.062129,588.660182 L921.062129,588.660182 C912.055639,588.660182 904.754437,581.356914 904.754437,572.351565 L904.754437,517.992055 Z M709.062129,670.20088 C709.062129,661.194143 716.364999,653.89274 725.371614,653.89274 L763.421104,653.89274 L763.421104,686.50902 L709.062129,686.50902 L709.062129,670.20088 Z M774.292898,653.89274 L828.651873,653.89274 L828.651873,686.50902 L774.292898,686.50902 L774.292898,653.89274 Z M839.523668,653.89274 L877.573157,653.89274 C886.580637,653.89274 893.882642,661.192163 893.882642,670.20088 L893.882642,686.50902 L839.523668,686.50902 L839.523668,653.89274 Z M709.062129,697.381113 L763.421104,697.381113 L763.421104,729.997392 L709.062129,729.997392 L709.062129,697.381113 Z M839.523668,697.381113 L893.882642,697.381113 L893.882642,729.997392 L839.523668,729.997392 L839.523668,697.381113 Z M709.062129,740.869485 L763.421104,740.869485 L763.421104,773.485764 L709.062129,773.485764 L709.062129,740.869485 Z M839.523668,740.869485 L893.882642,740.869485 L893.882642,773.485764 L839.523668,773.485764 L839.523668,740.869485 Z M839.523668,784.357857 L893.882642,784.357857 L893.882642,816.974136 L839.523668,816.974136 L839.523668,784.357857 Z M709.062129,827.846229 L763.421104,827.846229 L763.421104,860.462508 L725.371614,860.462508 C716.364134,860.462508 709.062129,853.163085 709.062129,844.154368 L709.062129,827.846229 Z M741.677514,784.357857 L796.036488,784.357857 L796.036488,816.974136 L741.677514,816.974136 L741.677514,784.357857 Z M839.523668,827.846229 L893.882642,827.846229 L893.882642,844.154368 C893.882642,853.161105 886.579772,860.462508 877.573157,860.462508 L839.523668,860.462508 L839.523668,827.846229 Z M774.292898,740.869485 L828.651873,740.869485 L828.651873,773.485764 L774.292898,773.485764 L774.292898,740.869485 Z" opacity=".723" transform="rotate(30 801.472 735.433)"/>
                      <path stroke="#7FC6F6" d="M27.36 61.1884615C-.48 78.9565934-8.16 115.933516 9.6 144.266484 27.36 172.119231 63.36 180.282967 90.72 162.034615 97.44 157.712637 103.2 151.95 107.52 145.226923L155.04 221.101648 184.756206 201.827525 108.48 78.9565934C90.72 51.1038462 54.72 42.9401099 27.36 61.1884615zM71.52 15.0873626C73.92 12.6862637 76.32 10.7653846 79.2 8.84450549 103.68-7.48296703 135.84-.27967033 151.68 24.6917582L220.8 134.181868 185.28 201.412637" strokeLinecap="round" strokeLinejoin="round"/>
                      <path stroke="#7FC6F6" d="M21.6,64.55 L71.52,15.0873626"/>
                      <path stroke="#7FC6F6" d="M162.24 41.0192308L118.56 95.2840659M177.12 64.55L136.8 124.097253" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline stroke="#7FC6F6" points="0 81.844 42.757 81.844 64.974 0 89.788 138.063 117.249 50.923 139.301 111.891 164.283 7.823 185.28 125.702 214.809 41.462 228.737 80.801 268.8 80.118" transform="translate(129 454)" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <path stroke="#7FC6F6" d="M152.16,53.18 C142.01,44.44 127.82,40 110.01,40 C104.16,40 97.81,41.79 92.72,43.23 C91.81,43.48 90.9,43.74 90.02,43.98 C90.56,25.14 106.06,10 125,10 C127.76,10 130,7.76 130,5 C130,2.24 127.76,-1.13686838e-13 125,-1.13686838e-13 C100.53,-1.13686838e-13 80.55,19.64 80.01,43.99 C79.13,43.75 78.21,43.48 77.29,43.23 C72.19,41.78 65.85,40 60,40 C42.18,40 28,44.43 17.85,53.18 C6,63.38 6.82121026e-13,79.13 6.82121026e-13,100 C6.82121026e-13,121.43 6.24,145.88 16.7,165.39 C28.66,187.71 44.04,200 60,200 C65.17,200 69.33,198.66 73.36,197.36 C77.11,196.15 80.66,195 85,195 C89.34,195 92.89,196.14 96.64,197.36 C100.66,198.66 104.83,200 110,200 C125.96,200 141.34,187.71 153.3,165.39 C163.76,145.87 170,121.43 170,100 C170.01,79.13 164.01,63.38 152.16,53.18 L152.16,53.18 Z" transform="rotate(-16 1698.151 -3981.984)"/>
                  </g>
                </svg>
              </div>
            }

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
            <Modal ref='errorFriendModal' contentStyle={contentStyle}>
              <h2>Данные о друге заполнены не полностью</h2>
              <br/>
              <button className={styles.btnAction} onClick={() => this.refs.errorFriendModal.hide()}>
                Продолжить
              </button>
            </Modal>
            <Modal ref='errorPromoModal' contentStyle={contentStyle}>
              <h2>Промокод не действителен</h2>
              <br/>
              <button className={styles.btnAction} onClick={() => this.refs.errorPromoModal.hide()}>
                Продолжить
              </button>
            </Modal>
            <Modal ref='errorEmailModal' contentStyle={contentStyle}>
              <h2>Введенный вами email уже существует</h2>
              <br/>
              <button className={styles.btnAction} onClick={() => this.refs.errorEmailModal.hide()}>
                Продолжить
              </button>
            </Modal>
          </div>
        </div>
      }
    </div>)
  }
}

const selector = formValueSelector('loginSocial')
const mapStateToProps = state => {
  const { paymentType, profile, choosenPromo, choosenProgram, choosenAmount,
    choosenPackageType, choosenTomorrowType, selectedPrograms, recivedPrograms } = state
  let { program, packageType, promo } = profile

  if (!program) {
    program = selector(state, 'programValue')
  }

  if (!packageType) {
    packageType = selector(state, 'packageTypeValue')
  }

  if (!programInitial && !program) {
    program = 9
  }

  if (!packageTypeInitial && !packageType) {
    packageType = 1
  }

  const email = selector(state, 'emailValue')
  promo = promoInitial ? promoInitial : selector(state, 'promoValue')
  const emailFriend = selector(state, 'emailFriendValue')
  const phoneFriend = selector(state, 'phoneFriendValue')
  const nameFriend = selector(state, 'nameFriendValue')
  const { programs } = recivedPrograms[selectedPrograms] || []

  return {
    choosenTomorrowType,
    choosenPromo,
    choosenProgram,
    choosenAmount,
    paymentType,
    program: programInitial ? programInitial : program,
    packageType: packageTypeInitial ? packageTypeInitial : choosenPackageType,
    fetchedPrograms: programs,
    promo,
    email,
    emailFriend,
    phoneFriend,
    nameFriend
  }
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch),
  dispatch
})

LoginSocial = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginSocial)

export default CSSModules(LoginSocial, styles)
