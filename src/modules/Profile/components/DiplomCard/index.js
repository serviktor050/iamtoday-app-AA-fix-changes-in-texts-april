import React from 'react';
import classNames from "classnames/bind";
import { connect } from 'react-redux';
import { dict } from "dict";

import styles from './styles.css';
import { pluralizeMonthes, monthes } from 'modules/utils';
 
const cx = classNames.bind(styles);

const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

const formatDate = (date, lang) => {
  const rawDate = new Date(Date.parse(date))
  const day = rawDate.getDate();
  const month = pluralizeMonthes(dict[lang][monthes[rawDate.getMonth()]]);
  const year = rawDate.getFullYear();

  return `${day} ${month} ${year} г.`
}

const fileFormat = (str) => {
  const format = str.split('.')
  return '.' + format[format.length - 1]
}

export const DiplomCard = connect(mapStateToProps, mapDispatchToProps)(({ diplom, lang, ...props }) => {
  const i18n = dict[lang];
  return (
    <div className={cx('diplomCard')}>
        <img src={diplom.thumbnail} alt='cover' className={cx('diplomCard__cover')} />
        <div className={cx('diplomCard__mainInfo')}>
          <div className={cx('diplomCard__textContainer')}>
            <div className={cx('diplomCard__header')}>
              <h2 className={cx('diplomCard__title')}>{diplom.name}</h2>
              <span className={cx('diplomCard__downloadContainer')}>
                <a href={diplom.link} target="_blank" className={cx('diplomCard__downloadBtn')}>{i18n['lecture.download']}</a>
                <span className={cx('diplomCard__downloadSubInfo')}>&nbsp;{fileFormat(diplom.filename)}</span>
              </span>
            </div>
            <p className={cx('diplomCard__description')}>{diplom.description}</p>
          </div>
          <p className={cx('diplomCard__date')}><span className={cx('diplomCard__datePrefix')}>{`${i18n['profile.diploms.date']}:`}</span>{` ${formatDate(diplom.date, lang)}`}</p>
        </div>
    </div>
  )
});
