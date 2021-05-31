import { createSelector } from 'reselect';
import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const selectCalendarData = state => R.path(['tasks'], local(state));
export const selectTodayTasks = state => R.path(['todayTasks'], local(state));
export const selectCurrentPeriod = state => R.path(['currentPeriod'], local(state));
export const selectSuggestedUsers = state => R.path(['suggestedUsers'], local(state));
export const selectRecipientsType = state => R.path(['recipientsType'], local(state));
export const selectTaskDescription = state => R.path(['taskDescription'], local(state));
export const selectOutsideClickRefs = state => R.path(['outsideClickRefs'], local(state));
export const selectContractors = (state) => R.path(['contractors'], local(state));
export const selectTooltipStatus = (state) => R.path(['isTooltipVisible'], local(state));
export const userInfo = (state) =>  R.path(['userInfo'], state);
export const lang = (state) => state.lang;