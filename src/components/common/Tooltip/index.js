import React from 'react';
import classNames from 'classnames/bind';

import {UncontrolledTooltip} from 'reactstrap';

import styles from './styles.css';

const cx = classNames.bind(styles);

export function TooltipCustom({ text, ...props }) {
  return (
    <div className={cx('tooltip_custom')}>
      <span className={cx('toolip__icon')}>?</span>
      <div className={cx('tooltip__content')}>
        <p className={cx('tooltip__text')}>{text}</p>
      </div>
    </div>
  )
}
export const Tooltip = (props) => {
  const {classNameArrow, trigger, placement, target, children} = props;

  return (
    <UncontrolledTooltip
      popperClassName={cx('tooltip', 'bsTooltipAuto', classNameArrow || '')}
      innerClassName={cx('tooltipInner')}
      arrowClassName={cx('arrow')}
      trigger={trigger || 'click'}
      placement={placement || 'top'}
      target={target}
      autohide={trigger !== 'hover'}>
      {children}
    </UncontrolledTooltip>
  );
};
