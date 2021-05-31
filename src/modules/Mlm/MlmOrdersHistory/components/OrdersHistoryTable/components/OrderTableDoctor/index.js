import React, {useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import {beautifyPrice, beautifyPriceInRub, formatDate} from '../../../../utils';
import {dict} from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);

const ConnectOrderTableDoctor = ({orderData, isMobile, lang}) => {
  const [isVisible, setVisible] = useState(false);
  const {id, createTs, sum, currency, orderItems} = orderData;

  const i18n = dict[lang];

  const visibleProductsInfo = () => setVisible(() => !isVisible);
  const hideProductsInfo = () => setVisible(false);

  return (
    <table className={cx('orderTableDoctor', isVisible && 'orderTableDoctor--productsVisible')}>
      <thead className={cx('orderTableDoctor__head')}>
        <tr onClick={visibleProductsInfo}>
          <th colSpan={isVisible ? '2' : ''} className={cx('orderTableDoctor__th', 'orderTableDoctor__th--100')}>
            <div className={cx('orderTableDoctor__cellData')}>
              <p className={cx('orderTableDoctor__date')}>{i18n['mlm.mlmOrdersHistory.ordersHistoryTable.date']} {formatDate(createTs)}</p>
              <p className={cx('orderTableDoctor__id')}>#{id}</p>
            </div>
          </th>
          <th className={cx('orderTableDoctor__th')}>
            <div className={cx('orderTableDoctor__cellData', 'orderTableDoctor__cellData--price')}>
              <p className={cx('orderTableDoctor__totalPrice')}>{beautifyPrice(sum, currency)} б</p>
              <p className={cx('orderTableDoctor__totalPriceRub')}>{beautifyPriceInRub(sum, currency)} Р</p>
            </div>
          </th>
          <th className={cx('orderTableDoctor__th')}>
            <button onClick={visibleProductsInfo}
              className={cx('orderTableDoctor__button', isVisible && 'orderTableDoctor__button--productsVisible')}>
              {isMobile ?
                <svg>
                  <use xlinkHref="#ico-sharpened-dynamic-arrow" />
                </svg>
                : i18n[`admin.mentoring.${isVisible ? 'collapse' : 'expand'}`]}
            </button>
          </th>
        </tr>
      </thead>

      {isVisible && <tbody className={cx('orderTableDoctor__body')}>
        <tr className={cx('orderTableDoctor__title')}>
          <td className={cx('orderTableDoctor__th', 'orderTableDoctor__th--td', 'orderTableDoctor__th--100')}>
            {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.product']}
          </td>
          <td className={cx('orderTableDoctor__th', 'orderTableDoctor__th--td')}>
            {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.quantity']}
          </td>
          <td className={cx('orderTableDoctor__th', 'orderTableDoctor__th--td')}>
            {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.price']}
          </td>
          <td className={cx('orderTableDoctor__th', 'orderTableDoctor__th--td')} />
        </tr>
        {orderItems.map(({id, name, quantity, price, currency}) => {
          const productsPrice = price * quantity;

          return (
            <tr key={id} className={cx('orderTableDoctor__tr')}>
              <td className={cx('orderTableDoctor__td')}>{name}</td>
              <td className={cx('orderTableDoctor__td', 'orderTableDoctor__td--quantity')}>
                <div className={cx('orderTableDoctor__cellData--quantity')}>{quantity}</div>
              </td>
              <td className={cx('orderTableDoctor__td')}>
                <div className={cx('orderTableDoctor__cellData', 'orderTableDoctor__cellData--price')}>
                  <p className={cx('orderTableDoctor__productPrice')}>{beautifyPrice(productsPrice, currency)} б</p>
                  <p className={cx('orderTableDoctor__productPriceRub')}>{beautifyPriceInRub(productsPrice, currency)} Р</p>
                </div>
              </td>
            </tr>
          )
        })}
        {isMobile && <tr>
          <td colSpan="4" className={cx('orderTableDoctor__td', 'orderTableDoctor__td--hider')}>
            <button onClick={hideProductsInfo} className={cx('orderTableDoctor__hideButton')} type="button">
              {i18n['admin.mentoring.collapse']}
            </button>
          </td>
        </tr>}
      </tbody>}
    </table>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  };
};

export const OrderTableDoctor = connect(mapStateToProps)(ConnectOrderTableDoctor);
