import React, { Component } from 'react';
import classNames from "classnames/bind";
import { connect } from "react-redux";
import { dict } from 'dict';

import styles from "./styles.css";

const cx = classNames.bind(styles);

export const WO_ANSWERS = 'wo-answers';
export const W_ANSWERS = 'w-answers';
export const ALL_ANSWERS = 'all';

const tabs = [
	{
		label: 'admin.questions.tabs.wo-answers',
		value: WO_ANSWERS
	},
	{
		label: 'admin.questions.tabs.w-answers',
		value: W_ANSWERS
	},
	{
		label: 'admin.questions.tabs.all',
		value: ALL_ANSWERS
	},
]

class Tabs extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	toggleTabs = (e) => {this.props.getTab( e.target.value )}

	renderTab = (item) => {
		const i18n = dict[this.props.lang]
		const isCurrent = this.props.currentTab === item.value
		return (
			<div key={item.value} className={cx('tab')}>
				<label htmlFor={item.value} className={cx('tab__label', { 'tab__label-active': isCurrent })}>
					{i18n[item.label]}
				</label>
				<input 
					type='radio' 
					id={item.value} 
					value={item.value} 
					checked={isCurrent} 
					onChange={this.toggleTabs} 
					className={cx('tab__input')}
					disabled={this.props.disabled} 
				/>
			</div>
		)
	}
	
	render() {
		return (
			<form className={cx('tabs')}>
				{tabs.map(item => this.renderTab(item))}
			</form>
		)
	}
}

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })


export default connect(mapStateToProps, mapDispatchToProps)(Tabs)