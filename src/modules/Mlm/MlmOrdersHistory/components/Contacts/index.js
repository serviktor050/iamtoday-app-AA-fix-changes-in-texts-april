import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import {dict} from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);

const ConnectContacts = ({classNameContainer = '', managerData, lang}) => {
  const {firstName, middleName, lastName, phone, email} = managerData;

  const i18n = dict[lang];

  return (
    <div className={cx('contacts', classNameContainer)}>
      <div className={cx('contacts__manager')}>
        <p className={cx('contacts__title')}>{i18n['contacts.manager']}</p>
        <p className={cx('contacts__lastName')}>{lastName}</p>
        <p className={cx('contacts__firstName')}>{firstName} {middleName}</p>
        <div className={cx('contacts__telWrapper')}>
          <a className={cx('contacts__tel', 'contacts__tel--manager')} href={`tel:${phone}`}>{phone}</a>
          <a className={cx('contacts__wa')} href={`https://wa.me/${phone}`}>
            <svg>
              <use xlinkHref="#phone" />
            </svg>
          </a>
        </div>
        <a className={cx('contacts__email')} href={`mailto:${email}`}>{email}</a>
      </div>
      <div className={cx('contacts__logistics')}>
        <p className={cx('contacts__title')}>{i18n['contacts.logistics']}</p>
        <a className={cx('contacts__tel', 'contacts__tel--logistics')} href="tel:+79653785783">+7 (965) 378-57-83</a>
        <p className={cx('contacts__workingTime')}>{i18n['contacts.logistics.workingTime']}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  }
}

export const Contacts = connect(mapStateToProps)(ConnectContacts);
