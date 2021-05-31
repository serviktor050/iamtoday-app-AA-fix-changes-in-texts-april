import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import * as selectors from '../../selectors';
import * as ducks from '../../ducks';
import { dict } from 'dict';
import classNames from "classnames/bind";
import styles from "./styles.css";
import { browserHistory } from "react-router";
import { createUserName } from '../../../Admin/utils';
import { Modal } from '../../MlmStructure/components/MentorRequestCard/components/Modal';

const cx = classNames.bind(styles);

class TutorCard extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      isVisible: false,
      isError: null,
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.toggleError = this.toggleError.bind(this);
  }

  toggleModal() {
    if (this.state.isVisible) {
      window.location.reload();
    }
    this.setState({ isVisible: !this.state.isVisible })
  }

  toggleError(e) {
    this.setState({ isError: e })
  }
    
  render() {
    const { userInfo: { data: userInfo}, lang, dispatch, item } = this.props;
    const { mlmUserInfo: { tutorRequests } } = userInfo;
    
    const { tutorInfo: { userInfo: tutorInfo } } = item;

    let buttons;
    let header;
    let infoClass;
    let infoText;
    let status;
    let statusClass;
    if (item.status === 'waiting_user') {
      header = dict[lang]['mlm.mentorship.recommendedTutor'];
      infoClass = 'tutorCard__info-recommended';
      infoText = dict[lang]['mlm.mentorship.weRecommendYouTutor'];
      buttons = (<div className={cx('tutorCard__buttonsContainer')}>
        <button 
          className={cx('btn', 'tutorCard__btn-blue')} 
          onClick={(_) => dispatch(ducks.acceptMentorRequest({ id: item.id, status: 'waiting_tutor' }, this.toggleModal, this.toggleError))}
        >
            {dict[lang]['mlm.mentorship.chooseTutor']}
        </button>
        <button 
          className={cx('btn', 'tutorCard__btn-blueOutline')} 
          onClick={(_) => browserHistory.push(`/tutor/${tutorInfo.id}?returnUrl=${this.props.location.pathname}`)}
        >
          {dict[lang]['mlm.mentorship.tutorProfile']}
        </button>
      </div>);
    } else if (item.status === 'waiting_tutor') {
      header = dict[lang]['mlm.mentorship.myTutor'];
      buttons = (
      <div className={cx('tutorCard__buttonsContainer')}>
        <button 
          className={cx('btn', 'tutorCard__btn-blueOutline')} 
          onClick={(_) => browserHistory.push(`/tutor/${tutorInfo.id}?returnUrl=${this.props.location.pathname}`)}
        >
          {dict[lang]['mlm.mentorship.tutorProfile']}
        </button>
      </div>);
      status = dict[lang]['mlm.mentorship.pending'];
      statusClass = 'tutorCard__status-pending';
    } else if (item.status === 'waiting_change') {
      header = dict[lang]['mlm.mentorship.changingTutor'];
      buttons = (
      <div className={cx('tutorCard__buttonsContainer')}>
        <button 
          className={cx('btn', 'tutorCard__btn-blueOutline')} 
          onClick={(_) => browserHistory.push(`/tutor/${tutorInfo.id}?returnUrl=${this.props.location.pathname}`)}
        >
          {dict[lang]['mlm.mentorship.tutorProfile']}
        </button>
      </div>);
    } else if (item.status === 'rejected_manager' || item.status === 'rejected_tutor') {
      header = dict[lang]['mlm.mentorship.myTutor'];
      infoClass = 'tutorCard__info-rejected';
      infoText = dict[lang]['mlm.mentorship.rejected-tutor'];
      buttons = (
      <div className={cx('tutorCard__buttonsContainer')}>
        <button 
          className={cx('btn', 'tutorCard__btn-blueOutline')} 
          onClick={(_) => browserHistory.push(`/tutor/${tutorInfo.id}?returnUrl=${this.props.location.pathname}`)}
        >
          {dict[lang]['mlm.mentorship.tutorProfile']}
        </button>
      </div>);
    }
    return (
      <div className={cx('tutorCard')}>
        <div className={cx('tutorCard__headerContainer')}>
          <h4 className={cx('tutorCard__header')}>{header}</h4>
          {status ? <span className={cx('tutorCard__status', statusClass)}>{status}</span> : null}
        </div>
        <div className={cx('tutorCard__tutorInfo')}>
          <img src={tutorInfo.photo} alt='avatar' className={cx('tutorCard__userAva')} />
          <div className={cx('tutorCard__textInfo')}>
            <p className={cx('tutorCard__lastName')}>{createUserName({lastName: tutorInfo.lastName})}</p>
            <p className={cx('tutorCard__firstMiddleName')}>{createUserName({firstName: tutorInfo.firstName, middleName: tutorInfo.middleName})}</p>
            <p className={cx('tutorCard__phone')}>{tutorInfo.phone}
              <a href={"https://wa.me/" + tutorInfo.phone}>
                <svg className={styles.icon}>
                  <use xlinkHref="#phone" />
                </svg>
              </a>
            </p>
            <a href={`mailto:${tutorInfo.email}`} className={cx('tutorCard__email')}>{tutorInfo.email}</a>
          </div>
        </div>
        {infoClass ? <div className={cx('tutorCard__info', infoClass)}>
          {infoText}
        </div> : null}
        <div className={cx('tutorCard__buttons')}>
            {buttons}
        </div>
        {this.state.isVisible && <Modal isButtons={false} onCancel={this.toggleModal}>
          <span>{dict[lang]["mlm.mentorship.successRequest"]}</span>
          <div className={cx('success_icon')}></div>
        </Modal>}
        {this.state.isError && <Modal isButtons={false} onCancel={(_) => this.setState({ isError: null })}>
          <span>{this.state.isError}</span>
        </Modal>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    lang: state.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};  

export default compose(connect(mapStateToProps, mapDispatchToProps))(TutorCard);