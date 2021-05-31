import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { TYPE_ALL, TYPE_CHILDREN, TYPE_GROUP } from '../../../../../../constants';
import { GroupRecipients } from '../GroupRecipients';
import { useSubscribeRedux } from 'modules/utils';
import * as ducks from 'modules/Calendar/ducks';
import { ChildrenRecipients } from '../ChildrenRecipients';

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({ lang: state.lang });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const ListOfRecipients = connect(mapStateToProps, mapDispatchToProps)(
  function ListOfRecipients({ taskInfo, lang, dispatch }) {

    const ref = useRef();
    useSubscribeRedux(
      ref,
      () => dispatch(ducks.addRefToOutSideClick(ref)),
      () => dispatch(ducks.deleteRefFromOutsideClick(ref)),
    )

    const { recipientInfos, groupType } = taskInfo;
    const i18n = dict[lang];
    
    if (groupType === TYPE_ALL) {
      return (
        <span className={cx('listOfRecipients__title')}>{i18n['calendar.task.reciever.all']}</span>
      )
    }
    if (groupType === TYPE_GROUP) {
      return <GroupRecipients innerRef={ref} recipientInfos={recipientInfos} />
    }

    if (groupType === TYPE_CHILDREN) {
      return <ChildrenRecipients innerRef={ref} recipientInfos={recipientInfos} /> 
    }
    
    return (
      <React.Fragment>
        
      </React.Fragment>
    )
  }
)
