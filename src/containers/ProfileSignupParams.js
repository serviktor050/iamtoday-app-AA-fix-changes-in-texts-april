import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { browserHistory, Link } from 'react-router'
import { promoVisit } from '../actions/promo/promoWatch'
import { reduxForm, formValueSelector } from 'redux-form'
import cookie from 'react-cookie'
import { api, domen } from '../config.js'
import Modal from 'boron-react-modal/FadeModal'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './profileSignupParams.css'
import LogoLink from '../components/componentKit/LogoLink'
import BackgroundTester from '../components/componentKit2/BackgroundTester'
import { programsData } from '../utils/data'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

let packagesData = []

const defaultBg = <img className={styles.alfaBg} src="/assets/img/antiage/bg.jpg" alt=""/>;

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

/**
 *  Контейнер ProfileSignupParams.
 *  Используется для отображения страницы 'Регистрация' (/signup/params)
 *
 */
class ProfileSignupParams extends Component {
  /**
   * @memberof ProfileSignupParams
   * @prop {Object} propTypes - the props that are passed to this component
   * @prop {number} propTypes.choosenPackageType Выбранный тип пакета
   * @prop {number} propTypes.program Программа
   * @prop {number} propTypes.choosenProgram Выбранная программа
   * @prop {string} propTypes.choosenPromo Промо текст.
   * @prop {object} propTypes.choosenAmount Данные для рендеринга пакета
   * @prop {func} propTypes.removeABTest Удаление данных аб тестов из стора
   *
   * */

  static propTypes = {
    choosenPackageType: PropTypes.number,
    program: PropTypes.number,
    choosenProgram: PropTypes.number,
    choosenPromo: PropTypes.string,
    choosenAmount: PropTypes.object.isRequired,
    removeABTest: PropTypes.func.isRequired,
    selectedPrograms: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    /**
     * @memberof ProfileSignupParams
     * @prop {Object} state -
     * @prop {boolean} state.errorSelectProgram Флаг, если не выбрана программа
     *
     * */
    errorSelectProgram: false
  }

  componentWillMount() {
    const {payWeekly, userInfo,  dispatch} = this.props
    if (window.mobilecheck()) {
      contentStyle.margin = '100px'
      contentStyle.width = '300px'
    }
    const abtest = cookie.load('abtest')


    if(!cookie.load('token'))  {
      browserHistory.push('/')
    }
    if(abtest && abtest.length){
      this.props.checkABTest()
    }
    if(this.props.location.query.pay === 'weekly'){
      this.props.setPayWeekly(true)
    }

  }

