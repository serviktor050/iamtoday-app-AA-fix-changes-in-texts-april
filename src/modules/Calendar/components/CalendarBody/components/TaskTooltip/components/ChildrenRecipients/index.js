import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { createUserName } from 'modules/utils';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ lang: state.lang });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const ChildrenRecipients = connect(mapStateToProps, mapDispatchToProps) (
  function ChildrenRecipients({ recipientInfos, lang }) {
    const i18n = dict[lang];

    if (recipientInfos.length === 1) {
      const user = recipientInfos[0];
      const { firstName, lastName, middleName } = user;
      return (
        <span className={cx('childrenRecipients__text')}>
          <span className={cx('childrenRecipients__fio')}>
            {createUserName({ firstName, lastName, middleName })}&nbsp;
          </span>
          {i18n['calendar.task.recipient.children']}
        </span>
      )
    }

    return (
      <span className={cx('childrenRecipients__text')}>
        <span className={cx('childrenRecipients__fio')}>
          {recipientInfos.map((recipient) => {
            const { firstName, lastName, middleName } = recipient;
            return (createUserName({ firstName, lastName, middleName }))
          }).join(', ')}
        </span>
        &nbsp;{i18n['calendar.task.recipient.children-many']}
      </span>
    )
  }
)