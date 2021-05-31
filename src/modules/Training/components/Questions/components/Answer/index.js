import React from 'react';
import classNames from 'classnames/bind';
import { connect } from "react-redux";
import { dict } from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);
const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = state => ({ lang: state.lang });

export const Answer = connect(mapStateToProps, mapDispatchToProps)(({ answer, isAdmin, change, ...props }) => {
  const i18n = dict[props.lang];
  return (
    <div className={cx('answer', { 'answer-user': !isAdmin })} key={answer.id}>
      <img src={answer.userInfo.photo} alt='avatar' className={cx('answer__avatar')} />
      <div className={cx('answer__main')}>
        <p className={cx('answer__title')}>
          <span className={cx('answer__userName')}>
            {`${answer.userInfo.firstName} ${answer.userInfo.lastName}`}
          </span>
          {isAdmin && <button onClick={_ => change(answer)} className={cx('answer__btn')}>
            <span className={cx('answer__btn-text')}>{i18n['admin.questions.edit']}</span>
          </button>}
        </p>
        <p className={cx('answer__text')}>{answer.text}</p>
      </div>
    </div>
  )
})