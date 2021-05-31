import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { dict } from 'dict';

import styles from './styles.css';
import { TooltipCustom } from 'components/common/Tooltip';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ lang: state.lang });
const mapDispatchToProps = dispatch => ({ dispatch })

export const CalendarTitle = connect(mapStateToProps, mapDispatchToProps)(({ title, todayTasks, toggleTaskWindow, lang, ...props }) => {
  const i18n = dict[lang];
  return (
    <div className={cx('title__container')}>
      <h1 className={cx('title')}>{title}</h1>
      <div className={cx('tooltip__container')}>
        {todayTasks ? <div className={cx('todayTasks')}>{todayTasks}</div> : <TooltipCustom text={i18n['calendar.tooltip']} />}
      </div>
      <button className={cx('btn', 'btn-createNewTask')} onClick={_ => toggleTaskWindow()}>{`${i18n['calendar.create-new-task']} +`}</button>
    </div>
  )
})
