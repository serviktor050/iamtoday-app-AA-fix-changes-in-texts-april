import React from 'react'
import MenuButton from '../componentKit/MenuButton'
import { browserHistory } from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './menu.css'

const Menu = () => (
  <div className="2/3 grid__cell">
    <ul className={styles.mainNav}>
      <li className={styles.mainNavItem}>
        <MenuButton onClick={() => {
          browserHistory.push('/superadmin/day/1')
        }} icon="ico-m-book">Создать для программ</MenuButton>
      </li>
      <li className={styles.mainNavItem}>
        <MenuButton onClick={() => {
          browserHistory.push('/superadmin/day/2')
        }} icon="ico-m-book">Создать бонусный день</MenuButton>
      </li>
      <li className={styles.mainNavItem}>
        <MenuButton onClick={() => {
          browserHistory.push('/userReports/pendingProfiles')
        }} icon="ico-m-tasks">Отчеты</MenuButton>
      </li>
    </ul>
    {/* <hr/>
    <div className={styles.profile}>
      <Link to="/profile/create">
        <p className={styles.profileName}>Анна Иванова</p>
        <p className={styles.profileSubText}>Профиль</p>
      </Link>
    </div>
    <hr/> */}
  </div>
)

export default CSSModules(Menu, styles)
