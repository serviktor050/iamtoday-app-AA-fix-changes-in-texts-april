import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Tooltip from '../../../../components/componentKit2/Tooltip'

import styles from './styles.css';

const cx = classNames.bind(styles);

class Strap extends Component {

	renderStrap = () => {
		const {strap} = this.props;
		return (
			<div className={cx('strap-block')}>
				<div
					key={strap.season}
					className={cx('strap')}
				>
					<svg className={cx('icon-strap')}>
						<use xlinkHref={`#strap-${parseInt(strap.iconMedal)}`}/>
					</svg>
				</div>
			</div>
		)
	}

	render(){
		const {strap} = this.props;
		return (
			<Tooltip
				position='center'
				targetTooltip={() => this.renderStrap()}
			>
				<div>
					<div className={cx('strapTitle')}>
						<div className={cx('rank')}>
							<svg width={'15px'} height={'15px'}>
								<use xlinkHref={`#medals-${parseInt(strap.icon)}`}/>
							</svg>
						</div>
						<div className={cx('rank')}>{strap.name}</div>
					</div>
					<div>
						<span className={cx('points-value')}>{strap.points}</span>
						<span>баллов</span>
					</div>
				</div>
			</Tooltip>
		)
	}
}

export default Strap;
