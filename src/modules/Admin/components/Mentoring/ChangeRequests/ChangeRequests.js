import React, { Component } from "react";
import { connect } from "react-redux";
import { dict } from "dict";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./styles.css";
import * as selectors from "../../../selectors";
import AdminLayout from "../../AdminLayout";
import ChangeRequestsProcessed from "./ChangeRequestsProcessed";
import ChangeRequestsNew from './ChangeRequestsNew';

const cx = classNames.bind(styles);

const page = "mentor-change";
class ChangeRequests extends Component {
  state = {
    requestType: "new",
  };

  componentDidMount() {
  }

  toggleRadio = (e) => {
    this.setState({
      requestType: e.target.value,
    });
  };

  render() {
    const { location, lang } = this.props;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("layout")}>
          <h1 className={cx("main-title")}>
            {i18n["admin.mentoring.change-requests.title"]}
          </h1>
          <form className={cx("radioButton__form")}>
            <div className={cx("radioButton__wrapper")}>
              <input
                id="new"
                type="radio"
                name="type-of-requests"
                value="new"
                className={cx("radioButton__input")}
                checked={this.state.requestType === "new"}
                onChange={this.toggleRadio}
              />
              <label htmlFor="new" className={cx("radioButton__label")}>
                {i18n["admin.mentoring.change-tutor.radio-buttons.new"]}
              </label>
            </div>
            <div className={cx("radioButton__wrapper")}>
              <input
                id="processed"
                type="radio"
                name="type-of-requests"
                className={cx("radioButton__input")}
                value="processed"
                checked={this.state.requestType === "processed"}
                onChange={this.toggleRadio}
              />
              <label htmlFor="processed" className={cx("radioButton__label")}>
                {i18n["admin.mentoring.change-tutor.radio-buttons.processed"]}
              </label>
            </div>
          </form>
          {this.state.requestType === "new" ? (
            <ChangeRequestsNew />
          ) : (
            <ChangeRequestsProcessed />
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

ChangeRequests = connect(mapStateToProps)(ChangeRequests);

export default CSSModules(ChangeRequests, styles);
