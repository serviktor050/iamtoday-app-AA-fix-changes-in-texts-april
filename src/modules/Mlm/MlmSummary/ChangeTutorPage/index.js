import React, { Component } from 'react';
import styles from './styles.css';
import { connect } from "react-redux";
import { dict } from "dict";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import * as ducks from "../../ducks";
import * as selectors from "../../selectors";
import { browserHistory } from "react-router";
import Layout from '../../../../components/componentKit2/Layout';
import { isDataNotFetched } from '../../../Admin/utils';
import Loader from '../../../../components/componentKit/Loader';
import { Header } from '../../../../components/common/Header';
import { renderHeader } from '../../../Admin/components/Mentoring/MentorProfile/MentorPage'
import { Modal } from '../../MlmStructure/components/MentorRequestCard/components/Modal';

const cx = classNames.bind(styles);

const page = "change-tutor";

const rows = [
  `location`,
  "workSeniorityAA",
  "modularSchool",
  "expertSchool",
  "diplomaFr",
];

class ChangeTutorPage extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       text: '',
       isSuccess: false,
       isError: '',
    }
  }
  
  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(ducks.getTutorInfo({ id: params.tutorId }));
  }

  handleTextarea = (e) => {
    this.setState({ text: e.target.value })
  }

  onSuccess = () => {
    this.setState({ isSuccess: true })
  }

  onError = (e) => {
    this.setState({ isError: e.target.value })
  }

  handleSubmit = () => {
    const { dispatch, params } = this.props;
    dispatch(ducks.createRequestToChangeTutor({ tutorUserId: params.tutorId, userResponse: this.state.text }, this.onSuccess, this.onError))
  }

  render() {
    const { currentTutor, lang, location } = this.props;
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location} >
        <div className={cx("layout")}>
          <Header
            title={i18n["mlm.mentorship.changeTutor"]}
            items={[
              i18n["breadcrumb.main"],
              i18n["mlm.breadcrumb.mlm"],
              i18n["mlm.mentorship.changeTutor"],
            ]}
            links={["/trainings", "/mlm"]}
            isHr={false}
          />
          {!this.state.isSuccess && <div className={cx("mentorsPage")}>
            {isDataNotFetched(currentTutor) ? <Loader /> : (
              ((_) => {
                const {currentTutor: { data: [tutorInfo]}} = this.props;
                return renderHeader({item: {...tutorInfo, city: tutorInfo.userInfo.city }, i18n, rows, isButtons: true, acceptModal: {} });
              })()
            )}
            <h3 className={cx('changeTutor__subheader')}>{i18n['mlm.mentorship.why-you-want-to-change-tutor']}</h3>
            <div className={cx('changeTutor__messageContainer')}>
              <textarea 
                className={cx('changeTutor__textarea')} 
                rows='6' 
                placeholder={i18n['mlm.mentorship.placeholder-reason-to-change-tutor']} 
                onChange={this.handleTextarea}
                value={this.state.text}
              />
              <div className={cx('changeTutor__actions')}>
                <button className={cx('btn', 'btn-blue')} onClick={this.handleSubmit} >{i18n['mlm.send']}</button>
                <button className={cx('btn', 'btn-blueOutline')} onClick={(_) => browserHistory.push(`${location.query.returnUrl}`)} >{i18n['cancel']}</button>
              </div>
            </div>
            {this.state.isError ? <Modal isButtons={false} onCancel={(_) => this.setState({ isError: '' })} >
              <p>{i18n['error']}</p>
              <p>{this.state.isError}</p>
            </Modal> : null}
          </div>}
          {this.state.isSuccess && <div className={cx("mentorsPage")}>
            <div className={styles.declinedWindowWrapper}>
              <div className={styles.exclamationBlock}>
                <div className={styles.exclamation}></div>
                <div>
                  <p className={styles.headline}>{i18n["mlm.mentorship.changeHeadline"]}</p>
                  <p className={styles.description}>{i18n["mlm.mentorship.declinedDescription"]}</p>
                  <div className={styles.helpBlock}>
                    <div className={styles.helpBlockText}>{i18n["mlm.mentorship.declinedHelpMessage"]}</div>
                    <button onClick={_ => browserHistory.push('/chats/7639')} className={styles.helpBlockButton}>{i18n["mlm.mentorship.declinedSupporButton"]}</button>
                  </div>
                </div>     
              </div>
            </div>
          </div>}
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  const { userToken, userInfo } = state;

  return {
    token: userToken.token,
    userInfo,
    lang: state.lang,
    currentTutor: selectors.selectCurrentTutor(state),
  };
};

ChangeTutorPage = connect(mapStateToProps)(ChangeTutorPage);

export default CSSModules(ChangeTutorPage, styles);