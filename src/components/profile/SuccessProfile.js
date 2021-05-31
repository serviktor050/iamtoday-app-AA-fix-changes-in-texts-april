import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoadingView from '../componentKit/LoadingView'
import { bindActionCreators } from 'redux'
import cookie from 'react-cookie'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import emoji from 'react-easy-emoji'
import Clipboard from 'clipboard'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './successProfile.css'
import LogoLink from '../componentKit/LogoLink'
import BackgroundTester from '../componentKit2/BackgroundTester'
import { programsData } from '../../utils/data'
import { api, domen } from '../../config.js'
import classNames from 'classnames';
import {Helmet} from "react-helmet";
import { title, fav16, fav32 } from 'utils/helmet';

import {
    ShareButtons,
    // ShareCounts,
    generateShareIcon
} from 'react-share'

let src = "/assets/img/antiage/bg.jpg";
const isAlfa = domen.isAlfa;
if(isAlfa){
    src = "/assets/img/alfa/alfa-energy.jpg";
}
const defaultBg = <img className={styles.alfaBg} src={src} alt=""/>

const {
  FacebookShareButton,
  // GooglePlusShareButton,
  // LinkedinShareButton,
  // TwitterShareButton,
  // PinterestShareButton,
  VKShareButton
} = ShareButtons

// const {
//     FacebookShareCount,
//     GooglePlusShareCount,
//     LinkedinShareCount,
//     PinterestShareCount
//     } = ShareCounts

const FacebookIcon = generateShareIcon('facebook')
const VKIcon = generateShareIcon('vk')

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}


const description = `задолбалась: Ага, ты, значит, тренируешься с #ЯСЕГОДНЯ,
а твои друзья так ничего и не знают?! Не надо так! У нас есть клевые лайфхаки,
как качать пресс и булки, сидя в пробке. Расскажи про них друзьям, а мы продлим
прием твоего экзамена. Можешь присылать Видео до конца воскресенья! Идет?
Сидя в машине, напряги мышцы ягодиц. Задержи это положение на 2-3 сек., потом расслабься.
Повтори 15 раз. А тренировать пресс помогут дыхательные упражнения.
Их тоже легко выполнять в авто. Сложи губы в трубочку и выдыхай быстро и отрывисто.
В этот момент будет напрягаться твой пресс.
#ЯСЕГОДНЯ #фитнесмарафон #спорт #здоровье #тренировки #диета #полезное #третий_сезон #призы`



/**
 *  Компонент SuccessProfile.
 *  Используется для вывода последнего шага регистрации
 *
 */
class SuccessProfile extends Component {
  /**
   * @memberof  SuccessProfile
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.fetchFinalSteps Получение данных с сервера для последнег шага реги
   * @prop {object} propTypes.payment Данные по оплате
   * @prop {object} propTypes.sign Объект данных реги
   *
   * */

  static propTypes = {
    fetchFinalSteps: PropTypes.func.isRequired,
    payment: PropTypes.object.isRequired,
    sign: PropTypes.object.isRequired
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }

    const { dispatch, selectedPayment, fetchFinalSteps } = this.props
    //dispatch(actions.fetchPaymentIfNeeded(selectedPayment, this.props.location.query.frompay))
      //dispatch(actions.fetchPromo(2))
    fetchFinalSteps()
      const script = document.createElement("script");
      script.src = "https://yastatic.net/share2/share.js"
      script.async = true

