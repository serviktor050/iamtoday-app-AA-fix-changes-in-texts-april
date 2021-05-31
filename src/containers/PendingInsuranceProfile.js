import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import {Link} from 'react-router'
import {
  fetchChat,
  closeChat,
  createWithMessage,
  INSURANCE_CHAT_ID,
  rejectInsuranceProfile,
  approveInsuranceProfile,
  fetchPendingInsuranceProfile
} from '../actions'
import CSSModules from 'react-css-modules'
import styles from './pendingInsuranceProfile.css'

import Chat from './Chat'
import UserReportsMenu from '../components/userReports/UserReportsMenu'
import ProfilePropertiesList from '../components/userReports/ProfilePropertiesList'

class UserReports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRejectPopupVisible: false
    }
  }

  componentWillMount() {
    const {fetchPendingInsuranceProfile, fetchChat, routeParams} = this.props

    fetchChat(INSURANCE_CHAT_ID, routeParams.insuranceId)
    fetchPendingInsuranceProfile(routeParams.userId)
  }

  componentWillUnmount () {
    const {closeChat} = this.props

    closeChat()
  }

  showRejectPopup() {
    this.setState({isRejectPopupVisible: true})
  }

  hideRejectPopup() {
    this.setState({isRejectPopupVisible: false})
  }

  approveInsurance() {
    const {router, routeParams, approveInsuranceProfile} = this.props

    approveInsuranceProfile(routeParams.insuranceId)
      .then(() => router.push('/userReports/pendingInsurance'))
  }

  rejectInsurance() {
    const {
      routeParams,
      fetchChat,
      createWithMessage,
      rejectInsuranceProfile
    } = this.props

    this.hideRejectPopup()

    Promise
      .all([
        createWithMessage(INSURANCE_CHAT_ID, routeParams.insuranceId, this.refs.rejectReason.value, true),
        rejectInsuranceProfile(routeParams.insuranceId)
      ])
      .then(() => {
        fetchChat(INSURANCE_CHAT_ID, routeParams.insuranceId)
      })
  }

  render() {
    const {isRejectPopupVisible} = this.state
    const {userId, isFetching, current, previously} = this.props

    return (
      <div className={styles.layout}>
        <Chat userId={userId}/>
        <div className={styles.header}>
          <div className={styles.gridHeaderInner}>
            <h1 className={styles.gridCellHeaderLogo}>
              Ясегодня
              <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
            </h1>
          </div>
        </div>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>

          <div className={styles.gridCellLayoutMenu14}>
            <div className={styles.gridLayoutMenuInner}>
              <div className={styles.gridCellLayout66}>
                <UserReportsMenu/>
              </div>
            </div>
          </div>
          <div className={styles.gridCellLayoutContentPocket34}>
            <div className={styles.stageBoxSmallPadding}>
                {
                  isFetching ? <div className={styles.textCenter}>
                        <div className={styles.loaderMain}></div>
                      </div>
                      : (<div className={styles.pendingProfile}>
                        <div className={styles.pendingProfileTopPanel}>
                          <div className={styles.pendingProfileButtons}>
                            <button
                              onClick={() => this.approveInsurance()}
                              className={styles.pendingProfileButtonPrimary}>
                              Страховка утверждена
                            </button>
                            <button
                              onClick={() => this.showRejectPopup()}
                              className={styles.pendingProfileButtonAction}>
                              В страховке отказано
                            </button>
                          </div>

                          <Link
                            to="/userReports/pendingInsurance"
                            className={styles.pendingProfileCloseButton}>
                            <svg className={styles.svgIcoClose}>
                              <use xlinkHref="#ico-close"></use>
                            </svg>
                          </Link>
                        </div>

                        <div className={styles.pendingProfileContainer}>
                          {
                            current
                              ? <ProfilePropertiesList
                                title={previously ? 'Было' : null}
                                props={current}
                                compareTo={previously}/>
                              : null
                          }

                          {
                            previously
                              ? <ProfilePropertiesList
                                title="Стало"
                                props={previously}
                                compareTo={current}/>
                              : null
                          }
                        </div>

                        {
                          isRejectPopupVisible ? (
                              <div className={styles.pendingProfileInnerPopup}>
                                <div className={styles.pendingProfileTopPanel}>
                                  <div className={styles.pendingProfileButtons}>
                                    <button
                                      onClick={() => this.rejectInsurance()}
                                      className={styles.pendingProfileButtonPrimary}>
                                      Отказать
                                    </button>
                                    <button
                                      onClick={() => this.hideRejectPopup()}
                                      className={styles.pendingProfileButtonAction}>
                                      Отмена
                                    </button>
                                  </div>

                                  <div className={styles.pendingProfileCloseButton}
                                       onClick={() => this.hideRejectPopup()}>
                                    <svg className={styles.svgIcoClose}>
                                      <use xlinkHref="#ico-close"></use>
                                    </svg>
                                  </div>
                                </div>

                                <textarea
                                  ref="rejectReason"
                                  className={styles.pendingProfileDescBox}
                                  placeholder="Причина отказа"/>
                              </div>
                            ) : null
                        }
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    isFetching = true,
    current = null,
    previously = null
  } = state.pendingProfile

  return {
    userId: Number(cookie.load('user_id')),
    isFetching,
    current,
    previously
  }
}

const mapDispatchToProps = {
  fetchChat,
  closeChat,
  createWithMessage,
  rejectInsuranceProfile,
  approveInsuranceProfile,
  fetchPendingInsuranceProfile
}

UserReports = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserReports)

export default CSSModules(UserReports, styles)
