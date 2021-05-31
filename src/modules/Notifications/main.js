import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as ducks from './ducks';
import * as selectors from './selectors';
import classNames from 'classnames/bind';
import moment from 'moment'
import { dict } from "dict";
import { browserHistory } from 'react-router';
import * as R from 'ramda';

const signalR = require("@aspnet/signalr");

import { } from "actions";

import styles from "./styles.css";
import { Task } from './components/Task';
import { Portal, isDataNotFetched } from 'modules/utils';
import { MenuNotification } from './components/MenuNotification';
const cx = classNames.bind(styles);


/**
 *  Контейнер Notifications.
 *  Используется для отображения Notifications
 *
 */
class Notifications extends Component {
  static propTypes = {};

  state = {
    isOpenReaded: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(ducks.getNotificationsList());
    dispatch(ducks.calendarGetTodayTasks({ dateStart: moment().startOf('day').format(), dateEnd: moment().endOf('day').format() }));
    this.updateMessage();
    window.addEventListener("click", this.handleDocumentClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleDocumentClick);
    this.connection
      .stop()
      .then(() => { })
      .catch((err) => console.log(err));
  }

  handleDocumentClick = (evt) => {
    const { isOpen } = this.props;
    const area = this.refs.notifications;
    if (isOpen && area && !area.contains(evt.target)) {
      this.props.dispatch(ducks.toggleCard(false));
    }
  };

  componentDidUpdate(prevProps) {
    const { notify, isOpen } = this.props;
    if (notify.unReadList.length && isOpen && isOpen !== prevProps.isOpen) {
      this.listenToReadMessage();
    }
  }

  openCard = (e) => {
    const { dispatch, isOpen } = this.props;
    dispatch(ducks.toggleCard(true));
  };

  closeCard = () => {
    const { dispatch } = this.props;
    dispatch(ducks.toggleCard(false));
  };

