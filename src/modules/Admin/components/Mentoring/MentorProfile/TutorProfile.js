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

const page = "tutorProfile";

class TutorProfile extends Component {
  state = {

  };

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(ducks.getTutorInfo({ id: params.tutorId }));
  }

  render() {
    const { location, lang, currentTutor } = this.props;
    const i18n = dict[lang];
    const { returnUrl } = location.query
    return (
      <Layout page={page} location={location}>
        <div className={cx("layout")}>
          <Header
            title={i18n["admin.mentoring.mentors-list"]}
            items={[
              i18n["breadcrumb.main"],
              i18n["menu.tutorPage"],
            ]}
            links={["/trainings"]}
            returnUrl={returnUrl || "/trainings"}
            isHr={false}
          />
          {!isDataNotFetched(currentTutor) ? (
            <MentorPage
              item={currentTutor.data[0]}
              i18n={i18n}
              acceptModal={{
                ...this.state.acceptModal,
                toggleAcceptModal: this.toggleAcceptModal,
                successModal: () => {},
                renderModalContent: () => {},
                acceptButtonText: i18n["mlm.mentorship.chooseAsATutor"],
              }}
              isButtons={false}
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

TutorProfile = connect(mapStateToProps)(TutorProfile);

export default CSSModules(TutorProfile, styles);
