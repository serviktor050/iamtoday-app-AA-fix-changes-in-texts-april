import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import emoji from 'react-easy-emoji'
import * as actions from '../actions'
import { Link, browserHistory } from 'react-router'
import { reduxForm, formValueSelector, SubmissionError } from 'redux-form'
import cookie from 'react-cookie'
import SignupValidationForm from '../components/profile/SignupValidationForm'
import { api, domen } from '../config.js'
import Modal from 'boron-react-modal/FadeModal'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './profileSignup.css'
import LogoLink from '../components/componentKit/LogoLink'
import BackgroundTester from '../components/componentKit2/BackgroundTester'
import {Helmet} from "react-helmet";



let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

const regClose = false

const defaultBg = <img className={styles.alfaBg} src="/assets/img/antiage/bg.jpg" alt=""/>

/*const tele2InfoList = [
  'Промокод от Tele2 можно получить:',
  'Салоны Tele2',
  `<a href="https://svoi.tele2.ru" target='blank' className={styles.notifyItemLink}>Приложение «СВОИ»</a>`,
  'По телефону 611'
]*/

let email
let isFetching = false
let packagesData = []
let programs = []

const getAmount = promo => {
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
/**
 *  Контейнер ProfileSignupHide.
 *  Используется для отображения страницы 'Регистрация' (/signup)
 *
 */
class ProfileSignupHide extends Component {
  /**
   * @memberof ProfileSignupHide
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {number} propTypes.choosenPackageType Выбранный тип пакета
   * @prop {array} propTypes.programs Программы для выбора
   * @prop {object} propTypes.abtest Данные по аб тестам
   *
   * */
  static propTypes = {
    choosenPackageType: PropTypes.number,
    programs: PropTypes.array,
    abtest: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    let pathname = this.props.router.location.pathname,
      pathnameArr = pathname.split('/')

    if(pathnameArr[3] === 'a' || pathnameArr[2] === 'a'){
      this.props.checkABTest()
    }

    if(pathnameArr[2] === 'tele2' ){
      this.props.signUpTele2()
      this.props.showInfoBlockAction(true)
    }
  }

  componentDidMount() {
    const { dispatch, params, selectedPrograms, location, setSimpleRegs, sign } = this.props
    const { type, promo, share, method } = location.query
    const packageType = type
    const programParam = params.program

    if(method === 'simple'){
      setSimpleRegs(true)
    }

    dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))
    dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: 1 })


    if (promo || share) {
      if (this.refs.promoText && promo) {
        this.refs.promoText.value = promo
        dispatch({
          type: 'CHOOSEN_PROMO',
          choosenPromo: promo
        })
      } else {
        dispatch({
          type: 'CHOOSEN_PROMO',
          choosenPromo: 'share'
        })
      }
    }

    const ga = window.ga
    const fbq = window.fbq
    const yaCounter = window.yaCounter41402064

    if (this.props.params.program === 'teztour' ||
      this.props.params.program === 'alfazdrav' ||
      this.props.params.program === 'smclinic') {
      ga('send', 'event', 'user', 'registration_page', 'partners')
      ga('send', 'pageview', '/virtual/registration_page/partners/')
      yaCounter && yaCounter.reachGoal('registration_page_partners')
    } else {
      switch (programParam) {
        case 'hero':
          ga('send', 'event', 'user', 'registration_page', 'hero')
          ga('send', 'pageview', '/virtual/registration_page/hero/')
          yaCounter && yaCounter.reachGoal('registration_page_hero')
          break
        case 'mommy':
          ga('send', 'event', 'user', 'registration_page', 'mama')
          ga('send', 'pageview', '/virtual/registration_page/mama/')
          yaCounter && yaCounter.reachGoal('registration_page_mama')
          break
        case 'extremeways':
          ga('send', 'event', 'user', 'registration_page', 'extreme')
          ga('send', 'pageview', '/virtual/registration_page/extreme/')
          yaCounter && yaCounter.reachGoal('registration_page_extreme')
          break
        case 'tomorrowman':
          ga('send', 'event', 'user', 'registration_page', 'tomorrow')
          ga('send', 'pageview', '/virtual/registration_page/tomorrow/')
          yaCounter && yaCounter.reachGoal('registration_page_tomorrow')
          break
        default:
          if (cookie.load('general')) {
            ga('send', 'event', 'user', 'registration_page', 'home')
            ga('send', 'pageview', '/virtual/registration_page/home/')
            yaCounter && yaCounter.reachGoal('registration_page_home')
          }
          break
      }
    }

    fbq('track', 'registration_page')

    if (packageType * 1 === 4) {
      cookie.save('tester', 4, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
      this.props.showInfoBlockAction(true)
    } else {
      cookie.remove('tester', { path: '/' })
    }

    if (packageType * 1 === 4) {
      dispatch({
        type: 'CHOOSEN_AMOUNT',
        price: 0
      })
    } else {
      return Promise.resolve(getAmount(promo)
        .then(data => {
          dispatch({
            type: 'CHOOSEN_AMOUNT',
            price: data.packages[packageType ? packageType - 1 : 0].cost
          })
        })
      )
    }
  }

  componentDidUpdate() {
    const { dispatch, params, location } = this.props
    const programParam = params.program
    const { amount, type, promo, emailFriend, phoneFriend, nameFriend, share } = location.query
    const packageType = type
    let program

    programs = this.props.programs

    cookie.save('share', share, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
    cookie.save('promoName', promo, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })


    if(programs){
      switch (programParam) {
        case 'hero':
          program = programs[0].id
          break
        case 'mommy':
          program = programs[1].id
          break
        case 'extremeways':
          program = programs[2].id
          break
        case 'tomorrowman':
          program = programs[3].id
          break
        default:
          program = -1
          break
      }
    }

    if (packageType * 1 === 4) {
      cookie.save('tester', 4, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
      this.props.showInfoBlockAction(true)
    } else if (packageType) {
      dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
    }

    dispatch({ type: 'CHOOSEN_PROMO', choosenPromo: promo ? promo : '' })

    cookie.save('programParam', programParam, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })

    if (program && program !== -1 && packageType) {
      cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      cookie.save('packageType', packageType, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      cookie.remove('general', { path: '/' })
    } else if (program && program !== -1 && !packageType) {
      cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      cookie.remove('packageType', { path: '/' })
      cookie.remove('general', { path: '/' })
    } else {
      cookie.save('general', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
      cookie.remove('program', { path: '/' })
      cookie.remove('packageType', { path: '/' })
    }

    const { signup } = this.props
    signup(program, amount, packageType, promo, emailFriend, share, phoneFriend, nameFriend)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedPrograms } = nextProps
    if (nextProps.selectedPrograms !== this.props.selectedPrograms) {
      dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))
    }
  }

  statusChangeCallback(response) {
    if (response.status === 'connected') {
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.'
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.'
    }
  }

  closeNotify(index, typeInfo) {

    if(typeInfo === 'tester'){

      this.props.dispatch({
        type:'REMOVE_TESTER_INFO_ITEM',
        index
      })

    }

    if(typeInfo === 'tele2'){
      this.props.dispatch({
        type:'REMOVE_TELE2_INFO_ITEM',
        index
      })
    }


  }

  render() {
    let { dispatch, amount, packageType, promo, emailFriend, program, share, sign,
      phoneFriend, nameFriend, choosenPackageType, choosenTomorrowType, abtest, errorsValidate } = this.props
    const { setToken, signup, testerInfoBlocks} = this.props
    const { isTest, showInfoBlock, isTele2, tele2InfoList } = abtest
    const { error } = errorsValidate
    const isAlfa = domen.isAlfa
    const isTele2Lk = domen.isTele2
    const isUnipro = domen.isUnipro
    let bg = defaultBg
    const headerABTest = <div>
      <p>Регистрируйся сейчас и сразу</p>
      <p>получишь в подарок эффективные</p>
      <p>и простые лайфхаки для</p>
      <p>идеальной фигуры!</p>
    </div>

    let programName
    let headerStyle
    const tester = cookie.load('tester')

    amount = amount ? amount : 0

    if ((!programs || !programs[0]) && this.props.programs && this.props.programs[0]) {
      programs = this.props.programs
    }


    if (!programs || !programs[0]) {
      return (<LoadingView  isUnipro={isUnipro} isTele2Lk={isTele2Lk} isAlfa={isAlfa} title="Загружается..."/>)
    }

    const packageTypes = tester ? [{ name: 'Тестер', isActive: false, number: 4 }] : [
      { name: '1 человек', isActive: false, number: 1 },
      { name: '1 ЧЕЛОВЕК + ФИТНЕС-БРАСЛЕТ', isActive: false, number: 5 },
      { name: '1 ЧЕЛОВЕК + КОВРИК', isActive: false, number: 6 },
      { name: '2 человека', isActive: false, number: 2, half:true },
      { name: '3 человека', isActive: false, number: 3, half:true },
      { name: 'Понедельный', isActive: false, number: 7 }
    ]

    if (!tester) {
      packageTypes.map(element => {
        if (element.number === choosenPackageType) {
          element.isActive = true
        }
        return element
      })
    }

    const tomorrowTypes = [
      { name: 'Себе', isActive: false, number: 1 },
      { name: 'Другу', isActive: false, number: 2 }
    ]

    tomorrowTypes[choosenTomorrowType - 1].isActive = true

    switch (program) {
      case programs[0].id:
        programName = '#ДЛЯ НОВИЧКОВ'
        headerStyle = styles.entryHeaderHero
        break
      case programs[1].id:
        programName = '#ДЛЯ МОЛОДЫХ МАМ'
        headerStyle = styles.entryHeaderMother
        break
      case programs[2].id:
        programName = '#ДЛЯ ПРОДВИНУТЫХ СПОРТСМЕНОВ'
        headerStyle = styles.entryHeaderExtreme
        break
      case programs[3].id:
        programName = '#Я ЗАВТРА'
        headerStyle = styles.entryHeaderTomorrow
        break
      default:
        switch (this.props.params.program) {
          case 'teztour':
            programName = 'TEZ-TOUR'
            cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            break
          case 'alfazdrav':
            programName = 'АЛЬФА ЦЕНТР ЗДОРОВЬЯ'
            cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            break
          case 'smclinic':
            programName = 'СМ-КЛИНИКА'
            cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            break
          case 'avilon':
            programName = 'AVILON'
            cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            break
          default:
            programName = 'ЯСЕГОДНЯ'
        }
    }

    if (program === programs[3].id && amount === 0) {
      amount = 2500
    }

    const userCreate = payload => {
      const { card, key, code, service } = this.props.location.query;
      payload.card = card ? card : null;
      payload.key = key ? key : null;
      payload.code = code ? code : null;
      payload.service = service ? service : null;

      if (!isFetching) {
        isFetching = true;
        signup(program, undefined, packageType, promo, email, share, phoneFriend, nameFriend);
        this.refs.loadingModal.show()
        return fetch(`${api}/user/user-create`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(payload)
        })

        .then(response => response.json())
        .then(json => {
          isFetching = false
          this.refs.loadingModal.hide()
          if (json.data && json.data.authToken) {
            cookie.save('token', json.data.authToken, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            setToken(json.data.authToken)
            const ga = window.ga
            const fbq = window.fbq
            const yaCounter = window.yaCounter41402064
            switch (json.data.program) {
              case programs[0].id:
                ga('send', 'event', 'user', 'successful_registration', 'hero')
                ga('send', 'pageview', '/virtual/successful_registration/hero/')
                yaCounter && yaCounter.reachGoal('successful_registration_hero')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case programs[1].id:
                ga('send', 'event', 'user', 'successful_registration', 'mama')
                ga('send', 'pageview', '/virtual/successful_registration/mama/')
                yaCounter && yaCounter.reachGoal('successful_registration_mama')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case programs[2].id:
                ga('send', 'event', 'user', 'successful_registration', 'extreme')
                ga('send', 'pageview', '/virtual/successful_registration/extreme/')
                yaCounter && yaCounter.reachGoal('successful_registration_extreme')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case programs[3].id:
                ga('send', 'event', 'user', 'successful_registration', 'tomorrow')
                ga('send', 'pageview', '/virtual/successful_registration/tomorrow/')
                yaCounter && yaCounter.reachGoal('successful_registration_tomorrow')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              default:
                break
            }




              fbq('track', 'successful_registration')

              if (program && program !== -1) {
                cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: program })
              }
              if(sign.isSimpleRegs){
                browserHistory.push('/')
                return;
              }
              browserHistory.push('/signup/params')
            } else if (json.errorCode === 129) {
              this.refs.errorEmailModal.show()
            } else if (json.errorCode === 128) {
              this.refs.errorTeamModal.show()
            } else {
            this.refs.errorModal.show()
            throw new SubmissionError({
              password: '',
              _error: 'Что-то пошло не так, возможно такой email уже существует'
            })
          }
          })
      }
    }
    return (
      <div className={styles.layoutEntry}>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/unipro.css" />
        </Helmet>
        <div className={styles.gridEntryHeader}>
          <div className={styles.deskGridCellTodaymeLogo14}>
            <LogoLink isUnipro={isUnipro} isTele2Lk = {isTele2Lk} isAlfa={isAlfa} isTest={isTest}/>
          </div>
          <div className={styles.deskGridCellTextCenter24}>
            <div className={isTele2Lk ? styles.entryStepTele2 : styles.entryStep}>

             {!regClose ?
               <div>
                 <span className={styles.entryStepTitle}>Шаг</span>
                 <span className={styles.entryStepNo}>#1</span>
                 <span className={styles.entryStepGoto}>{ isTest ? 'из 4' : isTele2Lk || isUnipro ? 'из 3' : 'из 6'}</span>
               </div>
             : null }
            </div>
          </div>
        </div>

        <div className={styles.entryMin}>
          <div className={styles.entryInner}>

            {cookie.load('general')

              ? <div className={styles.entryHeader}>
                <h2 className={isTele2Lk ? styles.entryHeaderTitleTele2 : styles.entryHeaderTitle}>
                  {!isTest ? 'Регистрация' : headerABTest}
                </h2>

              </div>
              : <div>
                {tester
                  ? <div className={styles.entryHeader}>
                    <h2 className={styles.entryTitleCenter}>Я ХОЧУ ПОМОЧЬ</h2>
                  </div>
                  : <div className={headerStyle}>
                    <h2 className={styles.entryTitleCenter}>{programName}</h2>
                  </div>
                }

                <br />

              </div>
            }

            {isTele2 && showInfoBlock
              ?<ul className={styles.notify}>
                {tele2InfoList.map((item, index) => (
                  <li
                    className={styles.notifyItem}
                    key={item.id}
                  >
                    <div onClick={() => this.closeNotify(item.id, 'tele2')} className={styles.notifyClose}>
                      <svg className={'svg-icon ' +styles.notifyCloseIcon}>
                        <use xlinkHref={'#ico-close'}/>
                      </svg>
                    </div>
                    {!item.link ? <p>{item.value}</p> : <a href={item.link} target='blank' className={styles.notifyItemLink}>{item.value}</a>}
                  </li>
                ))}
              </ul>
              : null
            }
            {regClose ?
              <div className={styles.closeWrap}>
                <h3 className={styles.textTitleCenter}>Извините, регистрация окончена</h3>
                <div className = 'text-center' >
                  <Link className={styles.btnClose} to="/">Войти</Link>
                </div>
              </div>
              :
              <SignupValidationForm isTest = {isTest} email={this.props.location.query.email} onSubmit={data => {
              {
                tester && showInfoBlock
                  ? <ul className={styles.notify}>
                    {testerInfoBlocks.map((item, index) => (
                      <li
                        className={styles.notifyItem}
                        key={index}
                      >
                        <div onClick={() => this.closeNotify(index)} className={styles.notifyClose}>
                          <svg className={'svg-icon ' + styles.notifyCloseIcon}>
                            <use xlinkHref={'#ico-close'}/>
                          </svg>
                        </div>
                        <p>{item}</p>
                      </li>
                    ))}
                  </ul>
                  : null
              }
              let email = data.email
              let password = data.password
              let gender = data.gender
              let city
              if(data.city){
                city = data.city.label
              }
              let customUserFields = {
                  workTeam: data.workTeam,
                  workRelation: data.workRelation ? data.workRelation : null
                }

              let payload = {email, emailFriend, password, gender, customUserFields, city}
              const name = this.props.location.query.name

              if (name) {
                payload.firstName = name
              }

              if (program && program !== -1) {
                payload.program = program
              }

              if (packageType) {
                payload.package = packageType
              }
              return userCreate(payload)
            }}/>
            }

          </div>
        </div>

        {tester
          ? <BackgroundTester />
          : <div className={styles.entryBg}>
            {bg}
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
        <Modal ref='errorEmailModal' contentStyle={contentStyle}>
          <h2>Введенный вами email уже существует</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => this.refs.errorEmailModal.hide()}>
            Продолжить
          </button>
        </Modal>
        <Modal ref='errorTeamModal' contentStyle={contentStyle}>
          <h2>К этой группе уже присоединилось максимальное количество участников</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => this.refs.errorTeamModal.hide()}>
            Продолжить
          </button>
        </Modal>
        <Modal ref='errorPromoModal' contentStyle={contentStyle}>
          <h2>Промокод недействителен</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => this.refs.errorPromoModal.hide()}>
            Продолжить
          </button>
        </Modal>
      </div>
    )
  }
}

