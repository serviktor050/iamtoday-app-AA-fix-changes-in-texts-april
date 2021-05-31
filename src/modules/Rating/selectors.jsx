import { createSelector } from 'reselect';
import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const userRankList = (state) => {
  return R.path(['userRankList'], local(state));
};
export const workTeamRankList = (state) => {
	return R.path(['workTeamRankList'], local(state));
};
export const teamAdminRankList = (state) => {
	return R.path(['teamAdminRankList'], local(state));
};
export const orderByDirection = (state) => {
	return R.path(['orderByDirection'], local(state));
};
export const selectRating = (state) => {
	return local(state).selectRating;
};
export const storage = (state) => {
	return local(state).storage;
};
export const search = (state) => {
	return local(state).search;
};
export const count = (state) => {
	return local(state).count;
};
export const skip = (state) => {
	const rating = local(state).selectRating;
	return local(state).skip[rating] || 0;
};
export const skipToSelf = (state) => {
	return local(state).skipToSelf;
};
export const searchStorage = (state) => {
	return local(state).searchStorage;
};
export const orderByField = (state) => {
	return local(state).orderByField;
};
export const mode = (state) => {
	return local(state).mode;
};
export const userInfo = (state) => {
	return R.path(['userInfo'], state);
};
export const ratingsList = (state) => {
	return R.path(['ratingsList'], local(state))
}
export const userList = createSelector(
	userRankList,
	workTeamRankList,
	teamAdminRankList,
	storage,
	selectRating,
	skipToSelf,
	searchStorage,
	mode,
	count,
	(userRankList, workTeamRankList, teamAdminRankList, storage, selectRating, skipToSelf, searchStorage, mode, count) => {
		const list = {
			userRankList, workTeamRankList, teamAdminRankList,
		}

		let data = storage[selectRating] || [];
		const tabMode = mode === 'search' ?  'search' : selectRating;
		let showMore = false;

		if(!list[selectRating]){
			return  { data: []};
		}
		if(skipToSelf){
			return list[selectRating] || { data: [] };
		}
		if(mode === 'search'){
			data = searchStorage[selectRating] || [];
		}

		showMore = count[tabMode] > data.length;
		return {
			...list[selectRating],
			data,
			showMore,
		};
	}
);
export const userSelf = createSelector(
	userRankList,
	workTeamRankList,
	teamAdminRankList,
	selectRating,
	skipToSelf,
  (userRankList, workTeamRankList, teamAdminRankList, selectRating, skipToSelf) => {
		if(!skipToSelf){
			return;
		}
		const list = {
			userRankList, workTeamRankList, teamAdminRankList,
		};

    return list[selectRating] || {};
  }
);
