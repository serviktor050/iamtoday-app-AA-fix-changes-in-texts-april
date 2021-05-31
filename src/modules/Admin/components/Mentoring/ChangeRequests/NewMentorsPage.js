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
import { MentorPage } from "../MentorProfile/MentorPage";
import petrovich from "petrovich";
import { createUserName, isDataNotFetched } from "../../../utils";

const cx = classNames.bind(styles);

const page = "new-student-mentor";

class NewMentorsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptModal: {
        show: false,
        success: false,
        isError: false,
      },
    };
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(ducks.getTutorInfo({ id: params.tutorId }));
    dispatch(ducks.getUserInfo(params.userId));
  }

  toggleAcceptModal = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        show: !this.state.acceptModal.show,
      },
    });
  };

  renderModalContent = (item) => {
    const { currentStudent, lang } = this.props;
    const { data } = currentStudent;
    const i18n = dict[lang];
    const { firstName, lastName, middleName } = data;
    const { success } = this.state.acceptModal;
    const fioDative = petrovich(
      {
        gender: data.gender,
        last: lastName,
      },
      "dative"
    ).last;
    return !success ? (
      <span>
        {i18n["admin.mentoring.choose-new-tutor.modal-question.first"]}
        <span style={{ fontWeight: "bold" }}>
          &nbsp;
          {createUserName({
            lastName: item.userInfo.lastName,
            firstName: item.userInfo.firstName,
            middleName: item.userInfo.middleName,
          })}
        </span>
        {` ${
          i18n["admin.mentoring.choose-new-tutor.modal-question.second"]
        } ${fioDative} ${firstName && firstName.slice(0, 1)}.${
          middleName && middleName.slice(0, 1)
        }.?`}
      </span>
    ) : (
      <div className={cx("modal__container")}>
        <div className={cx("cirlce")}></div>
        <p style={{ fontWeight: "bold" }}>
          {i18n["admin.mentoring.request-accepted"]}
        </p>
        <p>{`${i18n["admin.mentoring.change-tutor.tutor"]} ${fioDative} ${
          firstName && firstName.slice(0, 1)
        }.${middleName && middleName.slice(0, 1)}.`}</p>
        <p>
          {`${item.userInfo.lastName}
            ${item.userInfo.firstName.slice(0, 1)}.
            ${item.userInfo.middleName.slice(0, 1)}.`}
        </p>
      </div>
    );
  };

  setNewStudent = (request) => {
    const { dispatch } = this.props;
    dispatch(
      ducks.setNewTutorForStudent(request, {
        onSuccess: this.onSuccess,
        onError: this.onError,
      })
    );
  };

  onSuccess = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        success: true,
      },
    });
    return browserHistory.push('/admin/changeRequests')
  };

  onError = () => {
    this.setState({
      acceptModal: {
        ...this.state.acceptModal,
        isError: true,
      },
    });
  };

  renderMentorsPage = () => {
    const { currentTutor, params, lang } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        <MentorPage
          item={currentTutor.data[0]}
          i18n={i18n}
          acceptModal={{
            ...this.state.acceptModal,
            toggleAcceptModal: this.toggleAcceptModal,
            successModal: () =>
              this.setNewStudent({
                id: params.id,
                userId: params.userInfo,
                tutorUserId: params.tutorId,
              }),
            acceptButtonText: i18n["admin.mentoring.choose-new-tutor-button"],
            renderModalContent: this.renderModalContent,
          }}
        />
      </div>
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
              i18n["admin.mentoring.change-requests.title"],
              i18n["admin.mentoring.mentors-list"],
            ]}
            links={["/admin", "/admin/changeRequests"]}
            returnUrl={"/admin/changeRequests"}
          />
          {
            !isDataNotFetched(currentTutor) ? (
              this.renderMentorsPage()
            ) : (
              <Loader />
            )
            // browserHistory.push("/admin/changeRequests")
          }
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
    requests: selectors.selectAllRequests(state),
    currentTutor: selectors.selectCurrentTutor(state),
    currentStudent: selectors.selectCurrentUser(state),
  };
};

NewMentorsPage = connect(mapStateToProps)(NewMentorsPage);

export default CSSModules(NewMentorsPage, styles);
