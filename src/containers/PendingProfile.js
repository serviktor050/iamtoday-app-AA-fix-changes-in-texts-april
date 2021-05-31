import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import {Link} from 'react-router'
import {
  fetchChat,
  closeChat,
  createWithMessage,
  PRIVATE_CHAT_ID,
  rejectProfile,
  approveProfile,
  fetchPendingProfile
} from '../actions'

import Chat from './Chat'
import UserReportsMenu from '../components/userReports/UserReportsMenu'
import ProfilePropertiesList from '../components/userReports/ProfilePropertiesList'
import CSSModules from 'react-css-modules'
import styles from './pendingProfile.css'

class UserReports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRejectPopupVisible: false
    }
  }

  componentWillMount() {
    const {fetchPendingProfile, routeParams} = this.props

    fetchChat(PRIVATE_CHAT_ID, routeParams.userId)
    fetchPendingProfile(routeParams.userId)
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

  approveProfile () {
    const {router, routeParams, approveProfile} = this.props

    approveProfile(routeParams.userId)
      .then(() => router.push('/userReports/pendingProfiles'))
  }

  rejectProfile () {
    const {
      routeParams,
      fetchChat,
      createWithMessage,
      rejectProfile
    } = this.props

    this.hideRejectPopup()

    Promise
      .all([
        createWithMessage(PRIVATE_CHAT_ID, routeParams.userId, this.refs.rejectReason.value, true),
        rejectProfile(routeParams.userId)
      ])
      .then(() => {
        fetchChat(PRIVATE_CHAT_ID, routeParams.userId)
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
                      </div> : (
                    <div className={styles.pendingProfile}>
                      <div className={styles.pendingProfileTopPanel}>
                        <div className={styles.pendingProfileButtons}>
                          <button
                            onClick={() => this.approveProfile()}
                            className={styles.pendingProfileButtonPrimary}>
                            Утвердить профиль
                          </button>
                          <button
                            onClick={() => this.showRejectPopup()}
                            className={styles.pendingProfileButtonAction}>
                            Вернуть на исправление
                          </button>
                        </div>

                        <Link
                          to="/userReports/pendingProfiles"
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
                                    onClick={() => this.rejectProfile()}
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
  rejectProfile,
  approveProfile,
  fetchPendingProfile
}

UserReports = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserReports)

export default CSSModules(UserReports, styles)
