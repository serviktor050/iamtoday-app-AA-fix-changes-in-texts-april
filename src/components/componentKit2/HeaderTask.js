import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import styles from './headerTask.css'
import { domen } from '../../config.js'
import classNames from 'classnames';
import NewTimer from './newTimers'
import * as R from 'ramda';
import {Notifications} from 'modules/Notifications';
import {dict} from 'dict';
import {applyLeave} from "../../routes";

const isAlfa = domen.isAlfa

let srcLogo = "/assets/img/antiage/logo.png";
let srcLogoMobile = "/assets/img/antiage/logo.png";

class HeaderTask extends Component {

  constructor(props, context) {
    super(props, context);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount () {
    window.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleDocumentClick)
  }

  handleDocumentClick = (evt) => {
    const area = this.refs.right;

    if (area && !area.contains(evt.target)) {
      this.props.dispatch({ type: 'LITTLE_HEADER_MENU', isVisible: false });
    }
  }

  renderLogo(){
    let {program} = this.props;
    if(!program){
      return (
        <use xlinkHref="#ys-logo-web"></use>
      )
    }
    if(program % 4 === 1){
      return (
        <use xlinkHref="#ys-logo-web-hero"></use>
      )
    }
    if(program % 4 === 2){
      return (
        <use xlinkHref="#ys-logo-web-mama"></use>
      )
    }
    if(program % 4 === 3){
      return (
        <use xlinkHref="#ys-logo-web-extreme"></use>
      )
    }
    if(program % 4 === 0){
      return (
        <use xlinkHref="#ys-logo-web"></use>
      )
    }
  }

  onLogout(e) {
    const {dispatch, setAuth, setSimpleRegs, isSimpleRegs} = this.props;
    e.preventDefault();
    setAuth(false)
    if (isSimpleRegs) {
      setSimpleRegs(false)
    }
    applyLeave(dispatch)
  }

  render() {
    const { dispatch,
      fullName,
      isSimpleRegs,
      avatar,
      isVisible,
      showLeftMenu,
      userInfo,
      smm,
      sign,
      profileData,
      lang,
    } = this.props;




    const { isFirstEdit, gender, timers, points, role } = userInfo.data;
    const medalId = R.path(['pointAchievement', 'id'], points);

    const isAdmin = role === 2;
    const isUnipro = domen.isUnipro;
    let backgroundColor = styles.header;

    if(isUnipro){
      backgroundColor = styles.headerUnipro
    }

    if(isAlfa){
        backgroundColor = styles.headerAlfa
    }

    const menu =  <div className={styles.blockMenu}>
        <div
            ref="menu"
            className={styles.hProfile}
        >
					<Notifications  userInfo={userInfo}/>
            <div className={styles.rating}>
              <div className={styles.ratingContent}>
								<div className={styles.positions}>
									<div className={styles.positionsItem}>{R.path(['userRank', 'sport', 'points'], points)}</div>
								{/*	<div className={styles.separator}>/</div>*/}
								{/*	<div className={styles.positionsItem}>{R.path(['userRank', 'business', 'points'], points)}</div>*/}
								</div>
								<div className={styles.points}>{R.path(['userRank', 'common', 'points'], points)}</div>
              </div>
            </div>

					<div ref="right"  className={styles.right} onClick={() => dispatch({type: 'LITTLE_HEADER_MENU', isVisible: !isVisible})}>
						<div className={styles.profileInfo}>
							<div className={styles.hProfileName}>{fullName}</div>
							<div className={styles.status}>
								{medalId && <svg 	className={styles.flag} width={'15px'} height={'15px'}>
									<use xlinkHref={`#medals-${medalId}`}/>
								</svg>}
								<div className={styles.desc}>{R.path(['pointAchievement', 'name'], points)}</div>
							</div>

              {isVisible && <ul className={styles.dropdownProfile} >
                  {!isFirstEdit && !isSimpleRegs && <li className={styles.dropdownItem}>
                      <Link to="/profile">{dict[lang]['profile.title']}</Link>
                  </li>}

                  {!isFirstEdit && <li className={styles.dropdownSeparate}></li>}

                  <li className={styles.dropdownItem}>
                      <a href="#" onClick={e => this.onLogout(e)}>
                        {dict[lang]['logout']}
                      </a>
                  </li>
              </ul>}

						</div>

						<div className={styles.hProfileAvatar}>
								<img className={styles.hProfileAvatarImg}
										 src={avatar ? avatar : (gender === 'male' ? '/assets/img/png/boy.png' : '/assets/img/png/girl.png')}
										 alt=""/>
						</div>
					</div>
        </div>
    </div>

    return (
      <div className={backgroundColor}>
        <div className={styles.gridHeaderInner}>
           <div
            className={classNames(styles.gridCellHeaderBurger33, {
              [styles.opacity0]: !sign.isRegistered,

            })}
            onClick={showLeftMenu}
          >
            <span className={styles.headerIcoBurger}>
              <svg className={styles.svgIconBurger}>
                <use xlinkHref="#ico-burger" />
              </svg>
            </span>
          </div>
            <h1 className={styles.gridCellHeaderLogo33}>
              {/*<div className={styles.logo}>*/}
                {/*<div className={styles.logoWrap}>*/}
                  <img
                    src={srcLogo}
                    className={styles.uniproLogo}
                    onClick={() => {
                        if (profileData && profileData.isFirstEdit){
                          return;
                        }
                        browserHistory.push(isAdmin ? '/admin/profiles' : '/trainings')
                    }}
                    alt=""
                  />
                  <img
                    src={srcLogoMobile}
                    className={styles.uniproLogoMobile}
                    onClick={() => {
                      if (profileData && profileData.isFirstEdit){
                        return;
                      }
                      browserHistory.push(isAdmin ? '/admin/profiles' : '/trainings')
                    }}
                    alt=""
                  />
                {/*</div>*/}
              {/*</div>*/}
            </h1>

          {
            timers && timers[0] &&
            <NewTimer
              timers={timers}
              lang={lang}
              /* staticText={smm ? {} : {}}*/
            />
          }

         {/* timers && !!timers.length && timers[1]*/}
          <div className={styles.gridCellHeaderRightSide33}>
            <div className={styles.soc}>
              <div className={styles.socTitle}>{dict[lang]['soc']}</div>
              <div className={styles.socList}>
                <div className={styles.socItem}><a href="https://www.instagram.com/antiageexpert_ru/" target="_blank"><img src="/assets/img/in.png" alt=""/></a></div>
                <div className={styles.socItem}><a href="https://www.facebook.com/antiageexpert.ru/" target="_blank"><img src="/assets/img/fb.png" alt=""/></a></div>
              </div>
            </div>
            {/* { smm ? (sign.isRegistered && userInfo && userInfo.data && userInfo.data.points ? menu : null) : menu } */}
            {menu}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isVisible, userInfo, sign, recivedProfile, selectedProfile, lang } = state

  const {
    profileData,
  } = recivedProfile[selectedProfile] || {};

  return { isVisible, userInfo, sign, profileData, lang }
};

HeaderTask = connect(
  mapStateToProps
)(HeaderTask);

export default CSSModules(HeaderTask, styles)
