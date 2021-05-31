import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';

export const moduleName = 'rating';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const GET_USER_RANK_LIST = `${moduleName}/GET_USER_RANK_LIST`;
export const SET_SKIP = `${moduleName}/SET_SKIP`;
export const SET_RATING = `${moduleName}/SET_RATINGS`;
export const SET_SKIP_TO_SELF = `${moduleName}/SET_SKIP_TO_SELF`;
export const ADD_USER_TO_STORAGE = `${moduleName}/ADD_USER_TO_STORAGE`;
export const SEARCH = `${moduleName}/SEARCH`;
export const RESET_LIST = `${moduleName}/RESET_LIST`;
export const SET_MODE = `${moduleName}/SET_MODE`;
export const SET_UN_MERGE = `${moduleName}/SET_UN_MERGE`;
export const TOGGLE_DIRECTION = `${moduleName}/TOGGLE_DIRECTION`;
export const SET_FIELD = `${moduleName}/SET_FIELD`;
export const SET_COUNT = `${moduleName}/SET_COUNT`;
export const GET_RATINGS_LIST = `${moduleName}/GET_RATINGS_LIST`;

// Action Creators
export const setSkip = makeActionCreator(SET_SKIP, 'data');
export const setRating = makeActionCreator(SET_RATING, 'data');
export const setSkipToSelf = makeActionCreator(SET_SKIP_TO_SELF, 'data');
export const addUserToStorage = makeActionCreator(ADD_USER_TO_STORAGE, 'data', 'rating', 'isSearch', 'unMerge');
export const setSearch = makeActionCreator(SEARCH, 'data');
export const resetList = makeActionCreator(RESET_LIST, 'data');
export const setMode = makeActionCreator(SET_MODE, 'data');
export const setUnMerge = makeActionCreator(SET_UN_MERGE, 'data');
export const toggleDirection = makeActionCreator(TOGGLE_DIRECTION, 'field');
export const setField = makeActionCreator(SET_FIELD, 'data');
export const setCount = makeActionCreator(SET_COUNT, 'data', 'rating', 'isSearch');

const TAKE = 50;

export const getRatingsList = () => makeAsyncActionCreator({
	apiCall: api.getRatingsList,
	actionName: GET_RATINGS_LIST,
	moduleName,
	data: {},
	field: 'ratingsList'
})

export const getUserRankList = ({data, name}) => makeAsyncActionCreator({
  apiCall: api.getUserRankList,
  actionName: GET_USER_RANK_LIST,
  moduleName,
  data,
	dataApi: name,
  field: name,
	onSuccess: async (data, dispatch, getState) => {
		const selectRating = getState()[moduleName].selectRating;
		const rating = getState()[moduleName][selectRating];
		const skip = getState()[moduleName].skip;
		const mode = getState()[moduleName].mode;
		const skipToSelf = getState()[moduleName].skipToSelf;
		const unMerge = getState()[moduleName].unMerge;
		if(skipToSelf){
			return;
		}
		const isSearch = mode === 'search';
		await dispatch(setCount(data.itemsCounter, selectRating, isSearch));
  	await dispatch(addUserToStorage(data.data, selectRating, isSearch, unMerge));

		if (data.data.length) {
  		const oldSkip = skip[selectRating] || 0;
      dispatch(setSkip({skip: oldSkip + TAKE, rating: selectRating}));
		}
  	if(unMerge){
			dispatch(setUnMerge(false));
		}
	},
});

// Reducer
export const initialState = {
  skip: {},
	skipToSelf: false,
	selectRating: 'userRankList',
	storage: {},
	searchStorage: {},
	search: '',
	mode: '',
	unMerge: false,
	orderByField: 'position',
	orderByDirection: {
  	position: '',
		lastName: '',
		workTeamName: '',
		city: '',
		totalUsers: ''
	},
	count: {}
};

export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }

  switch (action.type) {
		case SET_COUNT:
			const field = action.isSearch ?  'search' : action.rating;
			return {
				...state,
				count:{
					...state.count,
					[field]: action.data,
				}
  }
		case SET_SKIP:
      return {
        ...state,
        skip: {
					...state.skip,
					[action.data.rating]: action.data.skip,
				}
      };

		case RESET_LIST:
			const rating = state[action.data.rating];
			if(action.data.searchStorage){
				const rating = state.searchStorage[action.data.rating];
				const searchStorage = state.searchStorage;
				const res = {
					...state,
					searchStorage: {
						...searchStorage,
						[action.data.rating]: []
					}
				};
				return res
			}
			if(action.data.storage) {
				const rating = state.storage[action.data.rating];
				const storage = state.storage;
				const res = {
					...state,
					storage: {
						...storage,
						[action.data.rating]: []
					}
				};
				return res
			}
			return {
				...state,
				[action.data.rating]: {
					...rating,
					data: null
				}
			};
		case SEARCH:
			return {
				...state,
				search: action.data,
			};
		case SET_UN_MERGE:
			return {
				...state,
				unMerge: action.data,
			};
		case SET_MODE:
			return {
				...state,
				mode: action.data,
			};
		case SET_RATING:
			return {
				...state,
				selectRating: action.data,
			};
		case SET_SKIP_TO_SELF:
			return {
				...state,
				skipToSelf: action.data,
			};
		case SET_FIELD:
			return {
				...state,
				orderByField: action.data,
			};
		case 	TOGGLE_DIRECTION:
			let orderByDirection = {};
			Object.keys(state.orderByDirection).forEach((item) => {
        orderByDirection[item] = '';
			});
			const direction= state.orderByDirection[action.field];
			let newDirection = 'desc';
			if(direction === 'desc'){
        newDirection = 'asc';
			}
      if(direction === 'asc'){
        newDirection = '';
      }
      orderByDirection[action.field] = newDirection;
			return {
				...state,
				orderByDirection:orderByDirection,
			};
		case ADD_USER_TO_STORAGE:
			const storage = action.isSearch ? state.searchStorage : state.storage;
			const old = storage[action.rating] || [];
			let list = old.concat(action.data);
			if(action.isSearch){
				if(action.unMerge){
					list = action.data
				}
				return {
					...state,
					searchStorage: {
						...storage,
						[action.rating]: list,
					}
				};
			}
			return {
				...state,
				storage: {
					...storage,
					[action.rating]: list,
				}
			};
    default:
      return state;
  }
};