  updateMessage() {
    const { dispatch, userInfo } = this.props;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://online.antiage-expert.com/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    this.connection.on("Send", (message) => {
      if (message === "update_notifications") {
        dispatch(ducks.getNotificationsList());
      }
    });

    this.connection
      .start()
      .then(() => {
        return this.connection.invoke("ConnectUser", userInfo.data.id);
      })
      .catch((err) => console.log(err));
  }

  listenToReadMessage = () => {
    const { userInfo, dispatch } = this.props;
    if (this.connection) {
      this.connection.invoke("NotificationsSetRead", userInfo.data.id);
      dispatch(ducks.setUnReadMessage());
    }
  };

  toggleReaded = () => {
    this.setState({
      isOpenReaded: !this.state.isOpenReaded,
    });
  };

  redirectToPage = (route) => {
    const url = route.split('/').slice(3).join('/');
    browserHistory.push(`${url}`)
  };

  decoratePoints = (points) => {
    if (points === 0) {
      return ""
    } else if (parseInt(points) > 0) {
      return `+${points}`
    } else {
      return points
    }
    /*{parseInt(item.points) < 0
      ? item.points
      : `+${item.points}`}*/
  }

  separateTasksByTime = (todayTasks) => {
    const tasks = R.path(['data'], todayTasks);
    if (typeof tasks !== 'object' || !tasks || !tasks.length) {
      return { finishedTasks: [], unfinishedTasks: [] }
    }
    const dayTasks = tasks.find((task) => task.date === moment().format('YYYY-MM-DD'))
    const finishedTasks = dayTasks.tasks.filter((task) => moment(task.dateEnd).isBefore(moment()));
    const unfinishedTasks = dayTasks.tasks.filter((task) => finishedTasks.indexOf(task) < 0);
    return { finishedTasks, unfinishedTasks }
  }

  render() {
    const { isOpen, userInfo, todayTasks, notify, unReadMessage, isMenuLoaded, spaceLeft } = this.props;
    const i18n = dict[this.props.lang];

    const { finishedTasks, unfinishedTasks } = this.separateTasksByTime(todayTasks);

    const countOfTasks = Math.trunc((spaceLeft - 50) / 55) + 1;

    const portal = unfinishedTasks.length ? (
      <div className={cx('portal__wrapper')}>
        <p className={cx('portal__today')}>
          {i18n['notifications.today']}
          <span className={cx('portal__today_label')}>{finishedTasks.length + unfinishedTasks.length}</span>
        </p>
        {unfinishedTasks.slice(0, countOfTasks).map((task) => <MenuNotification task={task} />)}
      </div>
    ) : null

    return (

      <div
        ref="notifications"
        className={cx("notifications", {
          wide: true,
        })}
      >
        <div className={cx("bell", { isOpen: true })} onClick={this.openCard}>
          <svg className={cx("icon-bell")}>
            <use xlinkHref="#bell" />
          </svg>
          {unReadMessage && !isOpen ? (
            <div className={cx("amount")}>
              <span>{unReadMessage}</span>
            </div>
          ) : null}
        </div>
        {isOpen && (
          <div className={cx("card")}>
            <div className={cx("bg-grey")}></div>
            <div className={cx("content-wrap")}>
              <div className={cx("title")}>
                <div>Уведомления</div>
                <div className={cx("close")} onClick={this.closeCard}>
                  <svg className={cx("icon-close")}>
                    <use xlinkHref="#close" />
                  </svg>
                </div>
              </div>
              <div className={cx("content")}>
                <div className={cx("list")}>
                  {notify.unReadList.map((item) => {
                    return (
                      <div className={cx("item")} key={item.id}>
                        <div className={cx("photo")}>
                          <img src={item.icon} alt="" />
                        </div>
                        <div className={cx("info")}>
                          <div className={cx("header-item")}>
                            <p><span className={cx("text")}>{item.title}</span>
                              <span className={cx("value")}>
                                {this.decoratePoints(item.points)}
                              </span>
                            </p>
                            <p className={cx("date")}>
                              {moment(item.createTs).format("DD.MM.YYYY, hh:mm")}
                            </p>
                          </div>
                          <p className={cx("desc")}>{item.text}</p>
                          <button className={cx("link-button")} onClick={() => this.redirectToPage(item.detailsLink)}>{i18n["notifications.buttonLink"]}</button>
                        </div>
                      </div>
                    );
                  })}

                  {unfinishedTasks.map((task) => <Task task={task} />)}

                  {notify.list.length > 0 && (
                    <button
                      className={cx("separator")}
                      onClick={this.toggleReaded}
                      type="button"
                    >
                      Просмотренные ранее
                  </button>
                  )}

                  <div
                    className={cx("list-readed", {
                      open: this.state.isOpenReaded,
                    })}
                  >
                    {finishedTasks.map((task) => <Task task={task} />)}
                    
                    {this.state.isOpenReaded &&
                      notify.list.map((item) => {
                        return (
                          <div className={cx("item")} key={item.id}>
                            <div className={cx("photo")}>
                              <img src={item.icon} alt="" />
                            </div>
                            <div className={cx("info")}>
                              <div className={cx("header-item")}>
                                <p><span className={cx("text")}>{item.title}</span>
                                  <span className={cx("value")}>
                                    {this.decoratePoints(item.points)}
                                  </span></p>
                                <p className={cx("date")}>
                                  {moment(item.createTs).format("DD.MM.YYYY, hh:mm")}
                                </p>
                              </div>
                              <div className={cx("desc")}>{item.text}</div>
                              <button className={cx("link-button")} onClick={() => this.redirectToPage(item.detailsLink)}>{i18n["notifications.buttonLink"]}</button>
                            </div>
                          </div>
                        );
                      })}

                  </div>
                </div>
              </div>
            </div>
          </div>)}
          {isMenuLoaded && <Portal id='calendar-notifications-portal' children={portal} />} 
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: selectors.isOpen(state),
    notify: selectors.notify(state),
    unReadMessage: selectors.unReadMessage(state),
    todayTasks: selectors.selectTodayTasks(state),
    isMenuLoaded: state.menuStatus.isLoaded,
    spaceLeft: state.menuStatus.spaceLeft,
    lang: state.lang
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  Notifications
);
