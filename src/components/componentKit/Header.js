import React from 'react'
import { browserHistory } from 'react-router'
import cookie from 'react-cookie'
import CSSModules from 'react-css-modules'
import styles from './header.css'
import { api, host, domen } from '../../config.js'
import classNames from 'classnames';

const isAlfa = domen.isAlfa;

const Header = props => (
  <div className={classNames(styles.header, {
    [styles.alfa]: isAlfa
  })}>
    <div className={styles.gridHeaderInner}>
      {/*  {props.burger
        ? <div className="1/4--portable grid__cell header__burger">
            <span className={styles.headerIcoBurger}>
              <svg className={styles.svgIcoBurger}>
                <use xlinkHref="#ico-burger" />
              </svg>
            </span>
          </div>
        : null
      }*/}

      <h1 className="header__logo">
        Ясегодня
        <img className={styles.logo} src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
      </h1>
      {/* {(!window.mobilecheck() || !props.isProfile) &&
        <h1 className="2/4--portable 1/2-desk grid__cell header__logo">
          Ясегодня
          <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
        </h1>
      } */}

      {/* {window.mobilecheck() &&
        props.isReadyToTasks &&
          props.isProfile &&
            <div className={styles.textCenter}>
              <button className={styles.btnPrimary} style={{
                backgroundColor: '#1F447B',
                // margin: '7px 120px',
                width: '70px',
                height: '40px',
                fontSize: '9px',
                padding: '10px',
              }} onClick={e => {
                e.preventDefault()
                browserHistory.push('/task')
              }}>
                К заданиям
              </button>
            </div>
      } */}

      {props.alpha &&
        <div className="1/4--portable grid__cell header__right-side">
          <div className={styles.headerBanner}>
            <a href="#" className="header__banner-link">
              <img src="/tmp/banner-1.png" alt=""/>
            </a>
          </div>
        </div>
      }


        <div className={styles.btnGroup}>
          {props.isReadyToTasks &&
            props.isProfile && (
            <div className={styles.btnWrap}>
                <button className={styles.btnPrimary} style={{ backgroundColor: '#1F447B' }} onClick={e => {
                  e.preventDefault()
                  browserHistory.push('/task')
                }}>
                  К заданиям
                </button>
            </div>
            )
          }
          <div className={styles.btnWrap}>
            <button className={styles.btnAction} onClick={e => {
              e.preventDefault()
              cookie.remove('token', { path: '/' })
              cookie.remove('txId', { path: '/' })
              cookie.remove('role', { path: '/' })
              cookie.remove('program', { path: '/' })
              cookie.remove('packageType', { path: '/' })
              cookie.remove('promoName', { path: '/' })
              cookie.remove('share', { path: '/' })
              cookie.remove('general', { path: '/' })
              cookie.remove('userProgram', { path: '/' })
              cookie.remove('tester', { path: '/' })
              browserHistory.push('/')
            }}>
              Выйти
            </button>
          </div>
        </div>


    </div>
  </div>
)

export default CSSModules(Header, styles)