      document.body.appendChild(script)

  }

  componentDidMount() {
    const { payment, receivePayment} = this.props

    !function (d, id, did, st, title, description, image) {
      var js = d.createElement("script");
      js.src = "https://connect.ok.ru/connect.js";
      js.onload = js.onreadystatechange = function () {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          if (!this.executed) {
            this.executed = true;
            setTimeout(function () {
              window.OK.CONNECT.insertShareWidget(id,did,st, title, description, image);
            }, 0);
          }
        }};
      d.documentElement.appendChild(js);
    }(document,"ok_shareWidget","https://todayme.ru",'{"sz":45,"st":"oval","nc":1,"nt":1}',"","задолбалась: Ага, ты, значит, тренируешься с #ЯСЕГОДНЯ, а твои друзья так ничего и не знают?! Не надо так! У нас есть клевые лайфхаки, как качать пресс и булки, сидя в пробке. Расскажи про них друзьям, а мы продлим прием твоего экзамена. Можешь присылать Видео до конца воскресенья! Идет? Сидя в машине, напряги мышцы ягодиц. Задержи это положение на 2-3 сек., потом расслабься. Повтори 15 раз. А тренировать пресс помогут дыхательные упражнения. Их тоже легко выполнять в авто. Сложи губы в трубочку и выдыхай быстро и отрывисто. В этот момент будет напрягаться твой пресс. #ЯСЕГОДНЯ #фитнесмарафон #спорт #здоровье #тренировки #диета #полезное #третий_сезон #призы","https://lk2.todayme.ru/assets/img/png/bannerShow.jpg");

  }

  render() {
    const {
      dispatch,
      payment,
      isFetching,
      promoForYou, showPromos, abtest, sign, siteSettings, userInfo, setAuth, setSimpleRegs } = this.props
    const {finalSteps, isError, isLoading} = sign
    const isEmpty = !finalSteps.length //!payment || !payment.data
    const programNames = siteSettings && siteSettings.data && siteSettings.data.buyProgramNames;
  const isUnipro = domen.isUnipro
  const isTele2Lk = domen.isTele2

    let bg = defaultBg

    let programName = '#ДЛЯ НОВИЧКОВ'
    let packageName = '1 человек'
    let nameStyle = 'hero'
    let headerStyle
    headerStyle = styles.entryHeaderHero

    if (!isEmpty) {
     /* if (payment.data.program % 4 === 0) {
        if (payment.data.tomorrowManEmails[0].email) {
          dispatch({ type: 'PAYMENT_TYPE', paymentType: 'successFriend' })
          browserHistory.push(`/signup/pay/friend?simple=true`)
        } else {
          browserHistory.push(`/signup/pay/friend?amount=${payment.data.amount}`)
        }

        return <div/>
      }*/

      const program = userInfo.data.program
      //const packageType = payment.data.package

      switch (program) {
        case programNames[0].id:
          programName = programNames[0].name,
          nameStyle = 'hero'
          headerStyle = styles.entryHeaderHero
          break
        case programNames[1].id:
          programName =  programNames[1].name,
          nameStyle = 'mather'
          headerStyle = styles.entryHeaderMother
          break
        case programNames[2].id:
          programName =  programNames[2].name,
          nameStyle = 'extreme'
          headerStyle = styles.entryHeaderExtreme
          break
        case programNames[3].id:
          programName = programNames[3].name,
          nameStyle = 'tomorrow'
          headerStyle = styles.entryHeaderTomorrow
          break
      /*  case programsData.family:
          programName = '#ВМЕСТЕ ВЕСЕЛЕЕ'
          nameStyle = 'tomorrow'
          headerStyle = styles.entryHeaderTomorrow*/

        default:
          break
      }
    }
    return (
        <div className={classNames({
            [styles.alfa]: isAlfa
        })}>

          <Helmet>
            <title>{title}</title>
            <link rel="icon" type="image/png" href={fav16} sizes="32x32" />
            <link rel="icon" type="image/png"  href={fav32} sizes="16x16" />
            <meta name="apple-mobile-web-app-title" content={title} />
            <meta name="application-name" content={title} />
          </Helmet>

        {isEmpty

          ? (isFetching || isLoading ? <LoadingView title="Загружается..."/> : <LoadingView title="Если вы видите это окно, значит возникла ошибка! Напишите нам на почту av@todayme.ru и опишите сложившуюся ситуацию."/>)

          : (this.props.location.query.frompay
            ? <div>
                <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="/assets/img/symbol-sprite.svg"/>
                <div className={classNames(styles.layoutEntry, {
                  [styles.alfa]: isAlfa
                })}>
                  <div className={styles.gridEntryHeader}>
                    <div className={styles.deskGridCellTodaymeLogo14}>
                      <LogoLink isUnipro={isUnipro} />
                    </div>
                    <div className={styles.deskGridCellTextCenter24}>

                      {!abtest.isTest ?
                        <div className={styles.entryStep}>
                          <span className={styles.entryStepTitle}>Шаг</span>
                          <span className={styles.entryStepNo}>#5</span>
                          <span className={styles.entryStepGoto}>из 6</span>
                        </div> : null}
                    </div>
                  </div>

                  <div className={styles.entryMin}>
                    <div className={styles.entryInner}>
                        <div className={headerStyle}>
                        <h2 className={styles.entryTitleCenter}>{programName}</h2>
                      </div>

           {/*           <p className={styles.entryPackageName}>{packageName}</p>*/}
                      <p className={styles.entryProgramPriceHighlightMd30}>{payment.data.amount} руб.</p>

                      <div className={styles.entryBox}>
                        <div className={styles.entryIcoBox}>
                          <img className={styles.entryIcoBoxImg} src="/assets/img/ico-success.svg" alt=""/>
                          <p className={styles.entryIcoBoxTitle}>Оплачен!</p>
                        </div>

                        <div className={styles.buttonSecondaryWide} onClick={() => {
                            browserHistory.push('/signup/pay/success')
                        }}>
                          Продолжить
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.entryBg}>
                    {bg}
                  </div>
                </div>
              </div>
            : <div>
                <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="assets/img/symbol-sprite.svg"/>
                <div className={styles.layoutEntry}>
                  <div className={styles.gridEntryHeader}>
                    <div className={styles.deskGridCellTodaymeLogo14}>
                      <LogoLink isUnipro={isUnipro} />
                    </div>
                    <div className={styles.deskGridCellTextCenter24}>
                      <div className={isTele2Lk ? styles.entryStepTele2 : styles.entryStep}>
                        {!isAlfa ?
                          <div>
                            <span className={styles.entryStepTitle}>Шаг</span>
                            <span className={styles.entryStepNo}>{isAlfa || isTele2Lk || isUnipro ? '#3' : '#6'}</span>
                            <span className={styles.entryStepGoto}>{isAlfa || isTele2Lk || isUnipro ? 'из 3' : 'из 6'}</span>
                          </div> : null}
                      </div>
                    </div>
                  </div>

                  <div className={styles.entryWide}>
                    <div className={styles.entryInner}>

                        {!isAlfa && <div className={headerStyle}>

                        <h2 className={styles.entryTitleCenter}>{isAlfa ? 'Alfa Energy' : 'НаЗдоровье 2.0'}</h2>
                      </div>
                        }

                      <div>
                       {/* <p className={styles.entryPackageName}>{packageName}</p>*/}
                        <ul className={styles.notifyFormMb30}>
                          {finalSteps.length &&  !isError ? finalSteps.map((item, index) => {
                            return (
                              <li key={index + 1} className={styles.notifyItemSuccess}>
                                <div className={styles.notifyDesc}>
                                  <span className={styles.notifyNum}>{index + 1}</span>
                                  <span className={styles.notifyText} dangerouslySetInnerHTML={{__html: item}} />
                                </div>
                              </li>
                            )
                          })
                            : <li>
                              <div className={styles.textCenter}>Ошибка сервера</div>
                            </li>
                          }
                        </ul>

                        {promoForYou && promoForYou[0] && promoForYou[0].discount &&
                          <ul className={styles.promoTable}>
                            <li className={styles.promoTableItemColor1}/>
                            <li className={styles.promoTableItemColor1}>
                              <span className={styles.promoTableDiscount}>
                                <span>{promoForYou[0] ? JSON.parse(promoForYou[0].discount)[0].percent : '-'}</span>
                                <span>%</span>
                              </span>
                              <p className={styles.promoTableTitle}>без ограничений</p>

                              <div className={styles.promoTablePromoCodeWrap}>
                                <span className={styles.promoTablePromoCode}>
                                  <span className={styles.promoTableCode}>{promoForYou[0] ? promoForYou[0].promoName : '...'}</span>
                                </span>

                                <ul className={styles.promoTableBtns}>
                                  <li className={styles.btnSimple}>
                                    <span className={styles.btnSimpleIco}>
                                      <svg className={styles.svgIcoCopy}>
                                        <use xlinkHref="#ico-copy"></use>
                                      </svg>
                                    </span>
                                    <span ref="clipboardButton" className={styles.btnSimpleTitle} onClick={() => {
                                      this.refs.clipboardButton.innerText = 'Текст скопирован'
                                      const interval = setInterval(() => {
                                        if (this.refs.clipboardButton) {
                                          this.refs.clipboardButton.innerText = 'Копировать'
                                        }
                                        clearInterval(interval)
                                      }, 5000)
                                    }}>
                                      Копировать
                                    </span>
                                  </li>



                                    <ul className={!showPromos ? styles.socialSignin : styles.socialSigninShow}>
                                      <li className={styles.socialSigninItem}>
                                        <VKShareButton
                                          url={'https://todayme.ru'}
                                          image={'https://lk2.todayme.ru/assets/img/png/bannerShow.jpg'}
                                          className="Demo__some-network__share-button">
                                          <VKIcon
                                            size={47}
                                            round />
                                        </VKShareButton>
                                      </li>
                                      <li className={styles.socialSigninItem}>
                                        <div className={"ya-share2"}
                                             data-services="odnoklassniki"
                                             data-url="https://gohero.todayme.ru"
                                             data-image="https://lk2.todayme.ru/assets/img/png/bannerShow.jpg"
                                        ></div>
                                      </li>
                                      <li className={styles.socialSigninItemLast}>
                                        <FacebookShareButton
                                          url={'https://todayme.ru'}
                                          description={description}
                                          picture={'https://lk2.todayme.ru/assets/img/png/bannerShow.jpg'}
                                          className="Demo__some-network__share-button">
                                          <FacebookIcon
                                            size={47}
                                            round />
                                        </FacebookShareButton>
                                      </li>
                                    </ul>

                                  {!isAlfa && !isTele2Lk && !isUnipro?
                                    <div className={!showPromos ? styles.btnSimple : styles.btnSimpleActive} onClick={() => dispatch({ type: 'SHOW_PROMOS', showPromos: !showPromos })}>
                                      <span className={styles.btnSimpleIco}>
                                        <svg className={styles.svgIcoShare}>
                                          <use xlinkHref="#ico-share"></use>
                                        </svg>
                                      </span>
                                      <span className={styles.btnSimpleTitle}>Поделиться</span>
                                    </div>
                                  : null}

                                </ul>
                              </div>
                            </li>
                            <li className={styles.promoTableItemColor1}/>
                          </ul>
                        }


                        <div className={styles.btnBlock}>
                          <span
                              className={classNames(styles.btnSecondary, {
                                [styles.alfaBgc] : isAlfa
                              })}
                              onClick={() => {
                            cookie.remove('token', { path: '/' })
                            cookie.remove('txId', { path: '/' })
                            cookie.remove('role', { path: '/' })
                            cookie.remove('program', { path: '/' })
                            cookie.remove('packageType', { path: '/' })
                            cookie.remove('promoName', { path: '/' })
                            cookie.remove('share', { path: '/' })
                            cookie.remove('general', { path: '/' })
                            cookie.remove('tester', { path: '/' })
                            setAuth(false)
                            if (sign.isSimpleRegs) {
                              setSimpleRegs(false)
                            }
                            browserHistory.push('/')
                          }}>
                            Читать новости
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Modal ref='socialShare' contentStyle={contentStyle}>
                    <div className={styles.socialShare}>
                      <h2>Поделиться</h2>
                      <ul className={styles.socialSignin}>
                        <li className={styles.socialSigninItemVk}>
                          <VKShareButton
                            url={'https://todayme.ru'}
                            description={description}
                            className={styles.demoSocialShare}>
                            <VKIcon
                              size={40}
                              round />
                          </VKShareButton>
                        </li>
                        <li className={styles.socialSigninItem}>
                          <div id="ok_shareWidget"></div>
                        </li>
                        <li className={styles.socialSigninItemFb}>
                          <FacebookShareButton
                            url={'https://lk2.todayme.ru'}
                            description={description}
                            picture={'https://lk.todayme.ru/assets/img/png/ya_heroi.png'}
                            className={styles.demoSocialShare}>
                            <FacebookIcon
                              size={40}
                              round />
                          </FacebookShareButton>
                        </li>
                      </ul>

                      <button className={styles.btnPrimary} onClick={() => this.refs.socialShare.hide()}>
                        Продолжить
                      </button>
                    </div>
                  </Modal>

                  <Modal ref='clipboardSuccessModal' contentStyle={contentStyle}>
                    <h2>Промокод скопирован</h2>

                    <br/>
                    <button className={styles.btnPrimary} onClick={() => this.refs.clipboardSuccessModal.hide()}>
                      Продолжить
                    </button>
                  </Modal>

                  {cookie.load('tester')
                    ? <BackgroundTester />
                    : <div className={styles.entryBg}>
                      {bg}
                    </div>
                  }
                </div>
              </div>
            )
          }
        </div>
    )
  }
}
const mapDispatchToProps = dispatch => ({
    receivePayment: bindActionCreators(actions.receivePayment, dispatch),
    fetchFinalSteps: bindActionCreators(actions.fetchFinalSteps, dispatch),
    setAuth:bindActionCreators(actions.setAuth, dispatch),
    setSimpleRegs:bindActionCreators(actions.setSimpleRegs, dispatch),
    dispatch
})

const mapStateToProps = state => {

  const { selectedPayment, recivedPayment, promoForYou, showPromos, abtest, sign, siteSettings, userInfo } = state

  const {
    isFetching,
    payment
  } = recivedPayment[selectedPayment] || {
    isFetching: true,
    payment: {}
  }

  return {
    showPromos,
    sign,
    abtest,
    promoForYou,
    selectedPayment,
    isFetching,
    payment,
    siteSettings,
    userInfo,
  }
}

SuccessProfile = connect(
  mapStateToProps,
    mapDispatchToProps
)(SuccessProfile)

export default CSSModules(SuccessProfile, styles)
