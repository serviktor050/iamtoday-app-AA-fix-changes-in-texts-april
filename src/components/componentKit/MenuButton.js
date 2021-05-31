import PropTypes from 'prop-types';
import React from 'react'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './menuButton.css'
import classNames from 'classnames';

const MenuButton = ({ children, onClick, icon, link, unReadMsgs, disabled }) => (
  <Link
    to={link}
    onClick={onClick}
    className={classNames(styles.mainNavItemInner, {
      [styles.disabled]: disabled,
    })}
  >
    <div className={styles.iconWrap}>
      <svg className={classNames(styles.svgIcon, {
        [styles.error]: icon === 'ico-warning'
      })}>
        <use xlinkHref={'#' + icon }/>
      </svg>
    </div>

    <span className="main-nav__title">{children}</span>
    {unReadMsgs ? <span className={styles.unReadMsgs}>{unReadMsgs}</span> : null}
  </Link>
)

MenuButton.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default MenuButton
