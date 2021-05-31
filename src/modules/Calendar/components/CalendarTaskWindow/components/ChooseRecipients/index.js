import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { isAdmin } from 'modules/utils';
import { GroupAndPersonal } from '../GroupAndPersonal';
import { RadioInput } from './components/RadioInput';
import { TYPE_ALL, TYPE_CHILDREN, TYPE_GROUP } from 'modules/Calendar/constants';
import * as ducks from 'modules/Calendar/ducks';
import * as selectors from 'modules/Calendar/selectors';
import { SuggestionInput } from './components/SuggestionInput';
import { ChildrenList } from './components/ChildrenList';

const cx  = classNames.bind(styles);

const mapStateToProps = state => ({ 
  lang: state.lang, 
  userInfo: state.userInfo, 
  recipientsType: selectors.selectRecipientsType(state),
  contractors: selectors.selectContractors(state),
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const ChooseRecipients = connect(mapStateToProps, mapDispatchToProps)(
  ({ taskInfo, contractors, contractorsInputState, recipientsType, userInfo, lang, dispatch }) => {

  const [ addMore, setAddMore ] = useState(false);
  const [ disableAddMore, setDisableAddMore ] = useState(false);
  const [ isEmailHood, setEmailsHood ] = useState(false);

  function disableAddMoreAndSetHood() {
    setDisableAddMore(true);
    setEmailsHood(true);
  }

  useEffect(() => {
    setAddMore(false)
  }, [contractors])

  useEffect(() => {
    dispatch(ducks.clearContractorsList());
    setDisableAddMore(false);
  }, [recipientsType])

  function handleRecipientsTypeChange (e) {
    dispatch(ducks.setRecipientsType(e.target.value))
  }

  const i18n = dict[lang];
  if (!isAdmin(userInfo)) {
    return <GroupAndPersonal 
              taskInfo={taskInfo} 
              contractorsInputState={contractorsInputState} />
  }

  const isTypeChildren = TYPE_CHILDREN === recipientsType;
  const isTypeGroup = TYPE_GROUP === recipientsType;
  return (
    <div className={cx('chooseRecipient')}>
      <p className={cx('chooseRecipient__title')}>{i18n['calendar.task.reciever.title']}</p>
      <RadioInput 
        value={TYPE_ALL} 
        name='recipientsType' 
        recipientsType={recipientsType}  
        onChange={handleRecipientsTypeChange} 
        label={i18n['calendar.task.reciever.all']} 
      />
      <RadioInput 
        value={TYPE_CHILDREN} 
        name='recipientsType' 
        recipientsType={recipientsType}  
        onChange={handleRecipientsTypeChange} 
        label={i18n['calendar.task.reciever.children']} 
      />
      {isTypeChildren && 
        <React.Fragment>
          <ChildrenList addMore={addMore} setAddMore={setAddMore} /> 
          {(!contractors.length || addMore) && 
            <SuggestionInput 
              contractorsInputState={contractorsInputState} 
          />}
        </React.Fragment>
      }
      <RadioInput 
        value={TYPE_GROUP} 
        name='recipientsType' 
        recipientsType={recipientsType}  
        onChange={handleRecipientsTypeChange} 
        label={i18n['calendar.task.reciever.group']} 
      />
      {isTypeGroup &&
        <React.Fragment>
          <ChildrenList 
            email={true} 
            addMore={addMore} 
            setAddMore={setAddMore} 
            isEmailHood={isEmailHood} 
            setEmailsHood={setEmailsHood} 
            disableAddMore={disableAddMore} 
          /> 
          {(!contractors.length || addMore) && 
            <SuggestionInput 
              email={true}  
              contractorsInputState={contractorsInputState} 
              disableAddMoreAndSetHood={disableAddMoreAndSetHood} 
            />}
      </React.Fragment>
      }
    </div>
  )
})
