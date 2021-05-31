import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';
import { createUserName } from 'modules/utils'

const cx = classNames.bind(styles);


export function SuggestContractorsList({ contractorsList, onClick }) {
  return (
    <ul className={cx('suggestContractorsList')}>
      {contractorsList.map(contractor => {
        const userName = createUserName({ firstName: contractor.firstName, lastName: contractor.lastName, middleName: contractor.middleName })
        return (
          <li key={contractor.id} className={cx('contractorCard')} onClick={_ => onClick(contractor)} >
            <img src={contractor.photo || '../../../../../../../assets/img/png/ava-big-main.png'} className={cx('contactor__photo')} alt="photo" />
            <div className={cx('contractor__mainInfo')}>
              <span className={cx("contractor__fio")}>{userName}</span>
              <br/>
              <span>{contractor.workPosition}</span>
            </div>
          </li>
        )
      })}    
    </ul>
  )
}
