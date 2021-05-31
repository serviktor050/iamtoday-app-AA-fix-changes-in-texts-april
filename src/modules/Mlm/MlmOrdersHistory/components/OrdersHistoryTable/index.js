import React from 'react';
import classNames from 'classnames/bind';

import {OrderTableDoctor} from './components/OrderTableDoctor';
import {OrderTablePatient} from './components/OrderTablePatient';

import styles from './styles.css';

const cx = classNames.bind(styles);

export const OrdersHistoryTable = ({ordersData, isPatientTable}) => {
  const isMobileTable = document.documentElement.clientWidth < '768';

  return (
    <div className={cx('mlmOrdersHistory__ordersHistoryTable',
      `mlmOrdersHistory__ordersHistoryTable--${!isPatientTable ? 'doctor' : 'patient'}`)}>
      {
        ordersData.map((order) => !isPatientTable
          ? <OrderTableDoctor key={order.id} isMobile={isMobileTable} orderData={order} />
          : <OrderTablePatient key={order.id} isMobile={isMobileTable} orderData={order} />)
      }
    </div>
  );
};
