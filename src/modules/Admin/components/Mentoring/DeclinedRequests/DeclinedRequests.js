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
import { DeclineCard } from "./DeclineCard";
import { browserHistory } from "react-router";
import api from 'utils/api';
import cookie from "react-cookie";
import { Placeholder } from "../Placeholder";

const cx = classNames.bind(styles);

const page = "mentor-declined";

const initialState = {
  answerWindow: {
    show: false,
  },
  form: {
    text: "",
  },
  tutorsIds: [],
  showTutor: false,
  currentRequest: null,
  currentUser: null,
  showMentorsTable: false,
};

class DeclinedRequests extends Component {
  state = {
    ...initialState,
  };

  async componentDidMount() {
    const { dispatch, prevState } = this.props;
    const data = {
      take: 10,
      skip: 0,
      status: 'rejected_tutor',
    };
    await dispatch(ducks.getUserTutorsRequest(data));
    if (prevState) {
      this.setState({ ...prevState });
    }
  }

  componentDidUpdate(prevProps, previousState) {
    const { declinedRequests, prevState } = this.props;
    if (
      prevProps.declinedRequests !== declinedRequests &&
      declinedRequests.data &&
      !prevState
    ) {
      let requests = {};
      declinedRequests.data.forEach((item) => {
        requests[`${item.id}`] = false;
      });
      this.setState({
        answerWindow: {
          ...this.state.answerWindow,
          show: requests,
        },
      });
    }
    if (prevState && prevProps.prevState !== prevState) {
      this.setState({ ...prevState });
    }
  }

  async componentWillUnmount() {
    const { dispatch } = this.props;
    await dispatch(ducks.saveState(this.state));
  }

  toggleAnswerWindow = (id) => {
    const { declinedRequests } = this.props;
    this.setState({
      answerWindow: {
        ...this.state.answerWindow,
        show: {
          ...this.state.answerWindow.show,
          [`${id}`]: !this.state.answerWindow.show[`${id}`],
        },
      },
      currentRequest: this.state.currentRequest ? null : id,
      currentUser: this.state.currentUser
        ? null
        : declinedRequests.data.find((item) => item.id === id).userInfo,
      tutorsIds: [],
    });
  };

  toggleMentorsTable = () => {
    this.setState({ showMentorsTable: !this.state.showMentorsTable });
  };

  openTutorsPage = (id) => {
    const { dispatch } = this.props;
    dispatch(ducks.saveState(this.state));
    browserHistory.push(`/admin/declinedRequests/${id}`);
  };

  removeTutor = (id) => {
    const { dispatch } = this.props;
    dispatch(ducks.removeTutor(id));
  };

  changeFormField = (event) => {
    this.setState({
      form: { ...this.state.form, [event.target.name]: event.target.value },
    });
  };

  recommendTutor = () => {
    const { dispatch, declinedRequests } = this.props;
    const userId = declinedRequests.data.find(
      (request) => this.state.currentRequest === request.id
    ).userId;
    this.state.tutorsIds.forEach((item) => {
      api.recommendTutorToStudent({
          AuthToken: cookie.load('token'),
          data: {
            status: 'waiting_user',
            userId,
            tutorUserId: item
          }
        })
    })
  };

  sendAnswer = async (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();
    await dispatch(
      ducks.approveDeclinedRequest({
        id: this.state.currentRequest,
        managerResponse: this.state.form.text,
      })
    );
    const data = {
      take: 10,
      skip: 0,
      status: 'rejected_tutor'
    };
    await this.recommendTutor()
    await dispatch(ducks.getUserTutorsRequest(data));
    await this.setState(initialState);
  };

  isDataNotFetched(prop) {
    return !prop || prop.isFetching || !prop.isLoad || !prop.data;
  }

  render() {
    const { location, lang, declinedRequests, tutorsList } = this.props;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("layout")}>
          <h1 className={cx("main-title")}>
            {i18n["admin.mentoring.declined-requests.title"]}
          </h1>
          {this.isDataNotFetched(declinedRequests) &&
          this.isDataNotFetched(tutorsList) ? (
            <Loader />
          ) : (
            <ul className={cx("content")}>
              
              {!declinedRequests.data.length ? <Placeholder /> : (
                <li>
                  <div className={cx("card")} style={{ marginBottom: '0px'}} >
                    <div className={cx("card__student")} style={{background: 'none', marginRight: '20px'}}>
                      <span className={cx("card__title")}>
                        {i18n["admin.mentoring.student"]}
                      </span>
                    </div>
                    <div className={cx("card__tutor")} style={{background: 'none'}}>
                      <span className={cx("card__title", "card__title-tutor")}>
                        {i18n["admin.mentoring.tutor"]}
                      </span>
                    </div>
                  </div>
                </li>
              )}
              {!this.state.currentRequest ? (
                declinedRequests.data.map((item, index) => (
                  <DeclineCard
                    i18n={i18n}
                    item={item}
                    key={index}
                    answerWindow={this.state.answerWindow}
                    toggleAnswerWindow={this.toggleAnswerWindow}
                    tutorsIds={this.state.tutorsIds}
                    removeTutor={this.removeTutor}
                    mentorTable={{
                      handleClick: this.openTutorsPage,
                    }}
                  />
                ))
              ) : (
                <DeclineCard
                  i18n={i18n}
                  item={declinedRequests.data.find(
                    (item) => item.id === this.state.currentRequest
                  )}
                  answerWindow={this.state.answerWindow}
                  form={{
                    ...this.state.form,
                    changeFormField: this.changeFormField,
                    currentUser: this.state.currentUser,
                  }}
                  toggleAnswerWindow={this.toggleAnswerWindow}
                  tutorsIds={this.state.tutorsIds}
                  removeTutor={this.removeTutor}
                  sendAnswer={this.sendAnswer}
                  mentorsTableHud={{
                    toggleHud: this.toggleMentorsTable,
                    hud: this.state.showMentorsTable,
                  }}
                  mentorTable={{
                    handleClick: this.openTutorsPage,
                  }}
                />
              )}
            </ul>
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
    declinedRequests: selectors.selectAllRequests(state),
    prevState: selectors.selectDeclinedRequestsState(state),
    tutorsList: selectors.selectTutorsList(state),
  };
};

DeclinedRequests = connect(mapStateToProps)(DeclinedRequests);

export default CSSModules(DeclinedRequests, styles);
