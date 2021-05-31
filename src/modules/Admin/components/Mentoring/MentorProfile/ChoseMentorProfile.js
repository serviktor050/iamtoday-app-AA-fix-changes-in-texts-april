import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./styles.css";
import * as ducks from "../../../ducks";
import * as selectors from "../../../selectors";
import { browserHistory } from "react-router";
import { Header } from "../../../../../components/common/Header";
import { MentorPage } from "./MentorPage";
import { createUserName, isDataNotFetched } from "../../../utils";
import Loader from "../../../../../components/componentKit/Loader";
import Layout from "../../../../../components/componentKit2/Layout";

const cx = classNames.bind(styles);

const page = "chooseMentor";

class ChoseMentorProfile extends Component {
  state = {
    acceptModal: {
      show: false,
      success: false,
      isError: false,
    },
  };

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(ducks.getTutorInfo({ id: params.tutorId }));
  }

  toggleAcceptModal = () => {
    if (this.state.acceptModal.success) {
      browserHistory.push('/trainings')
    }
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        show: !this.state.acceptModal.show,
      },
    });
  };

  onSuccess = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        success: !this.state.acceptModal.success,
      },
    });
  };

  onError = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        isError: !this.state.acceptModal.isError,
      },
    });
  };

  chooseTutor = (id) => {
    const { dispatch } = this.props;
    dispatch(
      ducks.chooseNewTutor(
        { tutorUserId: id },
        { onSuccess: this.onSuccess, onError: this.onError }
      )
    );
  };

  renderModalContent = (item) => {
    const { lang } = this.props;
    const i18n = dict[lang];
    if (this.state.acceptModal.success) {
      return <div>
        <span>{i18n["mlm.mentorship.successRequest"]}</span>
        <div className={cx('success_icon')}></div>
      </div>;
    }
    return (
      <span>
        {i18n["mlm.mentorship.doYouWantTo"]}
        <span style={{ fontWeight: "bold" }}>
          &nbsp;
          {createUserName({
            lastName: item.userInfo.lastName,
            firstName: item.userInfo.firstName,
            middleName: item.userInfo.middleName,
          })}
          &nbsp;
        </span>
        {i18n["mlm.mentorship.becomeYourTutor"]}
      </span>
    );
  };

  render() {
    const { location, lang, currentTutor, params } = this.props;
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location}>
        <div className={cx("layout")}>
          <Header
            title={i18n["admin.mentoring.mentors-list"]}
            items={[
              i18n["breadcrumb.main"],
              i18n["mentoring.tutors-list.title"],
              i18n["menu.tutorPage"],
            ]}
            links={["/trainings", "/chose-mentor"]}
            returnUrl={"/chose-mentor"}
            isHr={false}
          />
          {!isDataNotFetched(currentTutor) ? (
            <MentorPage
              item={currentTutor.data[0]}
              i18n={i18n}
              acceptModal={{
                ...this.state.acceptModal,
                toggleAcceptModal: this.toggleAcceptModal,
                successModal: () => {
                  this.chooseTutor(params.tutorId);
                },
                renderModalContent: this.renderModalContent,
                acceptButtonText: i18n["mlm.mentorship.chooseAsATutor"],
              }}
            />
          ) : (
            <Loader />
          )}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  const { userToken, userInfo } = state;

  return {
    token: userToken.token,
    userInfo,
    lang: state.lang,
    currentTutor: selectors.selectCurrentTutor(state),
    currentRequest: selectors.selectCurrentRequest(state),
  };
};

ChoseMentorProfile = connect(mapStateToProps)(ChoseMentorProfile);

export default CSSModules(ChoseMentorProfile, styles);