  componentDidMount() {
    const { dispatch, choosenProgram, selectedPrograms, sign, userInfo, program, choosenPackageType} = this.props
    let { choosenPromo } = this.props

    const isAlfa = domen.isAlfa
    const isUnipro = domen.isUnipro
    const isTele2Lk = domen.isTele2

    dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))
    dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: 1 })

    dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: parseInt(cookie.load('program')) || programsData.hero})

    //userInfo.data.program = 19
    //dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: userInfo.data.program })
    //cookie.save('program', userInfo.data.program , { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
    let pathname = this.props.router.location.pathname,
      pathnameArr = pathname.split('/')
    if(isUnipro){
      choosenPromo = 'UNIPRO'
    }
    if(isAlfa){
      choosenPromo = 'ALFA'
    }
    if(isTele2Lk){
        choosenPromo = 'TELE2'
    }
    return Promise.resolve(getAmount(choosenPromo)
      .then(data => {
        const packageValue = data.packages.filter(item =>{
          return item.id === parseInt(choosenPackageType)
        })

        dispatch({
          type: 'CHOOSEN_AMOUNT',
          price: packageValue[0].cost,
          oldPrice:packageValue[0].oldCost //choosenAmount.oldPrice || choosenAmount.price
        })
      })
    )
  }


  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedPrograms} = nextProps
    if (nextProps.selectedPrograms !== this.props.selectedPrograms) {
      dispatch(actions.fetchProgramsIfNeeded(selectedPrograms, true))
    }
    if(this.props.sign.payWeekly && (nextProps.userInfo.data.program !== this.props.userInfo.data.program)){
      this.props.dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: nextProps.userInfo.data.program })
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

    this.props.dispatch({
      type:'REMOVE_TESTER_INFO_ITEM',
      index
    })

    if(typeInfo === 'tele2'){
      this.props.dispatch({
        type:'REMOVE_TELE2_INFO_ITEM',
        index
      })
    }
  }

  payManual(payment){
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
          //this.refs.loadingModal.hide()
          if (json.errorCode === 1 && json.data) {
            browserHistory.push('/profile')
          }
        })
    }

  render() {
    let { dispatch, packageType, promo, share, choosenPackageType, choosenAmount,
      choosenProgram, choosenPromo, receivePayment, removeABTest, choosenTomorrowType,
      fetchedPrograms, abtest, testerInfoBlocks, sign, userInfo} = this.props
    const { isTest, showInfoBlock, isTele2 , tele2InfoList} = abtest

    const isAlfa = domen.isAlfa
    const isUnipro = domen.isUnipro
    const isTele2Lk = domen.isTele2
    const {payWeekly} = sign

    let bg = defaultBg

    let headerStyle

    if (!fetchedPrograms || !fetchedPrograms[0]) {
      return (<LoadingView title="Загружается..."/>)
    }

 /*   if(!userInfo.data.id){
      console.log('iff-userInfo')
      return (<LoadingView title="Загружается..."/>)
    }*/

    const tester = cookie.load('tester')

    let programs = [
      { name: isTele2Lk ? '#Для новичков' : isUnipro ? '#СТАРТ' : '#Я герой',
        isActive: fetchedPrograms[0].id % programsData.count === choosenProgram % programsData.count,
        number: fetchedPrograms[0].id,
        str: 'hero',
        style: fetchedPrograms[0].id % programsData.count === choosenProgram % programsData.count ? styles.optionsItemHeroActive : payWeekly ? styles.optionsItemDisabled : styles.optionsItemHero
    }
      // ,
      // { name: isTele2Lk ? '#Для молодых мам' : isUnipro ? '#НОВАЯ ВЫСОТА' : '#Мама может',
      //   isActive: fetchedPrograms[1].id % programsData.count=== choosenProgram % 5,
      //   number: fetchedPrograms[1].id,
      //   str: 'extreme',
      //   style: fetchedPrograms[1].id % programsData.count === choosenProgram % programsData.count ? styles.optionsItemMotherActive : payWeekly ? styles.optionsItemDisabled : styles.optionsItemMother
      // },
      // { name: isUnipro ? '#ЭНЕРГИЯ ЙОГИ' :'#САМЫЙ-САМЫЙ',

      //   isActive: fetchedPrograms[2].id % programsData.count === choosenProgram % programsData.count,
      //   number: fetchedPrograms[2].id,
      //   str: 'yoga',
      //   style: fetchedPrograms[2].id % programsData.count === choosenProgram % programsData.count ? styles.optionsItemExtremeActive : payWeekly ? styles.optionsItemDisabled : styles.optionsItemExtreme }
      // ,{ name: '#ЭНЕРГИЯ ЙОГИ',
      //   isActive: fetchedPrograms[3].id % programsData.count === choosenProgram % programsData.count,
      //   number: fetchedPrograms[3].id,
      //   str: 'yoga',
      //   style: fetchedPrograms[3].id % programsData.count === choosenProgram % programsData.count ? styles.optionsItemHeroActive : payWeekly ? styles.optionsItemDisabled : styles.optionsItemHero
      // },
      // { name: '#ВМЕСТЕ ВЕСЕЛЕЕ',
      //   isActive: fetchedPrograms[4].id % programsData.count === choosenProgram % programsData.count,
      //   number: fetchedPrograms[4].id,
      //   str: 'family',
      //   style: fetchedPrograms[4].id % programsData.count === choosenProgram % programsData.count ? styles.optionsItemTomorrowActive : payWeekly ? styles.optionsItemDisabled : styles.optionsItemTomorrow
       //},
    ]

   /* if(isAlfa || isTele2Lk || isUnipro){
      programs = programs.slice(0, programs.length -1)
    }*/


    let activeProgram = {}
    if (choosenProgram !== 0) {
      programs.forEach((p, i) => {
        if (p.number === choosenProgram * 1) {
          programs[i].isActive = true
          activeProgram = programs[i]
        }
      })
    }

    switch (choosenProgram * 1 % programsData.count) {
      case 1:
        headerStyle = styles.entryHeaderHero
        break
      case 2:
        headerStyle = styles.entryHeaderMother
        break
      case 3:
        headerStyle = styles.entryHeaderExtreme
        break
      case 0:
        headerStyle = styles.entryHeaderTomorrow
        break
      default:
        headerStyle = styles.entryHeaderHero
    }


    let packageTypes = tester ? [{ name: 'Тестер', isActive: false, number: 4 }] : [
      { name: '1 человек', isActive: false, number: 1 },
      { name: '1 ЧЕЛОВЕК + ФИТНЕС-БРАСЛЕТ', isActive: false, number: 5 },
      { name: '1 ЧЕЛОВЕК + КОВРИК', isActive: false, number: 6 },
      { name: '2 человека', isActive: false, number: 2, half:true},
      { name: '3 человека', isActive: false, number: 3, half:true},
      { name: 'Понедельный', isActive: false, number: 7 }
    ]
    packageTypes = packageTypes.map(item =>{
      if(item.number == choosenPackageType){
        item.isActive = true
      }
      return item
    })
    if(payWeekly){
      packageTypes = packageTypes.filter(item => item.number === 7)
      packageTypes[0].isActive = true

       if(packagesData.length){
         const value = packagesData.filter(item =>{
           return item.id === 7
         })
         dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: 7 })
         dispatch({
           type: 'CHOOSEN_AMOUNT',
           price: value[0].cost,
           oldPrice:value[0].oldCost
         })
       }
    }

    if (!tester){
      packageTypes = packageTypes.map(item => {
        if(item.number === choosenPackageType){
           item.isActive = true
        }
        return item
      })
    }
    if(isAlfa || isTele2Lk || isUnipro){
      packageTypes = [
        { name: '1 человек', isActive: true, number: 1 }
        ]
    }


    const tomorrowTypes = [
      { name: 'Себе', isActive: false, number: 1 },
      { name: 'Другу', isActive: false, number: 2 }
    ]

    tomorrowTypes[choosenTomorrowType - 1].isActive = true

    const paymentCreate = () => {
      this.refs.loadingModal.show()

      let data = {
        authToken: cookie.load('token'),
        data: {
          program: choosenProgram,
          package: choosenPackageType
        }
      }
      return fetch(`${api}/user/user-update`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(json => {
        if (json.isSuccess && json.data) {
          if (!cookie.load('successful_registration')) {
            const ga = window.ga
            const yaCounter = window.yaCounter41402064

            switch (json.data.program) {
              case fetchedPrograms[0].id:
                ga('send', 'event', 'user', 'successful_registration', 'hero')
                ga('send', 'pageview', '/virtual/successful_registration/hero/')
                yaCounter && yaCounter.reachGoal('successful_registration_hero')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case fetchedPrograms[1].id:
                ga('send', 'event', 'user', 'successful_registration', 'mama')
                ga('send', 'pageview', '/virtual/successful_registration/mama/')
                yaCounter && yaCounter.reachGoal('successful_registration_mama')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case fetchedPrograms[2].id:
                ga('send', 'event', 'user', 'successful_registration', 'extreme')
                ga('send', 'pageview', '/virtual/successful_registration/extreme/')
                yaCounter && yaCounter.reachGoal('successful_registration_extreme')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              case fetchedPrograms[3].id:
                ga('send', 'event', 'user', 'successful_registration', 'tomorrow')
                ga('send', 'pageview', '/virtual/successful_registration/tomorrow/')
                yaCounter && yaCounter.reachGoal('successful_registration_tomorrow')
                cookie.save('successful_registration', true, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                break
              default:
                break
            }
          }

          let payload = {
            authToken: cookie.load('token'),
            data: {
              program: choosenProgram,
              package: cookie.load('tester') ? programsData.count : choosenPackageType,
              isShare: share && share !== 'undefined' ? share : false
            }
          }
          if(isAlfa){
            payload.data.promoName = 'ALFA'
          }
          if(isTele2Lk){
              payload.data.promoName = 'TElE2'
          }
          if(isUnipro){
            payload.data.promoName = 'UNIPRO'
          }


          if (choosenPromo) {
            payload.data.promoName = choosenPromo
          }

          if (promoVisit.getPromoSessionId()) {
            payload.data.promoSession = promoVisit.getPromoSessionId()
          }

          payload.data.carrotquestUid = `carrotquest_uid:${cookie.load('carrotquest_uid')};_ym_uid:${cookie.load('_ym_uid')};_ga_cid:${cookie.load('_ga_cid')};partner:${cookie.save('partner') ? cookie.save('partner') : 'none'}`
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

            this.refs.loadingModal.hide()
            if (json.errorCode === 1 && json.data) {
              dispatch(receivePayment('reactjs', json))
              this.payManual(json)
              //browserHistory.push('/signup/pay/success')

            } else {
              this.refs.errorModal.show()
            }
          })
        } else {
          this.refs.loadingModal.hide()
          this.refs.errorModal.show()
        }
      })
    }

    return (
      <div className={styles.layoutEntry}>
        <div className={styles.gridEntryHeader}>
          <div className={styles.deskGridCellTodaymeLogo14}>
            <LogoLink isUnipro={isUnipro} isTele2Lk={isTele2Lk} isAlfa={isAlfa} isTest={isTest}/>
          </div>
          <div className={styles.deskGridCellTextCenter24}>
            <div className={isTele2Lk ? styles.entryStepTele2 : styles.entryStep}>
              <span className={styles.entryStepTitle}>Шаг</span>
              <span className={styles.entryStepNo}>#2</span>
              <span className={styles.entryStepGoto}>{ isTest ? 'из 4' : isAlfa || isTele2Lk || isUnipro ? 'из 3' : 'из 6'}</span>
            </div>
          </div>
        </div>

        <div className={styles.entryMin}>
          <div className={styles.entryInner}>
            <div className={headerStyle}>
              {activeProgram.name
                ? <h2 className={styles.entryTitleCenter}>
                  {activeProgram.name}
                </h2>
                : isTest
                  ? <h2 className={styles.entryTitleCenter}>
                    <p>Вдвоем или втроем дешевле!</p>
                    <p>Выбирай и жми далее</p>
                  </h2>
                  : <h2 className={styles.entryTitleCenter}>
                    <p>Выбор программы:</p>
                  </h2>
              }
            </div>

            <br />

            {tester && showInfoBlock
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


            <div className={styles.entryBox}>
              {!tester &&
                <ul className={styles.optionsWhiteWideMb30}>
                  {programs.map((p, index) => (
                    <li key={index}
                      className={p.style}
                      onClick={() => {
                        if(payWeekly){
                          return;
                        }
                        this.setState({
                          errorSelectProgram: false
                        })
                        dispatch({ type: 'CHOOSEN_PROGRAM', choosenProgram: p.number })
                       /* if (p.number === fetchedPrograms[3].id) {
                          dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: 1 })
                          dispatch({
                            type: 'CHOOSEN_AMOUNT',
                            price: packagesData[0].cost,
                            oldPrice:packagesData[0].oldCost
                          })
                        }*/
                      }
                    }>
                      {p.name}
                    </li>
                  ))}
                </ul>
              }

              {this.state.errorSelectProgram ? <div className={styles.optionsError}>Выберите программу!</div> : null}

             {/* {choosenProgram !== fetchedPrograms[3].id && !tester &&
                <ul className={styles.optionsWhiteThreeValMt30}>
                  {packageTypes.map((pt, index) => {
                    let  classLi
                    if(pt.isActive){
                     if (pt.number === 5 || pt.number === 6){
                        classLi = styles.optionsItemIsActiveGift
                      } else {
                        classLi = styles.optionsItemIsActive
                      }
                    } else {
                        classLi = styles.optionsItem
                    }
                    if(pt.half){
                      if(pt.isActive){
                        classLi = styles.optionsItemIsActiveHalf
                      } else {
                        classLi = styles.optionsItemHalf
                      }
                      return (
                        <li key={'pack-' + index} className={styles.optionsItemHalfWrap} style ={pt.number === 2 ? {paddingRight: '5px'} : {paddingLeft: '5px'}}>
                          <div key={index} className={classLi} onClick={() => {
                            const value = packagesData.filter(item =>{
                              return item.id === pt.number
                            })
                            packageType = pt.number
                            dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
                            dispatch({
                              type: 'CHOOSEN_AMOUNT',
                              price: value[0].cost,
                              oldPrice:value[0].oldCost
                            })
                          }}>
                            {pt.name}
                          </div>
                        </li>
                      )
                    }
                      return (
                        <li key={index} className={classLi} onClick={() => {
                          const value = packagesData.filter(item =>{
                            return item.id === pt.number
                          })

                          packageType = pt.number
                          dispatch({ type: 'CHOOSEN_PACKAGE_TYPE', choosenPackageType: packageType })
                          dispatch({
                            type: 'CHOOSEN_AMOUNT',
                            price: value[0].cost,
                            oldPrice:value[0].oldCost
                          })
                        }}>
                        {pt.name}
                      </li>)

                  }
                    )}
                </ul>
              }*/}

            {/*  {choosenProgram === fetchedPrograms[3].id &&
                <ul className={styles.optionsWhiteTwoVal}>
                  {tomorrowTypes.map((tt, index) => (
                    <li key={index} className={tt.isActive ? styles.optionsItemIsActiveHalf : styles.optionsItemHalf} onClick={() => {
                      dispatch({ type: 'CHOOSEN_TOMORROW_TYPE', choosenTomorrowType: tt.number })
                    }}>
                      {tt.name}
                    </li>
                  ))}
                </ul>
              }*/}
            </div>

            {/* <div className={styles.entryDesc}>
              <Link className={styles.entryNavLink} target="_blank" to="/description">Описание программ</Link>
            </div> */}

            <div className={styles.entryBox}>
              {!isUnipro ? !isTest
                ? <p className={isAlfa || isTele2Lk ? styles.entryProgramPriceNone : styles.entryProgramPrice}>
                  {!tester ? choosenAmount.price : 0} руб.
                </p>
                : (
                  <div>
                    {!choosenPromo.length
                      ? <p className={styles.entryProgramPrice}>
                        {!tester ? choosenAmount.price : 0} руб.
                      </p>
                      : <div className={styles.entryPrice}>
                        { choosenPromo.length
                          ? <div className={styles.entryProgramPriceItem}>
                            {!tester ? choosenAmount.price : 0} руб.
                          </div>
                          : null
                        }
                        <strike className={styles.entryProgramPriceItem}>
                          {!tester ? choosenAmount.oldPrice : 0} руб.
                        </strike>
                      </div>
                    }
                  </div>
                ) : null
              }

              {!tester && !isAlfa && !isTele2Lk && !isUnipro?
              <div className={styles.inputBoxBtn}>
                <input ref='promoText' type="text" className={styles.inputField} placeholder="Eсть промокод, вводи"/>
                <div className={styles.btnSecondary} onClick={() => {

                  if(!this.refs.promoText.value.length) return
                  return Promise.resolve(getAmount(this.refs.promoText.value)
                    .then(data => {

                    const packageValue = data.packages.filter(item =>{

                            return item.id == choosenPackageType
                          })

                      if (data.packages) {
                        window.ga('set', 'dimension2', this.refs.promoText.value)
                        dispatch({
                          type: 'CHOOSEN_PROMO',
                          choosenPromo: this.refs.promoText.value
                        })
                        dispatch({
                          type: 'CHOOSEN_AMOUNT',
                          price: packageValue[0].cost,
                          oldPrice:packageValue[0].oldCost
                        })
                      } else {
                        this.refs.errorPromoModal.show()
                      }
                    })
                  )
                }}>Применить</div>
              </div>
              :null}

              <div className={isTest ? styles.buttonActionWide : isTele2Lk ? styles.buttonTele2Wide : styles.buttonSecondaryWide} onClick={() => {

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
                    if (choosenProgram) {
                      paymentCreate()
                    } else {
                      this.setState({ errorSelectProgram: true })
                    }
                  } else {
                    this.refs.errorModal.show()
                  }
                })
              }}>
                Далее
              </div>

              <br/>
              <br/>

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
                    removeABTest()
                    browserHistory.push('/')
                    //window.location.href = '/'
                    if(payWeekly){
                      this.props.setPayWeekly(false)
                    }
                  }}>Выйти</a>
                </li>
              </ul>

            </div>

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
        <Modal ref='errorPromoModal' contentStyle={contentStyle}>
          <h2>Промокод недействителен</h2>
          <br/>
          <button className={styles.btnAction} onClick={() => this.refs.errorPromoModal.hide()}>
            Продолжить
          </button>
        </Modal>
      </div>//layoutEntry
    )
  }
}

ProfileSignupParams = reduxForm({
  form: 'signupValidation'
})(ProfileSignupParams)

const selector = formValueSelector('signupValidation')
const mapStateToProps = state => {

  const { selectedPrograms, recivedPrograms, profile, choosenPackageType,
    choosenAmount, choosenProgram, choosenPromo, choosenTomorrowType, abtest,
    testerInfoBlocks, sign, userInfo } = state
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
    userInfo,
    choosenTomorrowType,
    choosenPromo,
    choosenProgram,
    choosenAmount,
    choosenPackageType,
    program,
    packageType,
    promo,
    abtest,
    amount,
    emailFriend,
    phoneFriend,
    nameFriend,
    fetchedPrograms: programs,
    share
  }
}

const mapDispatchToProps = dispatch => ({
  signup: bindActionCreators(actions.signup, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch),
  checkABTest: bindActionCreators(actions.checkABTest, dispatch),
  removeABTest: bindActionCreators(actions.removeABTest, dispatch),
  setPayWeekly: bindActionCreators(actions.setPayWeekly, dispatch),
  receivePayment: bindActionCreators(actions.receivePayment, dispatch)
})

ProfileSignupParams = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSignupParams)

export default CSSModules(ProfileSignupParams, styles)
