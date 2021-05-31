import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import TomorrowFriendValidationForm from './TomorrowFriendValidationForm'
import cookie from 'react-cookie'
import { api } from '../../config.js'
import CSSModules from 'react-css-modules'
import styles from './tomorrowFriend.css'
import LogoLink from '../componentKit/LogoLink'

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}

let isFetching = false

class TomorrowFriend extends Component {
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }
  }
  render() {
    const { paymentType, dispatch } = this.props
    return (
      <div>

        <img role="presentation" id="svg-inject-me" className={styles.injectedSvg} src="assets/img/symbol-sprite.svg"/>
        <div className={styles.layoutEntry}>
          <div className={styles.gridEntryHeader}>
            <div className={styles.deskGridCellTodaymeLogo14}>
              <LogoLink/>
            </div>
            <div className={styles.deskGridCellTextCenter24}>
              <div className={styles.entryStep}>
                <span className={styles.entryStepTitle}>Шаг</span>
                <span className={styles.entryStepNo}>{paymentType === 'successFriend' ? '#6' : '#5'}</span>
                <span className={styles.entryStepGoto}>из 6</span>
              </div>
            </div>
          </div>

          <div className={styles.entryMin}>
            <div className={styles.entryInner}>


              <div className='entry__header entry__header--colorful g-tomorrow'>
                <h2 className={styles.entryTitleCenter} style={{ color: '#fff' }}>#Я ЗАВТРА для Друга или для себя</h2>
              </div>
              {paymentType === 'successFriend' || this.props.location.query.simple
                ? <div className={styles.entryBox}>

                    <div className={styles.entryIcoBox}>
                      <img className={styles.entryIcoBoxImg} src="/assets/img/ico-mail-sent.svg" alt=""/>
                      <p className={styles.entryIcoBoxCopyTextCenter}>На вашу почту была отправлена инструкция</p>
                    </div>

                    <div className={styles.buttonPrimaryWide} onClick={() => {

                      cookie.remove('program', { path: '/' })
                      browserHistory.push('/signup/params')
                    }}>
                      купи программу для себя
                    </div>
                  </div>
                : <div>
                    <p className={styles.entrySubHeader}>{this.props.location.query.amount} руб.</p>


                    <TomorrowFriendValidationForm onSubmit={ data => {
                      if (!isFetching) {
                        isFetching = true
                        return fetch(`${api}/user/user-updateTomorrowPromo`, {
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          },
                          method: 'POST',
                          body: JSON.stringify({ authToken: cookie.load('token'), data })
                        })
                        .then(response => response.json())
                        .then(json => {
                          isFetching = false
                          if (json.errorCode === 1 && json.data) {
                            const ga = window.ga
                            const yaCounter = window.yaCounter41402064
                            ga('send', 'event', 'user', 'successful_registration_friend', 'tomorrow')
                            ga('send', 'pageview', '/virtual/successful_registration_friend/tomorrow/')
                            yaCounter && yaCounter.reachGoal('successful_registration_friend_tomorrow')
                            dispatch({ type: 'PAYMENT_TYPE', paymentType: 'successFriend' })
                            dispatch({ type: 'CHOOSEN_PROMO', choosenPromo: '' })
                            // dispatch({ type: 'CHOOSEN_AMOUNT', paymentType: 2000 })
                            // dispatch({})
                          } else {
                            throw new SubmissionError({
                              password: '',
                              _error: 'Что-то пошло не так, попробуйте снова'
                            })
                          }
                        })
                      }
                    }}/>
               </div>
              }
            </div>
          </div>

          <div className={styles.entryBg}>

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
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  program: state.profile.program,
  paymentType: state.paymentType
})

TomorrowFriend = connect(
  mapStateToProps
)(TomorrowFriend)

export default CSSModules(TomorrowFriend, styles)
