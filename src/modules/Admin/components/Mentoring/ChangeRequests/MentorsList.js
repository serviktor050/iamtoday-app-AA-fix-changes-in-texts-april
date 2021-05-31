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
import petrovich from "petrovich";
import TableMentor from "../../../../ChoseMentor/components/table";

const cx = classNames.bind(styles);

const page = "mentors-list";
class MentorsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  renderInfo = (requests, i18n, params) => {
    const currentRequest = requests.data.find(
      (request) => request.id === Number(params.id)
    );
    const { userInfo } = currentRequest;
    const { lastName, firstName, middleName } = userInfo;
    const fioDative = `${
      petrovich(
        {
          gender: userInfo.gender,
          last: lastName,
        },
        "dative"
      ).last
    }`;
    return (
      <div className={cx("info")}>
        <div className={cx("info__img")}></div>
        <span className={cx("info__text")}>{`${
          i18n["admin.mentoring.choose-new-tutor-for"]
        } ${fioDative} ${firstName && firstName.slice(0, 1)}.${
          middleName && middleName.slice(0, 1)
        }.`}</span>
      </div>
    );
  };

  render() {
    const { params, lang, requests, location } = this.props;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("layout")}>
          <h1 className={cx("main-title")}>
            {i18n["admin.mentoring.mentors-list"]}
          </h1>
          {requests ? (
            <div>
              {this.renderInfo(requests, i18n, params)}
              <TableMentor
                handleClick={(tutorId) =>
                  browserHistory.push(
                    `/admin/changeRequests/${params.id}/${params.userId}/${tutorId}`
                  )
                }
              />
            </div>
          ) : (
            browserHistory.push("/admin/changeRequests")
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
    requests: selectors.selectAllRequests(state),
  };
};

MentorsList = connect(mapStateToProps)(MentorsList);

export default CSSModules(MentorsList, styles);
