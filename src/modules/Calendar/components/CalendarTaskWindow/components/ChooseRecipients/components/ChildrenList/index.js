import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { dict } from 'dict';

import styles from './styles.css';
import { createUserName } from 'modules/utils';
import * as selectors from '../../../../../../selectors';
import * as ducks from '../../../../../../ducks';

const cx = classNames.bind(styles);

const mapStateToProps = state => ({ 
  lang: state.lang,
  contractors: selectors.selectContractors(state),
});
const mapDispatchToProps = dispatch => ({ dispatch });

export const ChildrenList = connect(mapStateToProps, mapDispatchToProps)(
  function ChildrenList({ 
    lang, 
    email, 
    addMore, 
    dispatch, 
    setAddMore, 
    isEmailHood, 
    contractors, 
    setEmailsHood, 
    disableAddMore, 
  }) {
    const i18n = dict[lang];
    
    
    function removeContractor(id, e) {
      e.preventDefault();
      const contractor = contractors.find(contractor => contractor.id === id);
      dispatch(ducks.deleteFromContractorsList(contractor))
    }

    if (!contractors.length) {
      return null
    }

    return (
      <div className={cx('childrenList')}>
        <div className={cx('childrenList__contractors_wrapper')} style={isEmailHood ? { maxHeight: 90, overflow: 'hidden' } : {}} >
          {contractors.map(contractor => <div className={cx('childrenList__contractor')}>
            <span className={cx('childrenList__contractor_name')}>
              {email ? contractor.email
              : createUserName({ firstName: contractor.firstName, lastName: contractor.lastName, middleName: contractor.middleName })}
            </span>
            <button className={cx('childrenList__contractor_removeButton')} onClick={(e) => removeContractor(contractor.id, e)} ></button>
          </div>)}
          {isEmailHood && <div className={cx('childrenList__contractors_hood')}>
            <button onClick={(e) => { e.preventDefault(); setEmailsHood(false) }} className={cx('childrenList__contractors_expand')}>{i18n['calendar.contractors.expand-all']}</button>
          </div>}
        </div>
        {!addMore && !disableAddMore &&
        <button className={cx('childrenList__addMore')} onClick={() => setAddMore(true)}>
          {`+ ${i18n['calendar.contractors.add-more']}`}
        </button>}
      </div>
    )
  }
)
