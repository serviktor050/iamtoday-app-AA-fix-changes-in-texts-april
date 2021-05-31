import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';
import * as R from 'ramda';

import styles from './styles.css';
import { SuggestContractorsList } from '../SuggestContractorsList';
import InputProfile from 'components/componentKit/InputProfile';
import { isAdmin, createUserName } from 'modules/utils';
import * as ducks from '../../../../../../ducks';
import * as selectors from '../../../../../../selectors';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ 
  lang: state.lang, 
  userInfo: state.userInfo, 
  suggestedUsers: selectors.selectSuggestedUsers(state),
  contractors: selectors.selectContractors(state), 
})
const mapDispatchToProps = dispatch => ({ dispatch })

export const SuggestionInput = connect(mapStateToProps, mapDispatchToProps)(
  function SuggestionInput({ 
    disableAddMoreAndSetHood, 
    contractorsInputState, 
    suggestedUsers, 
    contractors, 
    userInfo, 
    dispatch, 
    email, 
    lang, 
  }) {

    const i18n = dict[lang]
    const [ contractorsInput, setContractorsInput ] = contractorsInputState

    const contractorsList = R.path(['data'], suggestedUsers) || [];

    const addContractor = (contractor) => {
      dispatch(ducks.addToContractorsList([contractor]))
      if (!isAdmin(userInfo)) {
        const { firstName, lastName, middleName } = contractor;
        const userName = createUserName({ firstName, lastName, middleName })
        setContractorsInput(userName);
      }
      setContractorsInput('');
      dispatch(ducks.getUserSuggest({ "userFilterText": '' }))
    }

    function getEmails(str) {
      const emails = str.split(' ');
      if (emails.length <= 1) {
        return { validEmails: [], invalidEmails: [] }
      }
      let validEmails = [];
      let invalidEmails = [];
      emails.forEach(email => {
        if (validateEmail(email)) {
          validEmails.push({ email: email, id: email });
        } else {
          invalidEmails.push(email)
        }
      });
      return { validEmails, invalidEmails }
    }

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    const handleChange = (value) => {
      if (!isAdmin(userInfo) && contractors.length > 0) {
        dispatch(ducks.clearContractorsList());
        return
      }
      if (email) {
        const { validEmails, invalidEmails } = getEmails(value);
        if (validEmails.length > 0) {
          dispatch(ducks.addToContractorsList(validEmails))
          setContractorsInput(invalidEmails.join(' ').replace( /\s/g, ""));
          disableAddMoreAndSetHood();
          return
        }
      }
      setContractorsInput(value);
      dispatch(ducks.getUserSuggest({ "userFilterText": value }));
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
  }
)
