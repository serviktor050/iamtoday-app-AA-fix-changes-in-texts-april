import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';
import * as R from 'ramda';

import styles from './styles.css';
import { SuggestContractorsList } from '../ChooseRecipients/components/SuggestContractorsList';
import InputProfile from 'components/componentKit/InputProfile';
import { isAdmin, createUserName } from 'modules/utils';
import * as ducks from '../../../../ducks';
import * as selectors from '../../../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ 
  lang: state.lang, 
  userInfo: state.userInfo, 
  suggestedUsers: selectors.selectSuggestedUsers(state),
  contractors: selectors.selectContractors(state),
})
const mapDispatchToProps = dispatch => ({ dispatch })

export const GroupAndPersonal = connect(mapStateToProps, mapDispatchToProps)(
  ({ contractorsInputState, contractors, userInfo, suggestedUsers, lang, dispatch }) => {

  const i18n = dict[lang]
  const [ contractorsInput, setContractorsInput ] = contractorsInputState;

  const contractorsList = R.path(['data'], suggestedUsers) || [];

  const addContractor = (contractor) => {
    dispatch(ducks.addToContractorsList([contractor]))
    if (!isAdmin(userInfo)) {
      const { firstName, lastName, middleName } = contractor;
      const userName = createUserName({ firstName, lastName, middleName })
      setContractorsInput(userName);
    }
  }

  const handleChange = (value) => {
    if (!isAdmin(userInfo) && contractors.length > 0) {
      dispatch(ducks.clearContractorsList());
    }
    setContractorsInput(value);
    dispatch(ducks.getUserSuggest({ "userFilterText": value }))
  }

  return (
    <React.Fragment>
     <div className={cx('newTask__input_wrapper')}>
          <InputProfile  meta={{}} 
            val={contractorsInput}
            remote={true}
            cls={cx('newTask__contractor_input', 'newTask__input')}
            placeholder={i18n["calendar.new-task.contractor"]}
            input={{ name: "contractor", onChange: handleChange }}
          />
          <svg className={cx('newTask__contractor_icon')}>
            <use xlinkHref='#ico-search' />
          </svg>
          <SuggestContractorsList contractorsList={contractorsList} onClick={addContractor} /> 
        </div> 
    </React.Fragment>
  )
})
