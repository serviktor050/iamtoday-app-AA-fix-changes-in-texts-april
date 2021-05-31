import React from 'react'
import MenuButton from '../componentKit/MenuButton'
import cookie from 'react-cookie'
import { browserHistory } from 'react-router'

export default () => (
  <div className="user-reports-menu">
    <MenuButton link="/userReports/chats" icon="ico-m-tasks">Чаты</MenuButton>
    <MenuButton link="/userReports/photos" icon="ico-m-tasks">Фото до/после</MenuButton>
    <MenuButton link="/userReports/exams" icon="ico-m-tasks">Экзамены и зачёты</MenuButton>
    <MenuButton link="/userReports/pendingProfiles" icon="ico-m-tasks">Утверждение профилей</MenuButton>
    <MenuButton link="/userReports/pendingInsurance" icon="ico-m-tasks">Утверждение страховок</MenuButton>
    <MenuButton onClick={() => {
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
    }} icon="ico-m-faq">Выйти</MenuButton>
    {/* <Link
      className="user-reports-menu__item"
      to="/userReports/chats">Чаты</Link>
    <Link
      className="user-reports-menu__item"
      to="/userReports/photos">Фото до/после</Link>
    <Link
      className="user-reports-menu__item"
      to="/userReports/exams">Экзамены и зачёты</Link>
    <Link
      className="user-reports-menu__item"
      to="/userReports/pendingProfiles">Утверждение профилей</Link>
    <Link
      className="user-reports-menu__item"
      to="/userReports/pendingInsurance">Утверждение страховок</Link> */}
  </div>
)
