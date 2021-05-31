import PropTypes from 'prop-types';
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../actions";
import { api, domen } from "../../../config.js";
import Menu from "../../../components/todayTask/Menu";
import HeaderTask from "../../../components/componentKit2/HeaderTask";
import MobileLeftMenu from "../../../components/componentKit2/MobileLeftMenu";
import CSSModules from "react-css-modules";
import styles from "./adminLayout.css";
import LoadingView from "../../../components/componentKit/LoadingView";
import { Link } from "react-router";
import MiniChat from "../../../components/Chat/MiniChat";
import classNames from "classnames";
import cookie from "react-cookie";
import { dict } from "dict";

/**
 *  Компонент AdminLayout.
 *
 *
 */
const isAlfa = domen.isAlfa;

import ScrollToTop from "react-scroll-up";
let contentStyle = {
  borderRadius: "18px",
  padding: "30px",
  textAlign: "center",
};
const modalStyle = {
  maxWidth: "500px",
  width: "90%",
};

const scrollUpStyle = {
  zIndex: 2000,
  position: "fixed",
  fontSize: 16,
  right: "10px",
  bottom: "51%",
  cursor: "pointer",
  transitionDuration: "0.2s",
  transitionTimingFunction: "linear",
  transitionDelay: "0s",
};

class AdminLayout extends Component {
  static propTypes = {
    profileData: PropTypes.object,
    selectedTaskDay: PropTypes.string.isRequired,
    page: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const {
      dispatch,
      page,
      fetchTaskDayIfNeeded,
      selectedTaskDay,
      sign,
      location,
    } = this.props;
    await setTimeout(() => {
      dispatch({ type: "SET_MENU_LIST", page });
    }, 0);

    if (sign.isRegistered) {
      fetchTaskDayIfNeeded(selectedTaskDay);
    }
    this.sengLogPageView(location);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchTaskDayIfNeeded, selectedTaskDay, sign } = this.props;

