import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import {Tooltip} from '../../../../../components/common/Tooltip';

import styles from './styles.css';

import {dict} from 'dict';

const cx = classNames.bind(styles);

const ConnectProfileContacts = (props) => {
  const {id, phone, email, lang} = props;

  const i18n = dict[lang];

  const onCopy = (evt) => {
    const copiedText = evt.target.value;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(copiedText);
    }
  };

  return (
    <div className={cx('profileContacts')}>
      <button className={cx('profileContacts__button')} id={`phone${id}`}>
        <svg>
          <use xlinkHref="#ico-phone" />
        </svg>
      </button>
      <Tooltip trigger="focus" target={`phone${id}`} placement="bottom">
        <div className={cx('profileContacts__tooltip')}>
          <a className={cx('profileContacts__phone')} href={`https://wa.me/${phone}`}>
            {phone}
            <svg>
              <use xlinkHref="#phone" />
            </svg>
          </a>
          <button className={cx('profileContacts__copyButton')}
            value={phone}
            onClick={onCopy}>{i18n['mlm.mlmStructure.copyButton']}</button>
        </div>
      </Tooltip>

      <button className={cx('profileContacts__button')} id={`email${id}`}>
        <svg>
          <use xlinkHref="#ico-email" />
        </svg>
      </button>
      <Tooltip trigger="focus" target={`email${id}`} placement="bottom">
        <div className={cx('profileContacts__tooltip')}>
          <a className={cx('profileContacts__email')} href={`mailto:${email}`}>{email}</a>
          <button className={cx('profileContacts__copyButton')}
            value={email}
            onClick={onCopy}>{i18n['mlm.mlmStructure.copyButton']}</button>
        </div>
      </Tooltip>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  };
};

export const ProfileContacts = connect(mapStateToProps)(ConnectProfileContacts);
