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
import { ChangeMentorCard } from "./ChangeMentorCard";
import { browserHistory } from "react-router";
import { createUserName, isDataNotFetched } from "../../../utils";
import { Placeholder } from "../Placeholder";

const cx = classNames.bind(styles);

class ChangeRequestsProcessed extends Component {
  state = {};

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = {
      take: 10,
      skip: 0,
      status: 'waiting_tutor'
    };
    dispatch(ducks.getUserTutorsRequest(data));
    dispatch(ducks.getAcceptedUserTutorsRequest({status: 'approved'}));
  }

  render() {
    const { lang, requests, acceptedRequests } = this.props;
    const i18n = dict[lang];
    const isRequests = (requests && requests.data && !requests.data.length &&
      acceptedRequests && acceptedRequests.data && !acceptedRequests.data.length)
    return (
      <div>
        {isDataNotFetched(requests) && isDataNotFetched(acceptedRequests) ? (
          <Loader />
        ) : (
          <ul className={cx("content")}>
            
            {isRequests ? <Placeholder /> : (
                <li>
                  <div className={cx("card")} style={{ marginBottom: "0px" }}>
                    <div
                      className={cx("card__tutor")}
                      style={{ background: "none", marginRight: "20px" }}
                    >
                      <span className={cx("card__title", "card__title-tutor")}>
                        {i18n["admin.mentoring.tutor"]}
                      </span>
                    </div>
                    <div
                      className={cx("card__student")}
                      style={{ background: "none" }}
                    >
                      <span className={cx("card__title")}>
                        {i18n["admin.mentoring.student"]}
                      </span>
                    </div>
                  </div>
                </li>
              )}
            {requests.data.map((item) => (
              <ChangeMentorCard
                key={item.id}
                item={item}
                i18n={i18n}
                processed={true}
              />
            ))}
            {acceptedRequests && acceptedRequests.data && acceptedRequests.data.map((item, index) => <ChangeMentorCard key={index} item={item} i18n={i18n} processed={true} accepted={true} />)}
          </ul>
        )}
      </div>
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
    acceptedRequests: selectors.selectAllAcceptedRequests(state),
  };
};

ChangeRequestsProcessed = connect(mapStateToProps)(ChangeRequestsProcessed);

export default CSSModules(ChangeRequestsProcessed, styles);
