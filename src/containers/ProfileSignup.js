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
import LoadingView from '../components/componentKit/LoadingView';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CSSModules from 'react-css-modules'
import styles from './profileSignup.css'
import LogoLink from '../components/componentKit/LogoLink'
import BackgroundTester from '../components/componentKit2/BackgroundTester'
import StepsVisual from '../components/profile/StepsVisual'
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import { title, fav16, fav32 } from 'utils/helmet';
import Loader from '../components/componentKit/Loader'
import { dict } from 'dict';
import { EntryCarousel } from "../components/profile/EntryCarousel";

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
};
const isAlfa = domen.isAlfa;
const regClose = false;

let src = "/assets/img/antiage/bg.jpg";

if (isAlfa) {
  src = "/assets/img/alfa/alfa-energy.jpg";
}

const defaultBg = <img className={styles.alfaBg} src={src} alt="" />;

let email;
let isFetching = false;
let packagesData = [];
let programs = [];

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
};
/**
 *  Контейнер ProfileSignup.
 *  Используется для отображения страницы 'Регистрация' (/signup)
 *
 */

class ProfileSignup extends Component {
  /**
   * @memberof ProfileSignup
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
      contentStyle.margin = '100px';
      contentStyle.width = '300px';
    }

    let pathname = this.props.router.location.pathname,
      pathnameArr = pathname.split('/');

    if (pathnameArr[3] === 'a' || pathnameArr[2] === 'a') {
      this.props.checkABTest()
    }

    if (pathnameArr[2] === 'tele2') {
      this.props.signUpTele2();
      this.props.showInfoBlockAction(true);
    }
  }

  componentDidMount() {
    const { dispatch, params, selectedPrograms, location, setSimpleRegs, sign, getLang } = this.props;
    const { type, promo, share, method } = location.query;
    const packageType = type;
    const programParam = params.program;

    this.refs.loadingModal.show()
    getLang();
    if (method === 'simple') {
      setSimpleRegs(true)
    }

    //dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true));
    // dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: 1 });


    if (promo || share) {
      if (this.refs.promoText && promo) {
        this.refs.promoText.value = promo;
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
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedPrograms } = nextProps
    // if (nextProps.selectedPrograms !== this.props.selectedPrograms) {
    //   dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))
    // }

    if (nextProps.sign.isLoadingLang !== this.props.sign.isLoadingLang) {
      if (!nextProps.sign.isLoadingLang) {
        this.refs.loadingModal.hide()
      }
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

    if (typeInfo === 'tester') {

      this.props.dispatch({
        type: 'REMOVE_TESTER_INFO_ITEM',
        index
      })

    }

    if (typeInfo === 'tele2') {
      this.props.dispatch({
        type: 'REMOVE_TELE2_INFO_ITEM',
        index
      })
    }


  }

  render() {
    let { dispatch, amount, packageType, promo, emailFriend, program, share, sign, lang,
      phoneFriend, nameFriend, choosenPackageType, choosenTomorrowType, abtest, errorsValidate } = this.props
    const { setToken, signup, testerInfoBlocks } = this.props;
    const { isTest, showInfoBlock, isTele2, tele2InfoList } = abtest;
    const { card, key, code, service, invite } = this.props.location.query;
    const { isLoadingLang } = sign;
    const { error } = errorsValidate;
    const isTele2Lk = domen.isTele2;
    const isUnipro = domen.isUnipro;
    let bg = defaultBg;
    // const headerABTest = <div>
    //   <p>Регистрируйся сейчас и сразу</p>
    //   <p>получишь в подарок эффективные</p>
    //   <p>и простые лайфхаки для</p>
    //   <p>идеальной фигуры!</p>
    // </div>;

    //let programName;
    //let headerStyle;
    //const tester = cookie.load('tester')

    //amount = amount ? amount : 0;

    // if ((!programs || !programs[0]) && this.props.programs && this.props.programs[0]) {
    //   programs = this.props.programs
    // }
    //
    // if (!programs || !programs[0]) {
    //   return (<LoadingView  isUnipro={isUnipro} isTele2Lk={isTele2Lk} isAlfa={isAlfa} title="Загружается..."/>)
    // }

    // const packageTypes = tester ? [{ name: 'Тестер', isActive: false, number: 4 }] : [
    //   { name: '1 человек', isActive: false, number: 1 },
    //   { name: '1 ЧЕЛОВЕК + ФИТНЕС-БРАСЛЕТ', isActive: false, number: 5 },
    //   { name: '1 ЧЕЛОВЕК + КОВРИК', isActive: false, number: 6 },
    //   { name: '2 человека', isActive: false, number: 2, half:true },
    //   { name: '3 человека', isActive: false, number: 3, half:true },
    //   { name: 'Понедельный', isActive: false, number: 7 }
    // ];

    // if (!tester) {
    //   packageTypes.map(element => {
    //     if (element.number === choosenPackageType) {
    //       element.isActive = true
    //     }
    //     return element
    //   })
    // }

    // const tomorrowTypes = [
    //   { name: 'Себе', isActive: false, number: 1 },
    //   { name: 'Другу', isActive: false, number: 2 }
    // ];

    ///tomorrowTypes[choosenTomorrowType - 1].isActive = true;

    // switch (program) {
    //   case programs[0].id:
    //     programName = '#ДЛЯ НОВИЧКОВ';
    //     headerStyle = styles.entryHeaderHero;
    //     break;
    //   case programs[1].id:
    //     programName = '#ДЛЯ МОЛОДЫХ МАМ';
    //     headerStyle = styles.entryHeaderMother;
    //     break;
    //   case programs[2].id:
    //     programName = '#ДЛЯ ПРОДВИНУТЫХ СПОРТСМЕНОВ';
    //     headerStyle = styles.entryHeaderExtreme;
    //     break;
    //   case programs[3].id:
    //     programName = '#Я ЗАВТРА';
    //     headerStyle = styles.entryHeaderTomorrow;
    //     break;
    //   default:
    //     switch (this.props.params.program) {
    //       case 'teztour':
    //         programName = 'TEZ-TOUR';
    //         cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    //         break;
    //       case 'alfazdrav':
    //         programName = 'АЛЬФА ЦЕНТР ЗДОРОВЬЯ';
    //         cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    //         break;
    //       case 'smclinic':
    //         programName = 'СМ-КЛИНИКА';
    //         cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    //         break;
    //       case 'avilon':
    //         programName = 'AVILON';
    //         cookie.save('partner', programName, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    //         break;
    //       default:
    //         programName = 'ЯСЕГОДНЯ';
    //     }
    // }
    //
    // if (program === programs[3].id && amount === 0) {
    //   amount = 2500
    // }

    const userCreate = payload => {

      payload.card = card ? card : null;
      payload.key = key ? key : null;
      payload.code = code ? code : null;
      payload.service = service ? service : null;

      if (invite) {
        const mlmRegPartnerId = ~~invite;
        if (mlmRegPartnerId > 0) {
          payload.mlmUserInfo = { mlmRegPartnerId };
        }
      }

      //if (!isFetching) {
      isFetching = true
      //signup('default', undefined, packageType, promo, email, share, phoneFriend, nameFriend)
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
            //const ga = window.ga
            //const fbq = window.fbq
            //const yaCounter = window.yaCounter41402064
            // switch (json.data.program) {
            //   case programs[0].id:
            //    // ga('send', 'event', 'user', 'successful_registration', 'hero')
            //     //ga('send', 'pageview', '/virtual/successful_registration/hero/')
            //     //yaCounter && yaCounter.reachGoal('successful_registration_hero')
            //     cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            //     break
            //   case programs[1].id:
            //    // ga('send', 'event', 'user', 'successful_registration', 'mama')
            //     //ga('send', 'pageview', '/virtual/successful_registration/mama/')
            //    // yaCounter && yaCounter.reachGoal('successful_registration_mama')
            //     cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            //     break
            //   case programs[2].id:
            //     //ga('send', 'event', 'user', 'successful_registration', 'extreme')
            //     //ga('send', 'pageview', '/virtual/successful_registration/extreme/')
            //     //yaCounter && yaCounter.reachGoal('successful_registration_extreme')
            //     cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            //     break
            //   case programs[3].id:
            //     //ga('send', 'event', 'user', 'successful_registration', 'tomorrow')
            //     //ga('send', 'pageview', '/virtual/successful_registration/tomorrow/')
            //     //yaCounter && yaCounter.reachGoal('successful_registration_tomorrow')
            //     cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            //     break
            //   default:
            //     break
            // }
            //   if (program && program !== -1) {
            //     cookie.save('program', program, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
            //     dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: program })
            //   }
            //   if(sign.isSimpleRegs){
            //     browserHistory.push('/')
            //     return;
            //   }
            browserHistory.push('/profile')
            //browserHistory.push('/signup/pay')
          } else if (json.errorCode === 129) {
            this.refs.errorEmailModal.show()
          } else if (json.errorCode === 128) {
            this.refs.errorTeamModal.show()
          } else if (json.errorCode === 2) {
            this.refs.errorEmailModal.show()
          } else {
            this.refs.errorModal.show()
            throw new SubmissionError({
              password: '',
              _error: 'Что-то пошло не так, возможно такой email уже существует'
            })
          }
        })
      //}
    }
    if (isAlfa) {
      document.body.style.backgroundColor = "#213349"
    }

    // if (!isLoadingLang) {
    //   return <div>sdf</div>;
    // }

    return (
      <div className={classNames(styles.layoutEntry, {
        [styles.alfaBgMobile]: isAlfa
      })}>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/unipro.css" />
          <title>{title}</title>
          <link rel="icon" type="image/png" href={fav16} sizes="32x32" />
          <link rel="icon" type="image/png" href={fav32} sizes="16x16" />
          <meta name="apple-mobile-web-app-title" content={title} />
          <meta name="application-name" content={title} />
        </Helmet>
        < EntryCarousel />
        <div className={styles.gridEntry}>
          <div className={classNames(styles.gridEntryHeader, {
            [styles.center]: isAlfa
          })}>
            <div className={styles.deskGridCellTodaymeLogo14}>
              <LogoLink isUnipro={isUnipro} />
            </div>

          </div>

          <div className={classNames(styles.entryMin, {
            [styles.alfa]: isAlfa
          })}>
            <div className={styles.entryInner}>
              <div className={styles.entryHeader}>
                <h2 className={classNames(styles.entryHeaderTitle, {

                })}>
                  {dict[lang]['regs.registration']}
                </h2>
              </div>

              {isTele2 && showInfoBlock
                ? <ul className={styles.notify}>
                  {tele2InfoList.map((item, index) => (
                    <li
                      className={styles.notifyItem}
                      key={item.id}
                    >
                      <div onClick={() => this.closeNotify(item.id, 'tele2')} className={styles.notifyClose}>
                        <svg className={'svg-icon ' + styles.notifyCloseIcon}>
                          <use xlinkHref={'#ico-close'} />
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
                  <h3 className={styles.textTitleCenter}><p>Регистрация в Alfa Energy окончена.</p><p>Если вы не успели, но очень хотите к нам, вам нужно написать по адресу: alfaenergy@todayme.ru</p></h3>
                  <div className='text-center' >
                    <Link className={styles.btnClose} to="/">Войти</Link>
                  </div>
                </div>
                :
                <SignupValidationForm
                  lang={lang}
                  isTest={isTest}
                  email={this.props.location.query.email}
                  serviceIsFamily={service === 'family'}
                  onSubmit={data => {
                    console.log(data)
                    console.log('dataaaaa')
                    Object.keys(data.users).forEach(obj => {
                      let email = data.users[obj].email
                      let password = data.users[obj].password
                      let gender = data.users[obj].gender
                      let lang = R.path(['lang', 'value'], data.users[obj]) || cookie.load('AA.lang')
                      console.log(lang)
                      let city
                      if (data.users[obj].city) {
                        city = data.users[obj].city.label
                      }
                      let customUserFields = {
                        workTeam: data.users[obj].workTeam,
                        workRelation: data.users[obj].workRelation ? data.users[obj].workRelation : null,
                        workCard: data.users[obj].workCard ? data.users[obj].workCard : null,
                      }
                      let payload = { email, password, lang };
                      const name = this.props.location.query.name;

                      if (name) {
                        payload.firstName = name
                      }

                      // if (program && program !== -1) {
                      //   payload.program = program
                      // }

                      if (packageType) {
                        payload.package = packageType
                      }

                      userCreate(payload)
                    })
                  }}
                />
              }

            </div>
          </div>
        </div>

        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
        <Modal ref='errorModal' contentStyle={contentStyle}>
          <h2>{dict[lang]['regs.smthWrong']}</h2>
          <br />
          <button className={styles.btnAction} onClick={() => this.refs.errorModal.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
        <Modal ref='errorFriendModal' contentStyle={contentStyle}>
          <h2>Данные о друге заполнены не полностью</h2>
          <br />
          <button className={styles.btnAction} onClick={() => this.refs.errorFriendModal.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
        <Modal ref='errorEmailModal' contentStyle={contentStyle}>
          <div style={{ textAlign: 'center' }}>
            <h2>{dict[lang]['regs.emailIsRegs.1']}</h2>
            <br />
            {dict[lang]['regs.emailIsRegs.2']}  <br />
            <Link className={styles.entryNavLink} to="/">{dict[lang]['regs.emailIsRegs.3']}</Link> <br />
            {dict[lang]['regs.emailIsRegs.4']}<br />
            <Link className={styles.entryNavLink} to="/restore">{dict[lang]['regs.emailIsRegs.5']}</Link> <br />
            <button className={styles.btnAction} onClick={() => this.refs.errorEmailModal.hide()}>
              {dict[lang]['regs.continue']}
            </button>
          </div>
        </Modal>
        <Modal ref='errorTeamModal' contentStyle={contentStyle}>
          <h2>К этой группе уже присоединилось максимальное количество участников</h2>
          <br />
          <button className={styles.btnAction} onClick={() => this.refs.errorTeamModal.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
        <Modal ref='errorPromoModal' contentStyle={contentStyle}>
          <h2>Промокод недействителен</h2>
          <br />
          <button className={styles.btnAction} onClick={() => this.refs.errorPromoModal.hide()}>
            {dict[lang]['regs.continue']}
          </button>
        </Modal>
      </div>
    )
  }
}

ProfileSignup = reduxForm({
  form: 'signupValidation'
})(ProfileSignup)

const selector = formValueSelector('signupValidation')

const mapStateToProps = state => {
  const { selectedPrograms, recivedPrograms, profile, choosenPackageType,
    choosenAmount, choosenPromo, choosenTomorrowType, abtest, errorsValidate, testerInfoBlocks, sign, lang } = state

  let { program = 'default', packageType, promo, amount, share } = profile

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

  const { programs } = recivedPrograms[selectedPrograms] || [];

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
    programs,
    lang
  }
};

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch),
  checkABTest: bindActionCreators(actions.checkABTest, dispatch),
  signUpTele2: bindActionCreators(actions.signUpTele2, dispatch),
  showInfoBlockAction: bindActionCreators(actions.showInfoBlockAction, dispatch),
  setSimpleRegs: bindActionCreators(actions.setSimpleRegs, dispatch),
  getLang: bindActionCreators(actions.getLang, dispatch),
});

ProfileSignup = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSignup);

export default CSSModules(ProfileSignup, styles)
