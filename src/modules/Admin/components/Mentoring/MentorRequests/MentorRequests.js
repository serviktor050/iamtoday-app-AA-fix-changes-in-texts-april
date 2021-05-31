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
import RequestCard from "./RequestCard";
import { Placeholder } from "../Placeholder";

const cx = classNames.bind(styles);

const page = "mentor-requests";
class MentorRequests extends Component {
  state = {
    
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = {
      take: 10,
      skip: 0,
      status: 'waiting_new'
    };
    await dispatch(ducks.getUserTutorsRequest(data));
  }

  isDataNotFetched(prop) {
    return !prop || prop.isFetching || !prop.isLoad || !prop.data;
  }

  render() {
    const { location, lang, requests } = this.props;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("layout")}>
          <h1 className={cx("main-title")}>
            {i18n["admin.mentoring.mentor-requests.title"]}
          </h1>
          {this.isDataNotFetched(requests) ? (
            <Loader />
          ) : (
            <ul className={cx("content")}>
              {requests && requests.data && !requests.data.length ? <Placeholder /> 
              :
                (<li>
                  <div className={cx("card")} style={{ marginBottom: "0px" }}>
                    <div
                      className={cx("card__student")}
                      style={{ background: "none", marginRight: "20px" }}
                    >
                      <span className={cx("card__title")}>
                        {i18n["admin.mentoring.student"]}
                      </span>
                    </div>
                    <div
                      className={cx("card__tutor")}
                      style={{ background: "none" }}
                    >
                      <span className={cx("card__title", "card__title-tutor")}>
                        {i18n["admin.mentoring.tutor"]}
                      </span>
                    </div>
                  </div>
                </li>)
              }
              
              
              {requests.data.map((item) => (
                <RequestCard
                  item={item}
                  key={item.id}
                />
              ))}
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
    requests: selectors.selectAllRequests(state),
  };
};

MentorRequests = connect(mapStateToProps)(MentorRequests);

export default CSSModules(MentorRequests, styles);
