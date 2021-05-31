import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { pluralize } from 'utils/helpers';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ lang: state.lang });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const GroupRecipients = connect(mapStateToProps, mapDispatchToProps) (
  function ({ recipientInfos, lang, innerRef }) {
    const i18n = dict[lang];

    const [ isAllRecipientsVisible, setAllRecipientsVisibility ] = useState(false);
    const toggleVisibility = function () {
      setAllRecipientsVisibility(!isAllRecipientsVisible)
    }

    if (recipientInfos.length > 2) {
      const emails = pluralize(recipientInfos.length - 2, [
        i18n['calendar.task.recipient.emails-1'], 
        i18n['calendar.task.recipient.emails-2'], 
        i18n['calendar.task.recipient.emails-3']
      ])
      return (
        <div ref={innerRef}>
          {recipientInfos.slice(0, 2).map((recipient) => 
            (<span className={cx('groupRecipients__email')}>{recipient.email}</span>)
          )}
          <span onClick={toggleVisibility} className={cx('listOfRecipients__showAll', { 'hidden': isAllRecipientsVisible })}>
            {`+ ${i18n['calendar.task.recipient.more']} ${recipientInfos.length - 2} ${emails}`}
          </span>
          {isAllRecipientsVisible && recipientInfos.slice(2).map((recipient) => 
            (<span className={cx('groupRecipients__email')}>{recipient.email}</span>)
          )}
        </div>
      )
    }
    return (
      <React.Fragment>
        {recipientInfos.map((recipient) => <span className={cx('groupRecipients__email')}>{recipient.email}</span>)}
      </React.Fragment>
    )
  }
)

