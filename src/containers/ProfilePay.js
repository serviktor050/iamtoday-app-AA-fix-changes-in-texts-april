import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { api, host } from '../config.js'
import LoadingView from '../components/componentKit/LoadingView'
import { reduxForm, formValueSelector } from 'redux-form'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import { promoVisit } from '../actions/promo/promoWatch'
import md5 from 'md5'
import shortid from 'shortid'
import CSSModules from 'react-css-modules'
import styles from './profilePay.css'
import LogoLink from '../components/componentKit/LogoLink'
import BackgroundTester from '../components/componentKit2/BackgroundTester'
import { programsData } from '../utils/data'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

let manualFetching = false

/**
 *  Контейнер ProfilePay.
 *  Используется для отображения страницы 'Регистрация' (/signup/pay)
 *
 */
class ProfilePay extends Component {
  /**
   * @memberof ProfilePay
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {string} propTypes.paymentType Тип платежа
   * @prop {string} propTypes.choosenPromo Промокод
   * @prop {object} propTypes.choosenAmount Данные по выбранному пакету
   * @prop {array} propTypes.testerInfoBlocks Инфоблок
   * @prop {string} propTypes.selectedPayment Выбранный платеж
   *
   * */
  static propTypes = {
    payment: PropTypes.object.isRequired,
    paymentType: PropTypes.string.isRequired,
    choosenPromo: PropTypes.string.isRequired,
    choosenAmount: PropTypes.object.isRequired,
    testerInfoBlocks: PropTypes.array.isRequired,
    selectedPayment: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  componentWillMount() {
    manualFetching = false
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    const { dispatch, selectedPayment } = this.props
    dispatch(actions.fetchPaymentIfNeeded(selectedPayment))

    const abtest = cookie.load('abtest')
    if(abtest && abtest.length){
      this.props.checkABTest()
    }
  }

  componentDidMount() {
    let { dispatch, program, packageType, promo, share, receivePayment, abtest, sign } = this.props

    if (this.props.location.query && this.props.location.query.fail) {
      let payload = {
        authToken: cookie.load('token'),
        data: {
          program: program && program !== 'undefined' ? program : programsData.hero,
          package: packageType && packageType !== 'undefined' ? packageType : '1',
          isShare: share && share !== 'undefined' ? share : false
        }
      }

      if (promo) {
        payload.data.promoName = promo
      }

      if (promoVisit.getPromoSessionId()) {
        payload.data.promoSession = promoVisit.getPromoSessionId()
      }

      payload.data.carrotquestUid = `carrotquest_uid:${cookie.load('carrotquest_uid')};_ym_uid:${cookie.load('_ym_uid')};_ga_cid:${cookie.load('_ga_cid')};partner:${cookie.save('partner') ? cookie.save('partner') : 'none'}`

      let data = new FormData()
      data.append('json', JSON.stringify(payload))

      return fetch(`${api}/payment/payment-create`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(json => {
        if (json.errorCode === 1 && json.data) {
          dispatch(receivePayment('reactjs', json))
          browserHistory.push('/signup/pay')
        }
      })
    }

    const ga = window.ga
    const fbq = window.fbq
    const yaCounter = window.yaCounter41402064
    let linkHero = '/signup/hero/' + (abtest.isTest ? 'a' : '')
    let linkMama = '/signup/mama/' + (abtest.isTest ? 'a' : '')
    let linkExtreme = '/signup/extreme/' + (abtest.isTest ? 'a' : '')
    let linkTomorrow = '/signup/tomorrow/' + (abtest.isTest ? 'a' : '')

    switch (program) {
      case programsData.hero:
        ga('send', 'event', 'user', 'step2', 'hero')
        ga('send', 'pageview', linkHero)
        yaCounter && yaCounter.reachGoal('step2_hero')
        break
      case programsData.mommy:
        ga('send', 'event', 'user', 'step2', 'mama')
        ga('send', 'pageview', linkMama)
        yaCounter && yaCounter.reachGoal('step2_mama')
        break
      case programsData.extreme:
        ga('send', 'event', 'user', 'step2', 'extreme')
        ga('send', 'pageview', linkExtreme)
        yaCounter && yaCounter.reachGoal('step2_extreme')
        break
      case programsData.tomorrow:
        ga('send', 'event', 'user', 'step2', 'tomorrow')
        ga('send', 'pageview', linkTomorrow)
        yaCounter && yaCounter.reachGoal('step2_tomorrow')
        break
      default:
    }
    fbq('track', 'step2')



  }

  componentDidUpdate() {
    const { payment, dispatch, userInfo } = this.props
    if (payment && payment.data && payment.data.amount === 0) {
      const interval = setInterval(() => {
        if (this.refs.loadingModal && !manualFetching) {
          manualFetching = true
          this.refs.loadingModal.show()
          const payload = {
            authToken: cookie.load('token'),
            data: {
              txId: payment.data.txId
            }
          }

          return fetch(`${api}/payment/payment-setpaid-manual`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(json => {
            this.refs.loadingModal.hide()
            clearInterval(interval)
            manualFetching = false
            if (json.errorCode === 1 && json.data) {
              if (payment.data.program === 16) {
                if (payment.data.tomorrowManEmails[0].email) {
                  dispatch({ type: 'PAYMENT_TYPE', paymentType: 'successFriend' })
                  browserHistory.push(`/signup/pay/friend?simple=true`)
                } else {
                  browserHistory.push(`/signup/pay/friend?amount=${payment.data.amount}`)
                }
              } else if(userInfo.data.paidAmount === 4) {
                browserHistory.push('/task')
              } else {
                browserHistory.push('/signup/pay/success')
              }
            }
          })
        } else {
          clearInterval(interval)
        }
      }, 3000)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedPayment !== this.props.selectedPayment) {
      const { dispatch, selectedPayment } = nextProps
      dispatch(actions.fetchPaymentIfNeeded(selectedPayment))
    }
  }

  closeNotify(index) {
    this.props.dispatch({
      type:'REMOVE_TESTER_INFO_ITEM',
      index
    })
  }

  render() {
    const { payment, isFetching, paymentType, abtest, choosenAmount, choosenPromo,
      testerInfoBlocks, sign } = this.props
    const {payWeekly} = sign
    let programName
    let nameStyle
    let packageName
    let data
    const { isTest, showInfoBlock, isTele2, tele2InfoList } = abtest

    let { dispatch, program, amount } = this.props

    const tester = cookie.load('tester')
    const isEmpty = payment === undefined || payment.data === undefined


    if (!isEmpty && payment.data && payment.data.txId) {
      amount = payment.data.amount

      if (!cookie.load('general')) {
        program = payment.data.program
      }

      switch (payment.data.program) {
        case programsData.hero:
          programName = '#Я ГЕРОЙ'
          nameStyle = styles.entryHeaderColorfulHero
          break
        case programsData.mommy:
          programName = '#МАМА МОЖЕТ'
          nameStyle = styles.entryHeaderColorfulMother
          break
        case programsData.extreme:
          programName = '#ЭКСТРЕМАЛЬНАЯ СУШКА'
          nameStyle = styles.entryHeaderColorfulExtereme
          break
        case programsData.tomorrow:
          programName = '#Я ЗАВТРА'
          nameStyle = styles.entryHeaderColorfulTomorrow
          break
        default:
          programName = '#Я ГЕРОЙ'
          break
      }

      switch (payment.data.package + '') {
        case '1':
          packageName = payment.data.program + '' === 16 ? 'Подарок другу' : '1  человек'
          break
        case '2':
          packageName = '2  человека'
          break
        case '3':
          packageName = '3  человека'
          break
        case '5':
          packageName = '1 ЧЕЛОВЕК + ФИТНЕС-БРАСЛЕТ'
          break
        case '6':
          packageName = '1 ЧЕЛОВЕК + КОВРИК'
          break
        case '7':
          packageName = 'Понедельный'
          break
        default:
          packageName = 'Не выбран'
      }

      if (amount > 0) {
        data = {
          parent_id: 'iframe_parent',
          api_key: '57d156d0-dacf-464d-bcd3-c7f01b0c1a35',
          tx_id: payment.data.txId,
          description: `Платеж по программе ${programName}`,
          amount: payment.data.amount * 100,
          signature: '',
          success_redirect: payment.data.program === 16 ? `${host}/signup/pay/friend` : `${host}/signup/pay/success?frompay=true`,
          fail_redirect: `${host}/signup/pay?fail=true`,
          rebill: {},
          extra: {},
          version: '2.0.0'
        }

        window.PaymoFrame.set(data)
      }
    }

    const payManual = () => {
      if (!manualFetching) {
        manualFetching = true
        this.refs.loadingModal.show()
        const payload = {
          authToken: cookie.load('token'),
          data: {
            txId: payment.data.txId
          }
        }

        return fetch(`${api}/payment/payment-setpaid-manual`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(json => {
          this.refs.loadingModal.hide()
          manualFetching = false
          if (json.errorCode === 1 && json.data) {
            if (payment.data.program === 16) {
              if (payment.data.tomorrowManEmails[0].email) {
                dispatch({ type: 'PAYMENT_TYPE', paymentType: 'successFriend' })
                browserHistory.push(`/signup/pay/friend?simple=true`)
              } else {
                browserHistory.push(`/signup/pay/friend?amount=${payment.data.amount}`)
              }
            } else {
              browserHistory.push('/signup/pay/success')
            }
          }
        })
      }
    }

    return (
      <div className={styles.layoutRegistration}>
        {isEmpty
          ? (isFetching ? <LoadingView title="Загружается..."/> : <LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех поддержки (внизу справа)"/>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>

            <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="assets/img/symbol-sprite.svg"/>

            <div className={styles.layoutEntry}>
              <div className={styles.gridEntryHeader}>
                <div className={styles.deskGridCellTodaymeLogo14}>
                  <LogoLink isTest={isTest}/>
                </div>
                <div className={styles.deskGridCellTextCenter24}>
                  <div className={styles.entryStep}>
                    <span className={styles.entryStepTitle}>Шаг</span>
                    <span className={styles.entryStepNo}>{paymentType === 'pm' ? '#4' : '#3'}</span>
                    <span className={styles.entryStepGoto}>{ isTest ? 'из 4' : 'из 6'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.entryMin}>
                <div className={styles.entryInner}>

                  {paymentType !== 'pm' &&
                    <div>
                      <div className={nameStyle}>
                        {!isTest ? <h2 className={styles.entryTitleCenter} style={{ color: '#fff' }}>{programName}</h2> :
                          <h2 className={styles.entryTitleCenter}>
                            <p>Поздравляем!</p>
                            <p>Сделай финальный шаг и стартуем</p>
                            <p>12 июня</p>
                          </h2>
                        }
                      </div>

                      {program !== 16 && <p className={styles.entryPackageName}>{packageName}</p>}

                      {tester && showInfoBlock
                        ? <ul className={styles.notify}>
                          {testerInfoBlocks.map((item, index) => (
                            <li
                              className={styles.notifyItem}
                              key={index}
                            >
                             <div onClick={() => this.closeNotify(index)} className={styles.notifyClose}>
                               <svg className={'svg-icon ' +styles.notifyCloseIcon}>
                                 <use xlinkHref={'#ico-close'}/>
                               </svg>
                             </div>
                             <p>{item}</p>
                            </li>
                          ))}
                        </ul>
                        : null
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

                      {!isTest ?
                        <p className={styles.entryProgramPriceHighlightMd30}>{payment.data.amount} руб.</p>
                        :
                        (<div className={styles.entryPricePay}>
                          { !choosenPromo.length ? <p className={styles.entryProgramPrice}>{payment.data.amount} руб.</p> :
                            <div className={styles.entryPricePayFlex}>
                              { choosenPromo.length ? <div className={styles.entryPricePayItem}>{payment.data.amount} руб.</div> : null}
                              <strike className={styles.entryPricePayItem}>{choosenAmount.oldPrice} руб.</strike>
                            </div>}
                        </div>)
                      }

                      { !isTest ? <h3 className={styles.textCenterMd20}>Выберите способ оплаты:</h3> :
                      <h3 className="text-center mb20"> Выбери и нажми на удобный способ оплаты:</h3>}

                    </div>
                  }

                  {amount > 0
                    ? paymentType === 'pm'
                      ? <div className={styles.optionsWithImgWideMb20}>
                          <br/>
                          <div className={styles.entryPaymentSystemMb20}>
                            <span id="iframe_parent"/>
                          </div>

                          <div className={styles.entryBox}>
                            <div className={styles.buttonSecondaryWide}
                              style={{ width: '200px' }}
                              onClick={() => {
                              dispatch({ type: 'PAYMENT_TYPE', paymentType: 'ya' })

                              }}>
                                Вернуться на шаг назад
                            </div>
                          </div>
                        </div>
                      : paymentType === 'success'
                        ? <div className={styles.entryBox}>
                            <div className={styles.entryIcoBox}>
                              <img className={styles.entryIcoBoxImg} src="/assets/img/ico-success.svg" alt=""/>
                              <p className={styles.entryIcoBoxTitle}>Оплачен!</p>
                            </div>

                            <div className={styles.buttonSecondaryWide} onClick={() => {
                              if (payment.data.program === 16) {
                                if (payment.data.tomorrowManEmails[0].email) {
                                  dispatch({ type: 'PAYMENT_TYPE', paymentType: 'successFriend' })
                                  browserHistory.push(`/signup/pay/friend?simple=true`)
                                } else {
                                  browserHistory.push(`/signup/pay/friend?amount=${payment.data.amount}`)
                                }
                              } else {
                                browserHistory.push('/profile')
                              }
                            }}>
                              Продолжить
                            </div>
                          </div>
                        : <div className={styles.entryBox}>
                            <ul className={styles.optionsWithImgWideMb20}>
                              <li className={styles.optionsItem}>
                                <form id="yaForm" action="https://money.yandex.ru/eshop.xml" target="_blank" method="POST">
                                  <input name="shopId" value="91439" type="hidden"/>
                                  <input name="scid" value="85330" type="hidden"/>
                                  <input name="customerNumber" value={shortid.generate()} type="hidden"/>
                                  <input name="sum" value={amount} type="hidden"/>
                                  <input name="orderNumber" value={payment.data.txId} type="hidden"/>
                                  <input name="paymentType" value="" type="hidden"/>
                                  <img className={styles.icoYandexkassa} src="/assets/img/png/pay/yandexkassa.png" alt="" onClick={() =>
                                    document.querySelector('#yaForm').submit()
                                  }/>
                                </form>
                              </li>
                              <li className={styles.optionsItem}>
                                <form id="robokassaForm" action='https://auth.robokassa.ru/Merchant/Index.aspx' target="_blank" method="POST">
                                 <input type="hidden" name="MrchLogin" value="todayme"/>
                                 <input type="hidden" name="OutSum" value={amount}/>
                                 <input type="hidden" name="Desc" value="Text description"/>
                                 <input type="hidden" name="SignatureValue" value={md5(`todayme:${amount}::OvBWnr3F02XOgu5VB9OH:shp_txid=${payment.data.txId}`)}/>
                                 <input type="hidden" name="shp_txid" value={payment.data.txId}/>
                                 <input type="hidden" name="Culture" value="ru"/>
                                 {/* <input type="hidden" name="IsTest" value={1}/> */}
                                 <img className={styles.icoRobokassa} src="/assets/img/png/pay/robokassa.png" alt="" onClick={() =>
                                   document.querySelector('#robokassaForm').submit()
                                 }/>
                                </form>
                              </li>
                              <li className={styles.optionsItem}>
                                <img className={styles.icoPaymo} src="/assets/img/png/pay/paymo.png" alt="" onClick={() => {
                                  dispatch({ type: 'PAYMENT_TYPE', paymentType: 'pm' })
                                  window.PaymoFrame.set(data)
                                }}/>
                              </li>
                            </ul>

                            <ul className={styles.entryNav}>
                              <li className={styles.entryNavItem}>
                                <Link to="/signup/params">Вернуться на шаг назад</Link>
                              </li>
                            </ul>

                            <ul className={styles.entryNav}>
                              <li className={styles.entryNavItem}>
                                <a href="#" onClick={e => {
                                  e.preventDefault()
                                  cookie.remove('token', { path: '/' })
                                  cookie.remove('abtest',{ path: '/' })
                                  cookie.remove('txId', { path: '/' })
                                  cookie.remove('role', { path: '/' })
                                  cookie.remove('program', { path: '/' })
                                  cookie.remove('packageType', { path: '/' })
                                  cookie.remove('promoName', { path: '/' })
                                  cookie.remove('share', { path: '/' })
                                  //cookie.remove('general', { path: '/' })
                                  cookie.remove('tester', { path: '/' })
                                  cookie.remove('abtest', { path: '/' })

                                  browserHistory.push('/')
                                  if(payWeekly){
                                    this.props.setPayWeekly(false)
                                  }
                                  //window.location.href = '/'
                                }}>Выйти</a>
                              </li>
                            </ul>
                          </div>
                    : <div className={styles.entryBox}>
                        <div className={styles.entryIcoBox}>
                          <img className={styles.entryIcoBoxImg} src="/assets/img/ico-freebie.svg" alt=""/>
                          <p className={styles.entryIcoBoxTitle}>Халява!</p>
                        </div>

                        <div className={styles.buttonSecondaryWide} onClick={() => {
                          payManual()
                        }}>
                          Продолжить
                        </div>
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
                  <Modal ref='successModal' contentStyle={contentStyle}>
                    <h2>Изменения сохранены</h2>
                    <br/>
                    <button className={styles.btnAction} onClick={() => this.refs.successModal.hide()}>
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
                    <h2>Промокод недействителен</h2>
                    <br/>
                    <button className={styles.btnAction} onClick={() => this.refs.errorPromoModal.hide()}>
                      Продолжить
                    </button>
                  </Modal>
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
            </div>
          </div>
        }
      </div>
    )
  }
}

ProfilePay = reduxForm({
  form: 'payCreateValidation'
})(ProfilePay)

let selector = formValueSelector('payCreateValidation')

const mapStateToProps = state => {
  const { selectedPayment, recivedPayment, userToken, profile, paymentType, abtest, choosenPromo,
    choosenProgramName, choosenAmount, testerInfoBlocks, sign, userInfo } = state
  let { program, amount, packageType, promo, share } = profile

  const {
    isFetching,
    lastUpdated,
    payment
  } = recivedPayment[selectedPayment] || {
    isFetching: true,
    payment: {}
  }

  if (selector(state, 'program')) {
    program = selector(state, 'program')
  }

  if (selector(state, 'packageType')) {
    packageType = program === 16 ? 1 : selector(state, 'packageType')
  }

  if (selector(state, 'promo')) {
    promo = selector(state, 'promo')
  }

  return ({
    testerInfoBlocks,
    sign,
    userInfo,
    paymentType,
    selectedPayment,
    isFetching,
    lastUpdated,
    payment,
    choosenPromo,
    choosenAmount,
    choosenProgramName,
    program,
    abtest,
    amount,
    packageType,
    promo,
    share,
    token: userToken.token
  })
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  checkABTest: bindActionCreators(actions.checkABTest, dispatch),
  setPayWeekly: bindActionCreators(actions.setPayWeekly, dispatch),
  receivePayment: bindActionCreators(actions.receivePayment, dispatch)
})

ProfilePay = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePay)

export default CSSModules(ProfilePay, styles)
