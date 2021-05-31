import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import {Tooltip} from '../../../../../../../components/common/Tooltip';
import {ModalOrderCancel} from '../../../ModalOrderCancel';
import {ProfileContacts} from '../../../ProfileContacts';

import {beautifyPrice, beautifyPriceInRub, formatDate, getFioInitials} from '../../../../utils';
import {dict} from 'dict';

import styles from './styles.css';

const cx = classNames.bind(styles);

// TODO Hidden cancel product (NO DELETE!)

const ConnectOrderTablePatient = ({orderData, isMobile, lang}) => {
  const [isVisible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const {id, createTs, paidTs, patientFio, patientPhone, patientEmail, currency, sum, extraPrice, status, orderItems} = orderData;

  const i18n = dict[lang];

  const visibleProductsInfo = () => setVisible(() => !isVisible);
  const hideProductsInfo = () => setVisible(false);

  const onShowModal = () => setModalVisible(true);
  const onHideModal = () => setModalVisible(false);

  const isSuccessStatus = status.toLowerCase() === 'оплачен';

  return (
    <Fragment>
      <table className={cx('orderTablePatient', isVisible && 'orderTablePatient--productsVisible')}>
        <thead className={cx('orderTablePatient__head', !isVisible && 'orderTablePatient__head')}>
          {isMobile ? (<Fragment>
            <tr onClick={visibleProductsInfo}>
              <th colSpan={isVisible ? '2' : ''} className={cx('orderTablePatient__th', 'orderTablePatient__th--100')}>
                <div className={cx('orderTablePatient__cellData')}>
                  <p className={cx('orderTablePatient__date')}>
                    {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.date']} {formatDate(createTs)}
                  </p>
                  <div className={cx('orderTablePatient__wrapper')}>
                    <p className={cx('orderTablePatient__id')}>#{id}</p>
                    {isSuccessStatus && <p className={cx('orderTablePatient__endDate')}>
                      {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.payment']} {formatDate(paidTs)}</p>}
                  </div>
                </div>
              </th>

              <th colSpan="2" className={cx('orderTablePatient__th')}>
                <div className={cx('orderTablePatient__status', `orderTablePatient__status--${isSuccessStatus ? 'success' : 'fail'}`)}>
                  {i18n[`mlm.mlmOrdersHistory.ordersHistoryTable.payment.${isSuccessStatus ? 'success' : 'fail'}`]}
                </div>
              </th>

              <th className={cx('orderTablePatient__th')}>
                <button onClick={visibleProductsInfo}
                  className={cx('orderTablePatient__button', isVisible && 'orderTablePatient__button--productsVisible')}>
                  <svg>
                    <use xlinkHref="#ico-sharpened-dynamic-arrow" />
                  </svg>
                </button>
              </th>
            </tr>
            <tr>
              <th colSpan={isVisible ? '2' : ''} className={cx('orderTablePatient__th', 'orderTablePatient__th--white')}>
                <p className={cx('orderTablePatient__patientFio')}>{getFioInitials(patientFio)}</p>
              </th>

              <th className={cx('orderTablePatient__th', 'orderTablePatient__th--white')}>
                <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                  <p className={cx('orderTablePatient__totalPrice', 'orderTablePatient__totalPrice--income')}>
                    {beautifyPrice(extraPrice, currency)} б
                  </p>
                  <p className={cx('orderTablePatient__totalPriceRub', 'orderTablePatient__totalPriceRub--income')}>
                    {beautifyPriceInRub(extraPrice, currency)} Р
                  </p>
                </div>
              </th>

              <th className={cx('orderTablePatient__th', 'orderTablePatient__th--white')}>
                <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                  <p className={cx('orderTablePatient__totalPrice', 'orderTablePatient__totalPrice--patient')}>
                    {beautifyPrice(sum, currency)} б
                  </p>
                  <p className={cx('orderTablePatient__totalPriceRub', 'orderTablePatient__totalPriceRub--patient')}>
                    {beautifyPriceInRub(sum, currency)} Р
                  </p>
                </div>
              </th>

              <th className={cx('orderTablePatient__th', 'orderTablePatient__th--white')}>
                <button className={cx('orderTablePatient__button', 'orderTablePatient__button--circle')} id={`tooltip${id}`} />
                <Tooltip trigger="focus" placement="left-start" target={`tooltip${id}`}>
                  <div className={cx('orderTablePatient__contextMenu')}>
                    <a className={cx('orderTablePatient__contactInfo')} href={`tel:${patientPhone}`}>
                      <svg>
                        <use xlinkHref="#ico-phone" />
                      </svg>
                      {patientPhone}
                    </a>
                    <a className={cx('orderTablePatient__contactInfo')} href={`mailto:${patientEmail}`}>
                      <svg>
                        <use xlinkHref="#ico-email" />
                      </svg>
                      {patientEmail}
                    </a>
                    {/*<button onClick={onShowModal}
                      className={cx('orderTablePatient__tooltipButton', 'orderTablePatient__tooltipButton--cancel')}
                      type="button">
                      {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.productCancel']}
                    </button>*/}
                  </div>
                </Tooltip>
              </th>
            </tr>
          </Fragment>) : (<Fragment>
            <tr>
              <th onClick={visibleProductsInfo} className={cx('orderTablePatient__th', 'orderTablePatient__th--date')}>
                <div className={cx('orderTablePatient__cellData')}>
                  <p className={cx('orderTablePatient__date')}>
                    {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.date']} {formatDate(createTs)}
                  </p>
                  <p className={cx('orderTablePatient__id')}>#{id}</p>
                </div>
              </th>

              <th className={cx('orderTablePatient__th', 'orderTablePatient__th--patient')}>
                <div className={cx('orderTablePatient__cellData')}>
                  <p className={cx('orderTablePatient__fio')}>{getFioInitials(patientFio)}</p>
                  <ProfileContacts id={id} phone={patientPhone} email={patientEmail} />
                </div>
              </th>

              <th onClick={visibleProductsInfo} className={cx('orderTablePatient__th', 'orderTablePatient__th--quantity')} />

              <th onClick={visibleProductsInfo} className={cx('orderTablePatient__th')}>
                <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                  <p className={cx('orderTablePatient__totalPrice', 'orderTablePatient__totalPrice--income')}>
                    {beautifyPrice(extraPrice, currency)} б
                  </p>
                  <p className={cx('orderTablePatient__totalPriceRub', 'orderTablePatient__totalPriceRub--income')}>
                    {beautifyPriceInRub(extraPrice, currency)} Р
                  </p>
                </div>
              </th>

              <th onClick={visibleProductsInfo} className={cx('orderTablePatient__th')}>
                <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                  <p className={cx('orderTablePatient__totalPrice', 'orderTablePatient__totalPrice--patient')}>
                    {beautifyPrice(sum, currency)} б
                  </p>
                  <p className={cx('orderTablePatient__totalPriceRub', 'orderTablePatient__totalPriceRub--patient')}>
                    {beautifyPriceInRub(sum, currency)} Р
                  </p>
                </div>
              </th>

              <th className={cx('orderTablePatient__th', 'orderTablePatient__th--status')}>
                <div className={cx('orderTablePatient__wrapper', 'orderTablePatient__wrapper--status')}>
                  <div className={cx('orderTablePatient__status', `orderTablePatient__status--${isSuccessStatus ? 'success' : 'fail'}`)}>
                    {i18n[`mlm.mlmOrdersHistory.ordersHistoryTable.payment.${isSuccessStatus ? 'success' : 'fail'}`]}
                  </div>
                  {isSuccessStatus ? (<p className={cx('orderTablePatient__endDate')}>{formatDate(paidTs)}</p>) : (
                    <Fragment>
                      {/*<button onClick={onShowModal} className={cx('orderTablePatient__cancelButton', 'cancelButton--js')} id={`cross${id}`}>
                        <svg>
                          <use xlinkHref="#ico-sharpened-dynamic-cross" />
                        </svg>
                      </button>
                      <Tooltip trigger="hover" placement="bottom" target={`cross${id}`}>
                        <p className={cx('orderTablePatient__tooltip', 'orderTablePatient__tooltip--cancel')}>
                          {i18n['admin.questions.cancel']}
                        </p>
                      </Tooltip>*/}
                    </Fragment>
                  )}
                </div>
              </th>

              <th className={cx('orderTablePatient__th')}>
                <button onClick={visibleProductsInfo} className={cx('orderTablePatient__button')}>
                  {!isMobile && i18n[`admin.mentoring.${isVisible ? 'collapse' : 'expand'}`]}
                </button>
              </th>
            </tr>
          </Fragment>)}
        </thead>

        {isVisible && <tbody className={cx('orderTablePatient__body')}>
          <tr className={cx('orderTablePatient__title')}>
            <td colSpan={isMobile ? '' : '2'} className={cx('orderTablePatient__th', 'orderTablePatient__th--td')}>
              {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.product']}
            </td>
            <td className={cx('orderTablePatient__th', 'orderTablePatient__th--td', 'orderTablePatient__td--quantity')}>
              {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.quantity']}
            </td>
            <td className={cx('orderTablePatient__th', 'orderTablePatient__th--td')}>
              <p className={cx('orderTablePatient__difference')}>
                {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.difference']}
                {!isMobile && <Fragment>
                  <svg id={`difference${id}`}>
                    <use xlinkHref="#ico-dynamic-question" />
                  </svg>
                  <Tooltip trigger="hover" placement="bottom" target={`difference${id}`}>
                    <p className={cx('orderTablePatient__tooltip', 'orderTablePatient__tooltip--difference')}>
                      {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.differenceExplanation']}
                    </p>
                  </Tooltip>
                </Fragment>}
              </p>
            </td>
            <td className={cx('orderTablePatient__th', 'orderTablePatient__th--td')}>
              {i18n['mlm.mlmOrdersHistory.ordersHistoryTable.patientPrice']}
            </td>
            <td className={cx('orderTablePatient__th', 'orderTablePatient__th--td')} />
            {!isMobile && <td className={cx('orderTablePatient__th', 'orderTablePatient__th--td')} />}
          </tr>

          {orderItems.map(({id, name, quantity, currency, price, priceShop}) => {
            const productsIncome = (price - priceShop) * quantity;
            const productsPrice = price * quantity;

            return (
              <tr key={id} className={cx('orderTablePatient__tr')}>
                <td colSpan={isMobile ? '' : '2'} className={cx('orderTablePatient__td')}>{name}</td>
                <td className={cx('orderTablePatient__td', 'orderTablePatient__td--quantity')}>
                  <div className={cx('orderTablePatient__cellData--quantity')}>{quantity}</div>
                </td>

                <td className={cx('orderTablePatient__td')}>
                  <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                    <p className={cx('orderTablePatient__productPrice', 'orderTablePatient__productPrice--income')}>
                      {beautifyPrice(price === priceShop ? 0 : productsIncome, currency)} б
                    </p>
                    <p className={cx('orderTablePatient__productPriceRub', 'orderTablePatient__productPriceRub--income')}>
                      {beautifyPriceInRub(price === priceShop ? 0 : productsIncome, currency)} Р
                    </p>
                  </div>
                </td>

                <td className={cx('orderTablePatient__td')}>
                  <div className={cx('orderTablePatient__cellData', 'orderTablePatient__cellData--price')}>
                    <p className={cx('orderTablePatient__productPrice', 'orderTablePatient__productPrice--patient')}>
                      {beautifyPrice(productsPrice, currency)} б
                    </p>
                    <p className={cx('orderTablePatient__productPriceRub', 'orderTablePatient__productPriceRub--patient')}>
                      {beautifyPriceInRub(productsPrice, currency)} Р
                    </p>
                  </div>
                </td>
              </tr>
            )
          })}

          {isMobile && <tr>
            <td colSpan="5" className={cx('orderTablePatient__td', 'orderTablePatient__td--hider')}>
              <button onClick={hideProductsInfo} className={cx('orderTablePatient__hideButton')} type="button">
                {i18n['admin.mentoring.collapse']}
              </button>
            </td>
          </tr>}
        </tbody>}
      </table>

      {isModalVisible && <ModalOrderCancel onHide={onHideModal} />}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  };
};

export const OrderTablePatient = connect(mapStateToProps)(ConnectOrderTablePatient);
