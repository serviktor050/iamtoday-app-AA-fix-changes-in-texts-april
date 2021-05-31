import React from 'react'
import cookie from 'react-cookie'
import { browserHistory } from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './loadingView.css'
import BackgroundTester from '../componentKit2/BackgroundTester'
import { domen } from '../../config.js'
import classNames from 'classnames';

let src = "/assets/img/antiage/bg.jpg";
const isAlfa = domen.isAlfa
if(isAlfa){
    src = "/assets/img/alfa/alfa-energy.jpg";
}
const defaultBg = <img className={styles.alfaBg} src={src} alt=""/>

let srcLogo = "/assets/img/els/logo.svg";

if(isAlfa){
    srcLogo = "/assets/img/alfa/logo-energy.svg";
}
const LoadingView = ({title, logout, test, toSignup, taskBack}) => {
  const isUnipro = domen.isUnipro;
  const isTele2Lk = domen.isTele2;
  let bg = defaultBg;
  return(<div style={{height: '100%'}}>
    <div className={styles.layoutEntry}>
      <div className={styles.gridEntryHeader}>
        <div className={styles.gridCellTodaymeLogo}>
          <img className={styles.apple} src="/assets/img/antiage/logo-w.png" alt=""/>
          {/*<div className={styles.logoWrap}>*/}
            {/*<div className={styles.aboveLogo}>anti-age</div>*/}
            {/*<img*/}
              {/*src="/assets/img/antiage/apple.png"*/}
              {/*className={classNames(styles.uniproLogo)}*/}
              {/*onClick={() => {*/}
                {/*browserHistory.push('/trainings')*/}
              {/*}}*/}
              {/*alt=""*/}
            {/*/>*/}
          {/*</div>*/}

        </div>
      </div>
      <div className={styles.entryMin}>
        <div className={styles.entryInner}>

          <div className={styles.entryBox}>

            <div className={styles.entryHeader}>
              <h2 className={isAlfa ? styles.entryTitleCenterAlfa : styles.entryTitleCenter}>{title}</h2>
            </div>

            {title === 'Загружается...' &&
              <div className={styles.textCenter}>
                <div className={classNames(styles.loaderMain, {
                  [styles.alfa]: isAlfa
                })}></div>
              </div>
            }

            {(logout || title === 'Если вы видите это окно, значит возникла ошибка! Напишите нам на почту av@todayme.ru и опишите сложившуюся ситуацию.') &&

              <div>
                <br/>
                <div className={styles.buttonPrimaryWide} onClick={e => {
                  cookie.remove('token', { path: '/' })
                  cookie.remove('txId', { path: '/' })
                  cookie.remove('role', { path: '/' })
                  cookie.remove('program', { path: '/' })
                  cookie.remove('packageType', { path: '/' })
                  cookie.remove('promoName', { path: '/' })
                  cookie.remove('share', { path: '/' })
                  cookie.remove('general', { path: '/' })
                  cookie.remove('tester', { path: '/' })
                  if(test){
                  cookie.remove('currentSeason', { path: '/' })
                  cookie.save('currentSeason', 3, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                  }
                  if (toSignup) {
                    browserHistory.push('/signup')
                  } else {
                    browserHistory.push('/')
                  }
                }}>
                  Вернуться на главный сайт
                </div>
              </div>
            }
            {taskBack &&
              <div>
                <br/>
                <div className={styles.buttonActionWide} onClick={e => {
                  browserHistory.push('/trainings')
                }}>
                  К заданиям
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {cookie.load('tester')
        ? <BackgroundTester />
        : <div className={styles.entryBg}>
          {bg}
        </div>
      }
    </div>
  </div>)
}

export default CSSModules(LoadingView, styles)
