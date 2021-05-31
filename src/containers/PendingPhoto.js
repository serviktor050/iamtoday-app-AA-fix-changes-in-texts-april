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
  rejectPhoto,
  approvePhoto,
  fetchPendingPhoto
} from '../actions'

import Chat from './Chat'
import UserReportsMenu from '../components/userReports/UserReportsMenu'
import ProfilePhotos from '../components/userReports/ProfilePhotos'
import CSSModules from 'react-css-modules'
import styles from './pendingPhoto.css'

class UserReports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRejectPopupVisible: false
    }
  }

  componentWillMount() {
    const {
      routeParams,
      fetchChat,
      fetchPendingPhoto
    } = this.props

    fetchChat(PRIVATE_CHAT_ID, routeParams.userId)
    fetchPendingPhoto(Number(routeParams.userId), Number(routeParams.season))
  }

  componentWillUnmount() {
    const {closeChat} = this.props

    closeChat()
  }

  showRejectPopup() {
    this.setState({isRejectPopupVisible: true})
  }

  hideRejectPopup() {
    this.setState({isRejectPopupVisible: false})
  }

  approvePhoto() {
    const {router, approvePhoto, user, program} = this.props

    approvePhoto(user, program)
      .then(() => router.push('/userReports/photos'))
  }

  rejectPhoto() {
    const {
      user,
      program,
      fetchChat,
      createWithMessage,
      rejectPhoto
    } = this.props

    this.hideRejectPopup()

    Promise
      .all([
        createWithMessage(PRIVATE_CHAT_ID, this.props.params.userId, this.refs.rejectReason.value, true),
        rejectPhoto(user, program)
      ])
      .then(() => {
        fetchChat(PRIVATE_CHAT_ID, user)
      })
  }

  render() {
    const {isRejectPopupVisible} = this.state
    const {
      userId,
      isFetching,
      photoAfterBackUrl,
      photoAfterFrontUrl,
      photoAfterLeftUrl,
      photoAfterRightUrl,
      photoBeforeBackUrl,
      photoBeforeFrontUrl,
      photoBeforeLeftUrl,
      photoBeforeRightUrl,
      photoAfterVideoExt,
      photoBeforeVideoExt,
    } = this.props

    return (
      <div className={styles.layout}>

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
                              onClick={() => this.approvePhoto()}
                              className={styles.pendingProfileButtonPrimary}>
                              Утвердить фотографии
                            </button>
                            <button
                              onClick={() => this.showRejectPopup()}
                              className={styles.pendingProfileButtonAction}>
                              Вернуть на исправление
                            </button>
                          </div>

                          <Link
                            to="/userReports/photos"
                            className={styles.pendingProfileCloseButton}>
                            <svg className={styles.svgIcoClose}>
                              <use xlinkHref="#ico-close"></use>
                            </svg>
                          </Link>
                        </div>

                        <div className={styles.pendingProfileContainer}>
                          <ProfilePhotos
                            title="До"
                            front={photoBeforeFrontUrl}
                            back={photoBeforeBackUrl}
                            left={photoBeforeLeftUrl}
                            right={photoBeforeRightUrl}
                            video={photoBeforeVideoExt}
                          />

                          <ProfilePhotos
                            title="После"
                            front={photoAfterFrontUrl}
                            back={photoAfterBackUrl}
                            left={photoAfterLeftUrl}
                            right={photoAfterRightUrl}
                            video={photoAfterVideoExt}
                          />
                        </div>

                        {
                          isRejectPopupVisible ? (
                              <div className={styles.pendingProfileInnerPopup}>
                                <div className={styles.pendingProfileTopPanel}>
                                  <div className={styles.pendingProfileButtons}>
                                    <button
                                      onClick={() => this.rejectPhoto()}
                                      className={styles.pendingProfileButtonPrimary}>
                                      Вернуть
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

        <Chat userId={userId}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    pendingPhoto
  } = state

  return {
    userId: Number(cookie.load('user_id')),
    ...pendingPhoto
  }
}

const mapDispatchToProps = {
  fetchChat,
  closeChat,
  createWithMessage,
  rejectPhoto,
  approvePhoto,
  fetchPendingPhoto
}

UserReports = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserReports)

export default CSSModules(UserReports, styles)
