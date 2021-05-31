import React, { Component } from "react";
import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import Social from "./Social";
import styles from "./mobileLeftMenu.css";
import MenuItem from "../todayTask/MenuItem";
import classNames from "classnames";
import { browserHistory } from "react-router";

import menu from "../todayTask/Menu";
class MobileLeftMenu extends Component {
  componentDidMount() {
    let { menuList, dispatch, userInfo } = this.props;
    const isAdmin = userInfo.data.role === 2;

    if (isAdmin && menuList != menu) {
      dispatch({ type: "SET_ADMIN_MENU_LIST", menu });
    }
  }

  render() {
    const {
      hideMenu,
      dayId,
      userInfo,
      isRegistered,
      isSimpleRegs,
      lang,
    } = this.props;

    let { menuList } = this.props;
    const { banners, isMlmEnabled, menuBadges } = userInfo.data;
    const isSalesReportEnabled = userInfo.data.role === 5 || userInfo.data.role === 2
    const isVsevidyasheeOko = userInfo.data.id === 5955;


    const error = {
      name: "Нашел ошибку?",
      active: false,
      link: "error-report",
      icon: "ico-warning",
    };
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
              {/*<img src="/assets/img/alfa/logo-energy-red33.svg" width="220px" className={styles.uniproLogo} alt=""/>*/}
              {/*<img className={styles.apple} src="/assets/img/antiage/apple.png" alt=""/>*/}
              {/*<div className={styles.logoWrap}>*/}
              {/*<div className={styles.aboveLogo}>anti-age</div>*/}
              {/*<img*/}
              {/*src={"/assets/img/antiage/logo.png"}*/}
              {/*className={classNames(styles.uniproLogo)}*/}
              {/**/}
              {/*alt=""*/}
              {/*/>*/}
              {/*</div>*/}
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
          {/*   <div className={styles.social}>
            <div className={styles.socialSignin}>
              <a className={styles.socialSigninItem} href="https://vk.com/todaymeru" target="blank">
                <svg className={styles.svgIconVk}>
                  <use xlinkHref="#vk"></use>
                </svg>
              </a>

              <a className={styles.socialSigninItem} href="https://www.instagram.com/todaymeru" target="blank">
                <svg className={styles.svgIconInsta}>
                  <use xlinkHref="#insta"></use>
                </svg>
              </a>

              <a className={styles.socialSigninItem} href="https://www.facebook.com/todaymeru" target="blank">
                <svg className={styles.svgIconFb}>
                  <use xlinkHref="#fb"></use>
                </svg>
              </a>

              <a className={styles.socialSigninItem} href="https://ok.ru/group/53371420672073" target="blank">
                <svg className={styles.svgIconOk}>
                  <use xlinkHref="#odnoklassniki"></use>
                </svg>
              </a>

              <a className={styles.socialSigninItem} href="https://www.youtube.com/channel/UC-mD0FrmH82u34-J5lFS-BA" target="blank">
                <svg className={styles.svgIconYoutube}>
                  <use xlinkHref="#youtube"></use>
                </svg>
              </a>
            </div>
          </div>*/}
          {/* <ul className="banner-ls banner-ls--menu-mob-left">
            <li className="banner-ls__item">
              <a href="#">
                <div className="banner-ls__img">
                  <img src="tmp/banner-2.png" alt="" />
                </div>
                <p className="banner-ls__desc">В твой выходной день только сегодня TezTour дарит -10% на тур</p>
              </a>
            </li>
            <li className="banner-ls__item">
              <a href="#">
                <div className="banner-ls__img">
                  <img src="tmp/banner-1.png" alt="" />
                </div>
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { menuList, lang } = state;
  return {
    menuList,
    lang,
  };
};

MobileLeftMenu = connect(mapStateToProps)(MobileLeftMenu);

export default CSSModules(MobileLeftMenu, styles);
