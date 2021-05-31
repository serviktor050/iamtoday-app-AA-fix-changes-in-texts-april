import PropTypes from 'prop-types';
import React, { Component } from "react";
import { connect } from "react-redux";
import MenuItem from "./MenuItem";
import CSSModules from "react-css-modules";
import styles from "./menu.css";
import { Link, browserHistory } from "react-router";
import cookie from "react-cookie";
import { fetchChatList } from "../../actions/chats";
import { api, domen } from "../../config.js";
import { TimeoutError } from "@aspnet/signalr";
import { bindActionCreators } from "redux";
import { BAGES, getBage } from 'utils/menuBages';
import classNames from "classnames";

export const menu = [
  {
    id: "profiles",
    name: "menu.profiles",
    active: true,
    link: "admin/profiles",
    icon: "ico-m-book",
    subItems: [
      {
        id: "profiles-new",
        name: "menu.newProfiles",
        active: true,
        link: "admin/profiles",
      },
      {
        id: "profiles-applied",
        name: "menu.appliedProfiles",
        active: true,
        link: "admin/profiles/applied",
      },
      {
        id: "profiles-declined",
        name: "menu.declinedProfiles",
        active: true,
        link: "admin/profiles/declined",
      },
      {
        id: "profiles-blocked",
        name: "menu.blockedProfiles",
        active: true,
        link: "admin/profiles/blocked",
      },
    ],
  },
  {
    id: "salesReport",
    name: "menu.salesReport",
    active: false,
    link: "admin/reports",
    icon: "ico-ratings",
  },
  {
    id: "salesPartners",
    name: "menu.salesPartners",
    active: false,
    link: "admin/partners",
    icon: "ico-chat",
  },
  {
    id: 'questions',
    name: "menu.questions",
    active: false,
    link: 'admin/questions',
    icon: 'ico-question',
  },
  {
    id: 'calendar',
    name: 'menu.calendar',
    active: false,
    link: 'calendar',
    icon: 'calendar',
  },
  {
    id: 'mentoring',
    name: 'menu.mentoring',
    active: false,
    link: 'admin/declinedRequests',
    icon: 'ico-spending',
    subItems: [
      {
        id: "mentor-declined",
        name: "menu.declinedRequests",
        active: true,
        link: "admin/declinedRequests",
        // icon: "ico-cross",
      },
      {
        id: "mentor-requests",
        name: "menu.mentorRequests",
        active: true,
        link: "admin/mentorRequests",
        // icon: "ico-m-tasks",
      },
      {
        id: "mentor-change",
        name: "menu.changeRequests",
        active: true,
        link: "admin/changeRequests",
        // icon: "ico-spending",
      },
    ]
  },
];
/**
 *  Компонент Menu.
 *  Используется для вывода меню
 *
 */
class Menu extends Component {
  /**
   * @memberof  Menu
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {array} propTypes.menuList Список разделов
   * @prop {number} propTypes.program Номер программы
   * @prop {string} propTypes.gender Пол
   * @prop {object} propTypes.sign Объект данных реги
   *
   * */

  static propTypes = {
    gender: PropTypes.string,
    program: PropTypes.number,
    sign: PropTypes.object.isRequired,
    menuList: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEnoughSpace: false,
    }

    this.menu = null;

