import React from 'react'
import { browserHistory } from 'react-router'
import cookie from 'react-cookie'
import CSSModules from 'react-css-modules'
import styles from './logoLink.css'
import { api, host, domen } from '../../config.js'
import classNames from 'classnames';

const isAlfa = domen.isAlfa;
let srcLogo = "/assets/img/antiage/logo.png";
let srcLogoMobile = "/assets/img/antiage/logo-w.png";

if (isAlfa) {
  srcLogo = "/assets/img/alfa/logo-energy.svg";
  srcLogoMobile = "/assets/img/alfa/logo-energy.svg";
}

const LogoLink = () => {
  return (<div className={styles.root}>
    {/*  <img className={styles.apple} src="/assets/img/antiage/apple.png" alt=""/>*/}
    <div className={styles.text}>
      {/*<div className={styles.text}>anti-age</div>*/}
      <img className={classNames(styles.uniproLogoMobile, {
        [styles.alfaLogo]: isAlfa
      })}
        src={srcLogoMobile} alt=""
        onClick={() => {
          cookie.remove('token', { path: '/' })
          cookie.remove('txId', { path: '/' })
          cookie.remove('role', { path: '/' })
          cookie.remove('program', { path: '/' })
          cookie.remove('packageType', { path: '/' })
          cookie.remove('promoName', { path: '/' })
          cookie.remove('share', { path: '/' })
          //cookie.remove('general', { path: '/' })
          cookie.remove('userProgram', { path: '/' })
          cookie.remove('tester', { path: '/' })
          cookie.remove('abtest', { path: '/' })
          browserHistory.push('/')
        }}
      />
      <img className={classNames(styles.uniproLogo, {
        [styles.alfaLogo]: isAlfa
      })}
        src={srcLogo} alt=""
        onClick={() => {
          cookie.remove('token', { path: '/' })
          cookie.remove('txId', { path: '/' })
          cookie.remove('role', { path: '/' })
          cookie.remove('program', { path: '/' })
          cookie.remove('packageType', { path: '/' })
          cookie.remove('promoName', { path: '/' })
          cookie.remove('share', { path: '/' })
          //cookie.remove('general', { path: '/' })
          cookie.remove('userProgram', { path: '/' })
          cookie.remove('tester', { path: '/' })
          cookie.remove('abtest', { path: '/' })
          browserHistory.push('/')
        }}
      />
    </div>
  </div>
  )
}
export default CSSModules(LogoLink, styles)
