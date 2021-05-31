import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./styles.css";
import * as ducks from "../../../ducks";
import * as selectors from "../../../selectors";
import AdminLayout from "../../AdminLayout";
import Loader from "components/componentKit/Loader";
import { browserHistory } from "react-router";
import { Header } from "../../../../../components/common/Header";
import { MentorPage } from "./MentorPage";
import petrovich from "petrovich";
import { createUserName, isDataNotFetched } from "../../../utils";

const cx = classNames.bind(styles);

const page = "recommendedMentor";

class RecommendedMentorProfile extends Component {
  state = {
    acceptModal: {
      show: false,
      success: false,
      isError: false
    },
  };

  componentDidMount() {
    const {dispatch, params} = this.props
    dispatch(ducks.getTutorInfo({id: params.id}))
  }

  toggleAcceptModal = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        show: !this.state.acceptModal.show,
      },
    });
  };

  recommendTutor = (id) => {
    const { dispatch } = this.props;
    dispatch(ducks.addTutor(id));
  };

  renderModalContent = (item) => {
    const { declinedRequests, currentRequest, lang } = this.props;
    const i18n = dict[lang];
    const currentStudent = declinedRequests.data.find(
      (student) => student.id === currentRequest
    ).userInfo;
    const { firstName, lastName, middleName } = currentStudent;
    return (
      <span>
        {i18n["admin.mentoring.mentor-recommendation.question-start"]}
        <span style={{ fontWeight: "bold" }}>
          &nbsp;
          {createUserName({
            lastName: item.userInfo.lastName,
            firstName: item.userInfo.firstName,
            middleName: item.userInfo.middleName,
          })}
        </span>
        {` ${i18n["admin.mentoring.mentor-recommendation.question-end"]} ${
          petrovich(
            {
              gender: currentStudent.gender,
              last: lastName,
            },
            "dative"
          ).last
        } ${firstName && firstName.slice(0, 1)}.${
          middleName && middleName.slice(0, 1)
        }.?`}
      </span>
    );
  };

  render() {
    const { location, lang, currentTutor } = this.props;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("layout")}>
          <Header
            title={i18n["admin.mentoring.mentors-list"]}
            items={[
              i18n["admin.main"],
              i18n["admin.mentoring.declined-requests.title"],
              i18n["admin.mentoring.mentors-list"],
            ]}
            links={["/admin", "/admin/declinedRequests"]}
            returnUrl={"/admin/declinedRequests"}
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
                  this.recommendTutor(currentTutor.data[0].userId);
                  browserHistory.push("/admin/declinedRequests");
                },
                renderModalContent: this.renderModalContent,
              }}
            />
          ) : (
            <Loader />
          )}
        </div>
      </AdminLayout>
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
    declinedRequests: selectors.selectAllRequests(state),
  };
};

RecommendedMentorProfile = connect(mapStateToProps)(RecommendedMentorProfile);

export default CSSModules(RecommendedMentorProfile, styles);
