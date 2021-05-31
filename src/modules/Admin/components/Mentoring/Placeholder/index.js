import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';

import styles from './styles.css';
import { dict } from 'dict';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ lang: state.lang })

export const Placeholder = connect(mapStateToProps)( 
  function Placeholder({ lang }) {
    const i18n = dict[lang];
    return (
      <h3 className={cx('placeholder__title')}>
        {i18n['admin.mentoring.no-new-requests']}
      </h3>
    )
  }
)