    this.setMenuNode = (node) => {
      this.menu = node
    }
  }

  async componentDidMount() {
    const { fetchChatList } = this.props;

    await setTimeout(() => {}, 1000);
    let { menuList, dispatch, userInfo } = this.props;
    const isAdmin = userInfo.data.role === 2;
    const isPartner = userInfo.data.role === 5;

    if (isAdmin && menuList != menu) {
      dispatch({ type: "SET_ADMIN_MENU_LIST", menu });
    }
    fetchChatList();
    dispatch({ type: 'MENU_LOADED' });
  }

  componentDidUpdate(prevProps) {
    if (this.menu && !this.props.menuStatus.spaceLeft) {
      const { dispatch } = this.props;
      const spaceLeft = window.innerHeight - 78 - 20 - 25 - 10 - this.menu.clientHeight;
      dispatch({ type: 'SET_SPACE_LEFT', data: spaceLeft });
      return
    }
    if (prevProps.menuStatus.spaceLeft !== this.props.menuStatus.spaceLeft) {
      const { menuStatus: { spaceLeft }, dispatch } = this.props;
      const isEnoughSpace = spaceLeft - 50 > 0;
      dispatch({ type: 'IS_ENOUGH_SPACE', data: isEnoughSpace });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'MENU_UNLOADED' });
  }

  render() {
    let {
      gender,
      dayId,
      sign,
      program,
      prevSeasons,
      unReadMsgs,
      isRegistered,
      isSimpleRegs,
      userInfo,
      location,
      menuStatus : { isEnoughSpace },
      hideMenu,
      isMobile, 
      lang,
    } = this.props;

    let { menuList } = this.props;
    const { banners, menuBadges, isMlmEnabled } = userInfo.data;
    const isSalesReportEnabled = userInfo.data.role === 5 || userInfo.data.role === 2;
    const isVsevidyasheeOko = userInfo.data.id === 5955;
    const { host } = sign;
    const pr = program ? program : prevSeasons ? prevSeasons[0].id : 0;
    //const isAlfa = domen.isAlfa
    let imgs = ["extreme_suches11.png", "ya_heroi11.png", "mama_mozhet11.png"];
    if (pr % 4 === 1) {
      imgs = imgs.slice(0, 2);
    }
    if (true) {
      imgs = imgs.slice(1);
    }
    if (pr % 4 === 3) {
      imgs = imgs.slice(0, 1);
    }
    const error = {
      name: "menu.errors",
      active: false,
      link: "error-report",
      icon: "ico-warning",
    };
    if (host === "alfa") {
      menuList = menuList.filter((item) => {
        return item.link !== "seasons";
      });
    }

    const innerMenu = (
      <ul ref={!isMobile ? this.setMenuNode : null}  className="main-nav">
          {menuList
            .filter((item) => isMlmEnabled || item.id !== "mlm")
            .filter((item) => isMlmEnabled || item.id !== 'virtual-pharmacy')
            .filter((item) => isSalesReportEnabled || item.id !== 'salesReport')
            // .map((item) => item.subItems ? {...item, subItems: item.subItems.filter((subItem) => isVsevidyasheeOko || subItem.id !== 'mlm-shop')} : item)
            .map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  item={item}
                  unReadMsgs={item.link == "chats" ? unReadMsgs : menuBadges ? getBage({ name: item.link, BAGES, menuBadges }) : null}
                  dayId={dayId}
                  location={location}
                  lang={this.props.lang}
                  menuBadges={menuBadges}
                />
              );
            })}
          <li className="main-nav__item--line" />
          <MenuItem item={error} dayId={dayId} lang={this.props.lang} menuBadges={menuBadges} />
        </ul>
    )

    if (isMobile) {
      return (
        <div className={styles.menuMobLeft}>
        <div className={styles.menuMobLeftInner}>
          <div className={styles.menuMobLeftIcoClose} onClick={hideMenu}>
            <svg className={styles.svgIconClose}>
              <use xlinkHref="#ico-close"></use>
            </svg>
          </div>
          <div className={styles.menuMobLeftLogo}>
            <h1 className={styles.gridCellHeaderLogo}>
              <img
                className={styles.uniproLogo}
                src="/assets/img/antiage/logo.png"
                alt=""
              />
            </h1>
          </div>
          {userInfo &&
            userInfo.data.role === 4 &&
            isRegistered &&
            isSimpleRegs && (
              <button
                className={styles.btnAction}
                onClick={() => {
                  hideMenu();
                  browserHistory.push("/signup/params");
                }}
              >
                Принять участие
              </button>
            )}
          <ul
            className={classNames(styles.mainNav, {
              [styles.hidden]:
                userInfo && userInfo.data.role === 4 && isRegistered,
            })}
          >
            {menuList
              .filter((item) => isMlmEnabled || item.id !== "mlm")
              .filter((item) => isSalesReportEnabled || item.id !== 'salesReport')
              .map((item) => item.subItems ? {...item, subItems: item.subItems.filter((subItem) => isVsevidyasheeOko || subItem.id !== 'mlm-shop')} : item)
              .map((item, index) => {
                return (
                  <MenuItem
                    key={index}
                    item={item}
                    dayId={dayId}
                    onClick={hideMenu}
                    lang={lang}
                    menuBadges={menuBadges}
                  />
                );
              })}
            <li className="main-nav__item--line"></li>
            <MenuItem
              item={error}
              dayId={dayId}
              onClick={hideMenu}
              lang={lang}
            />
            <li className="main-nav__item--line"></li>
          </ul>
        </div>
      </div>
      )
    }

    return (
      <div className={styles.gridCellLayoutMenuNav23}>
        {innerMenu}

        {isEnoughSpace && <div id='calendar-notifications-portal'></div>}
        
        {banners && !!banners.length && banners.map((item) => {
          if (item.link) {
            return (
              <a
              className={styles.bannerLsLink}
              href={item.link}
              target="_blank"
              >
                <div className={styles.bannerLsItem}>
                  <img
                    role="presentation"
                    className={styles.seasonImage}
                    src={item.image}
                  />
                </div>
              </a>
            );
          } else {
            return (
              <div className={styles.bannerLs}>
                <div className={styles.bannerLsItem}>
                  <img
                    role="presentation"
                    className={styles.seasonImage}
                    src={item.image}
                  />
                </div>
              </div>
            );
          }
        })}


        {pr &&
        (cookie.load("userPaidState") == 0 ||
          cookie.load("userPaidState") == -1) ? (
          <ul className={styles.bannerLs}>
            <li className={styles.bannerLsItem}>
              <img
                role="presentation"
                className={styles.seasonImage}
                src={`/assets/img/png/${
                  imgs[Math.floor(Math.random() * imgs.length)]
                }`}
                onClick={() => {
                  browserHistory.push("/season");
                }}
              />
            </li>
          </ul>
        ) : null}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { menuList, sign, userInfo, lang, menuStatus } = state;
  return {
    userInfo,
    menuList,
    sign,
    lang,
    menuStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChatList: bindActionCreators(fetchChatList, dispatch),
    dispatch
  }
}

Menu = connect(mapStateToProps, mapDispatchToProps)(Menu);

export default CSSModules(Menu, styles);
