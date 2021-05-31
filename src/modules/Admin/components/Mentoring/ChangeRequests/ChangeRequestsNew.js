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

class ChangeRequestsNew extends Component {
  state = {
    modals: {
        accept: {
          show: false,
          accepted: false,
        },
        reject: {
          show: false,
          accepted: false,
          text: "",
        },
      }
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = {
      take: 10,
      skip: 0,
      status: 'waiting_change'
    };
    await dispatch(ducks.getUserTutorsRequest(data));
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.modals.reject.accepted && !prevState.modals.accept.show) {
      this.props.dispatch(ducks.getUserTutorsRequest({ take: 10, skip: 0, status: 'waiting_change' }))
    }
  }

  toggleModal = (modal) => {
    this.setState({
      modals: {
        ...this.state.modals,
        [modal]: {
          ...this.state.modals[modal],
          show: !this.state.modals[modal].show,
          accepted:
            this.state.modals[modal].accepted && this.state.modals[modal].show
              ? false
              : this.state.modals[modal].show,
        },
      },
    });
  };

  switchModal = (modal, bool, id) => {
    if (modal === 'reject' && bool) {
      this.props.dispatch(ducks.deleteRequestForChange(id))
    }
    this.setState({
      modals: {
        ...this.state.modals,
        [modal]: {
          ...this.state.modals[modal],
          accepted: bool,
        },
      },
    });
  };

  handleModalText = (e) => {
    this.setState({
      modals: {
        ...this.state.modals,
        reject: {
          ...this.state.modals.reject,
          text: e.target.value,
        },
      },
    });
  };

  render() {
    const { lang, requests } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        {isDataNotFetched(requests) ? (
          <Loader />
        ) : (
          <ul className={cx("content")}>
            {requests && requests.data && !requests.data.length ? <Placeholder /> : (
              <li>
                <div className={cx("card")} style={{ marginBottom: '0px'}} >
                  <div className={cx("card__tutor")} style={{background: 'none', marginRight: '20px'}}>
                    <span className={cx("card__title", "card__title-tutor")}>
                      {i18n["admin.mentoring.tutor"]}
                    </span>
                  </div>
                  <div className={cx("card__student")} style={{background: 'none'}}>
                    <span className={cx("card__title")}>
                      {i18n["admin.mentoring.student"]}
                    </span>
                  </div>
                </div>
              </li>
            )}
            {requests && requests.data && requests.data.map((item, index) => (
              <ChangeMentorCard
                key={item.id}
                item={item}
                i18n={i18n}
                modals={{
                  ...this.state.modals,
                  toggleModal: this.toggleModal,
                  switchModal: this.switchModal,
                  handleModalText: this.handleModalText,
                }}
              />
            ))}
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
  };
};

ChangeRequestsNew = connect(mapStateToProps)(ChangeRequestsNew);

export default CSSModules(ChangeRequestsNew, styles);
