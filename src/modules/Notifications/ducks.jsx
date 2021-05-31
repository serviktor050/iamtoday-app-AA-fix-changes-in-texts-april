import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';

export const moduleName = 'notifications';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const GET_NOTIFICATIONS_LIST = `${moduleName}/GET_NOTIFICATIONS_LIST`;
export const TOGGLE_CARD = `${moduleName}/TOGGLE_CARD`;
export const SET_UN_READ_MESSAGE = `${moduleName}/SET_UN_READ_MESSAGE`;
export const GET_TODAY_TASKS = `${moduleName}/GET_TODAY_TASKS`;

// Action Creators
export const toggleCard = makeActionCreator(TOGGLE_CARD, 'data');
export const setUnReadMessage = makeActionCreator(SET_UN_READ_MESSAGE, 'data');

export const getNotificationsList = () => makeAsyncActionCreator({
  apiCall: api.getNotificationsList,
  actionName: GET_NOTIFICATIONS_LIST,
  moduleName,
  field: 'notifications',
	onSuccess: async (data, dispatch, getState) => {
    const unReadMessage = data.data.filter((item) => !item.isRead).length;
    await dispatch(setUnReadMessage(unReadMessage))
	}
});

export const calendarGetTodayTasks = data => makeAsyncActionCreator({
  apiCall: api.calendarGetTasks,
  actionName: GET_TODAY_TASKS,
  moduleName,
  data,
  field: 'todayTasks',
})

// Reducer
export const initialState = {
 isOpen: false,
  unReadMessage: 0
};

export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }

  switch (action.type) {
		case SET_UN_READ_MESSAGE:
			return {
				...state,
				unReadMessage: action.data ? action.data : 0,
			};

    case TOGGLE_CARD:
			return {
				...state,
				isOpen: action.data,
			};
    default:
      return state;
  }
};