ProfileSignupHide = reduxForm({
  form: 'signupValidation'
})(ProfileSignupHide)

const selector = formValueSelector('signupValidation')

const mapStateToProps = state => {
  const { selectedPrograms, recivedPrograms, profile, choosenPackageType,
  choosenAmount, choosenPromo, choosenTomorrowType, abtest, errorsValidate, testerInfoBlocks, sign } = state

  let { program, packageType, promo, amount, share } = profile

  if (!program) {
    program = selector(state, 'programValue')
  }

  if (!packageType) {
    packageType = selector(state, 'packageTypeValue')
  }

  const emailFriend = selector(state, 'emailFriendValue')
  const phoneFriend = selector(state, 'phoneFriendValue')
  const nameFriend = selector(state, 'nameFriendValue')
  promo = selector(state, 'promoValue')

  const { programs } = recivedPrograms[selectedPrograms] || []

  return {
    testerInfoBlocks,
    sign,
    choosenTomorrowType,
    abtest,
    choosenPromo,
    choosenAmount,
    choosenPackageType,
    program,
    packageType,
    promo,
    amount,
    emailFriend,
    phoneFriend,
    errorsValidate,
    nameFriend,
    share,
    selectedPrograms,
    programs
  }
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch),
  checkABTest: bindActionCreators(actions.checkABTest, dispatch),
  signUpTele2: bindActionCreators(actions.signUpTele2, dispatch),
  showInfoBlockAction: bindActionCreators(actions.showInfoBlockAction, dispatch),
  setSimpleRegs: bindActionCreators(actions.setSimpleRegs, dispatch)
})

ProfileSignupHide = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSignupHide)

export default CSSModules(ProfileSignupHide, styles)
