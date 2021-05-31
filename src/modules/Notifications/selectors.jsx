import { createSelector } from 'reselect';
import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const isOpen = (state) => {
	return local(state).isOpen;
};
export const notifications = (state) => {
	return R.path(['notifications'], local(state));
};
export const unReadMessage = (state) => {
	return R.path(['unReadMessage'], local(state));
};
export const selectTodayTasks = (state) => R.path(['todayTasks'], local(state));

export const notify = createSelector(
	notifications,
	(notifications) => {
		let list = [];
		let unReadList = [];
		if(R.path(['data'], notifications)){
			unReadList = notifications.data.filter((item) => !item.isRead);
			list = notifications.data.filter((item) => item.isRead);
		}
		return {
			unReadList,
			list
		}
	}
)