    if (nextProps.sign.isRegistered !== sign.isRegistered) {
      if (nextProps.sign.isRegistered) {
        fetchTaskDayIfNeeded(selectedTaskDay);
      }
    }
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.sengLogPageView(nextProps.location);
    }
  }

  sengLogPageView(location) {
    const urls = location.pathname.split("/");
    const url = location.pathname === "/" ? "smm" : urls[1];
    const params = urls[2] ? urls[2] : null;
    const authToken = cookie.load("token");

    if (!authToken) {
      return;
    }

    const payload = {
      authToken: authToken,
      data: {
        url,
        parameters: params ? params : null,
      },
    };
    return fetch(`${api}/data/log-pageView`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json();
      })
      .catch(console.error);
  }

  modalDialog = () => {
    this.refs.isNotRegs.show();
  };

  render() {
    const {
      userInfo,
      lang,
      setTypeId,
      scroller,
      taskDay,
      errorModal,
      loadingModal,
      changeChatType,
      clearRenderChat,
      setAuth,
      params,
      page,
      setToken,
      location,
      showMobileLeftMenu,
      showLeftMenu,
      chats,
      setUserProfile,
      setSimpleRegs,
      isLoadSmm,
      hideLeftMenu,
      menuList,
      calendarLoadSlow,
      prevSeasons,
      smm,
      sign,
    } = this.props;

    const i18n = dict[lang];
    const { isRegistered, isSimpleRegs } = sign;
    const isEmpty = !taskDay || !taskDay.data || taskDay.data.length === 0;
    const { firstName, lastName, program, photo, gender, role } = userInfo.data;
    let calendar, id;
    const isUnipro = domen.isUnipro;

    if (isAlfa) {
      document.body.style.backgroundColor = "#f9f0f0";
    }
    if (isUnipro) {
      document.body.style.backgroundColor = "#dbe9f2";
    }

    if (!isEmpty) {
      calendar = taskDay.data[0].calendar;
      id = taskDay.data[0].id;
    }
    if (smm && !isLoadSmm) {
      return (
        <LoadingView isUnipro={isUnipro} title={dict[lang]["regs.loading"]} />
      );
    }

    const sidebar = (
      <div className={styles.gridCellLayoutMenu14}>
        {userInfo.data.role === 4 && isRegistered && isSimpleRegs && (
          <button
            className={styles.btnAction}
            onClick={() => {
              browserHistory.push("/signup/params");
            }}
          >
            Принять участие
          </button>
        )}
        <div
          className={classNames(styles.gridLayoutMenuInner, {
            [styles.hidden]: userInfo.data.role === 4 && isRegistered,
          })}
        >
          {/*{*/}
          {/*smm && !isRegistered  ?*/}
          {/*<LoginValidationFormWrapper*/}
          {/*smm={true}*/}
          {/*setAuth={setAuth}*/}
          {/*setSimpleRegs={setSimpleRegs}*/}
          {/*setUserProfile={setUserProfile}*/}
          {/*setToken={setToken}*/}
          {/*errorModal={errorModal}*/}
          {/*loadingModal={loadingModal}*/}
          {/*modalDialog={this.modalDialog}*/}
          {/*/> : null*/}
          {/*}*/}
          {isRegistered ? (
            <Menu
              fullName={`${firstName} ${lastName}`}
              dayId={id}
              unReadMsgs={chats.unReadMsgs}
              prevSeasons={prevSeasons}
              program={program}
              gender={gender}
              location={location}
            />
          ) : null}

          {/*{!isEmpty  && isRegistered ?*/}
          {/*!calendarLoadSlow*/}
          {/*? <CalendarList*/}
          {/*calendar={calendar}*/}
          {/*dayId={id} role={role}*/}
          {/*privateChatId={actions.PRIVATE_CHAT_ID}*/}
          {/*setTypeId={setTypeId}*/}
          {/*changeChatType={changeChatType}*/}
          {/*clearRenderChat={clearRenderChat}*/}
          {/*/>*/}
          {/*: <CalendarLoader/> : null*/}
          {/*}*/}
        </div>
      </div>
    );

    return (
      <div id="layout" className={styles.layout}>
        {scroller && (
          <div className={styles.btnGoBack}>
            <ScrollToTop style={scrollUpStyle} c showUnder={160}>
              <div className={styles.btnGoBack}>
                <svg className={styles.svgIcoArrowUp}>
                  <use xlinkHref="#arrow_scroller"></use>
                </svg>
              </div>
            </ScrollToTop>
          </div>
        )}
        <HeaderTask
          program={program}
          showLeftMenu={showLeftMenu}
          fullName={
            firstName && lastName ? `${firstName} ${lastName}` : "Гость"
          }
          avatar={photo}
          setAuth={setAuth}
          setSimpleRegs={setSimpleRegs}
          isSimpleRegs={isSimpleRegs}
          smm={smm}
        />

        {showMobileLeftMenu && isRegistered && (
          <Menu
            dayId={id}
            isMobile={true}
            isRegistered={isRegistered}
            hideMenu={hideLeftMenu}
            userInfo={userInfo}
            isSimpleRegs={isSimpleRegs}
          />
        )}

        {/* {!isEmpty &&
          page !== "chats" &&
          isRegistered &&
          !isSimpleRegs &&
          !window.mobilecheck() &&
          !window.mobileAndTabletcheck() && (
            <MiniChat params={params} taskDay={taskDay.data[0]} />
          )} */}

        <div
          className={classNames(styles.layoutInner, {
            [styles.layoutInnerSmm]: smm,
          })}
        >
          <div className={styles.grid}>
            {sidebar}

            <div className={styles.gridCellLayoutContentPocket34}>
              <div
                className={classNames(styles.layoutWrap, {
                  [styles.layoutWrapSmm]: smm,
                })}
              >
                {this.props.children}
              </div>
            </div>
          </div>
        </div>

        {isRegistered && !isSimpleRegs && (
          <ul className={styles.menuMobBottom}>
            <li
              className={
                menuList[0].active
                  ? styles.menuMobBottomItemActive
                  : styles.menuMobBottomItem
              }
            >
              <Link to={"/trainings"} className={styles.menuMobBottomItemInner}>
                <span className={styles.menuMobBottomIco}>
                  <svg className={styles.svgIcoBookMobile}>
                    <use xlinkHref="#lektoriy"></use>
                  </svg>
                </span>
                <span className={styles.menuMobBottomTitle}>
                  {i18n["menu.lektoriy"]}
                </span>
              </Link>
            </li>
            <li
              className={
                menuList[2].active
                  ? styles.menuMobBottomItemActive
                  : styles.menuMobBottomItem
              }
            >
              <Link to={"/purchases"} className={styles.menuMobBottomItemInner}>
                <span className={styles.menuMobBottomIco}>
                  <svg className={styles.svgIcoFoodMobile}>
                    <use xlinkHref="#lektoriy"></use>
                  </svg>
                </span>
                <span className={styles.menuMobBottomTitle}>
                  {i18n["menu.purchases"]}
                </span>
              </Link>
            </li>
            {menuList[3] && !menuList[3].disabled && (
              <li
                className={
                  menuList[3] && menuList[3].active === true
                    ? styles.menuMobBottomItemActive
                    : styles.menuMobBottomItem
                }
              >
                <Link to={"/quiz"} className={styles.menuMobBottomItemInner}>
                  <span className={styles.menuMobBottomIco}>
                    <svg className={styles.svgIcoBookMobile}>
                      <use xlinkHref="#quiz"></use>
                    </svg>
                  </span>
                  <span className={styles.menuMobBottomTitle}>
                    {i18n["menu.quiz"]}
                  </span>
                </Link>
              </li>
            )}
            <li
              className={
                menuList[6] && menuList[6].active
                  ? styles.menuMobBottomItemActive
                  : styles.menuMobBottomItem
              }
            >
              <Link to={"/chats"} className={styles.menuMobBottomItemInner}>
                <span className={styles.menuMobBottomIco}>
                  <svg className={styles.svgIcoPhoto}>
                    <use xlinkHref="#ico-chat"></use>
                  </svg>
                </span>
                <span className={styles.menuMobBottomTitle}>
                  {i18n["menu.chat"]}
                </span>
              </Link>
            </li>
            <li
              className={
                menuList[5] && menuList[5].active
                  ? styles.menuMobBottomItemActive
                  : styles.menuMobBottomItem
              }
            >
              <Link to={"/smm"} className={styles.menuMobBottomItemInner}>
                <span className={styles.menuMobBottomIco}>
                  <svg className={styles.svgIcoBookMobile}>
                    <use xlinkHref="#ico-msg"></use>
                  </svg>
                </span>
                <span className={styles.menuMobBottomTitle}>
                  {i18n["menu.news"]}
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectedTaskDay,
    recivedTaskDay,
    chats,
    menuList,
    sign,
    userInfo,
    userToken,
    showMobileLeftMenu,
    lang,
  } = state;

  const { isFetching, lastUpdated, taskDay } = recivedTaskDay[
    selectedTaskDay
  ] || {
    isFetching: true,
    taskDay: null,
  };

  return {
    menuList,
    chats,
    sign,
    showMobileLeftMenu,
    taskDay,
    selectedTaskDay,
    userInfo,
    token: userToken.token,
    lang,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setTypeId: bindActionCreators(actions.setTypeId, dispatch),
  changeChatType: bindActionCreators(actions.changeChatType, dispatch),
  clearRenderChat: bindActionCreators(actions.clearRenderChat, dispatch),
  fetchTaskDayIfNeeded: bindActionCreators(
    actions.fetchTaskDayIfNeeded,
    dispatch
  ),
  setToken: bindActionCreators(actions.setToken, dispatch),
  setAuth: bindActionCreators(actions.setAuth, dispatch),
  setSimpleRegs: bindActionCreators(actions.setSimpleRegs, dispatch),
  setUserProfile: bindActionCreators(actions.setUserProfile, dispatch),
  showLeftMenu: bindActionCreators(
    () => dispatch({ type: "SHOW_LEFT_MENU", show: true }),
    dispatch
  ),
  hideLeftMenu: bindActionCreators(
    () => dispatch({ type: "SHOW_LEFT_MENU", show: false }),
    dispatch
  ),
  dispatch,
});

AdminLayout = connect(mapStateToProps, mapDispatchToProps)(AdminLayout);

export default CSSModules(AdminLayout, styles);
