import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';
import { TYPE_ALL, TYPE_CHILDREN, TYPE_GROUP } from './constants';

export const moduleName = 'calendar';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);


// Actions /////

export const CALENDAR_GET_TASKS = `${moduleName}/CALENDAR_GET_TASKS`;
export const CALENDAR_CREATE_TASK = `${moduleName}/CALENDAR_CREATE_TASK`;
export const CALENDAR_UPDATE_TASK = `${moduleName}/CALENDAR_UPDATE_TASK`;
export const CALENDAR_DELETE_TASK = `${moduleName}/CALENDAR_DELETE_TASK`;
export const SET_CURRENT_PERIOD = `${moduleName}/SET_CURRENT_PERIOD`;
export const GET_USER_SUGGEST = `${moduleName}/GET_USER_SUGGEST`;
export const CALENDAR_GET_TODAY_TASKS = `${moduleName}/CALENDAR_GET_TODAY_TASKS`;
export const SET_RECIPIENTS_TYPE = `${moduleName}/SET_RECIPIENTS_TYPE`;
export const CALENDAR_GET_TASK_BY_ID = `${moduleName}/CALENDAR_GET_TASK_BY_ID`;
export const CLEAR_TASK_DESCRIPTION = `${moduleName}/CLEAR_TASK_DESCRIPTION`;
export const ADD_REF_TO_OUTSIDE_CLICK = `${moduleName}/ADD_REF_TO_OUTSIDE_CLICK`;
export const DELETE_REF_FROM_OUTSIDE_CLICK = `${moduleName}/DELETE_REF_FROM_OUTSIDE_CLICK`;
export const CLEAR_OUTSIDE_CLICK_ARRAY = `${moduleName}/CLEAR_OUTSIDE_CLICK_ARRAY`;
export const ADD_TO_CONTRACTORS_LIST = `${moduleName}/ADD_TO_CONTRACTORS_LIST`;
export const DELETE_FROM_CONTRACTORS_LIST = `${moduleName}/DELETE_FROM_CONTRACTORS_LIST`;
export const CLEAR_CONTRACTORS_LIST = `${moduleName}/CLEAR_CONTRACTORS_LIST`;
export const SET_TOOLTIP_STATUS = `${moduleName}/SET_TOOLTIP_STATUS`;

// Actions Creators ////

export const setCurrentPeriod = makeActionCreator(SET_CURRENT_PERIOD, 'data');
export const setRecipientsType = makeActionCreator(SET_RECIPIENTS_TYPE, 'data');
export const clearTaskDescription = makeActionCreator(CLEAR_TASK_DESCRIPTION, 'data');
export const addRefToOutSideClick = makeActionCreator(ADD_REF_TO_OUTSIDE_CLICK, 'data');
export const deleteRefFromOutsideClick = makeActionCreator(DELETE_REF_FROM_OUTSIDE_CLICK, 'data');
export const clearOutsideClickArray = makeActionCreator(DELETE_REF_FROM_OUTSIDE_CLICK, 'data');
export const addToContractorsList = makeActionCreator(ADD_TO_CONTRACTORS_LIST, 'data');
export const deleteFromContractorsList = makeActionCreator(DELETE_FROM_CONTRACTORS_LIST, 'data');
export const clearContractorsList = makeActionCreator(CLEAR_CONTRACTORS_LIST, 'data');
export const setTooltipStatus = makeActionCreator(SET_TOOLTIP_STATUS, 'data');

export const getUserSuggest = data => makeAsyncActionCreator({
  apiCall: api.getUserSuggestions,
  actionName: GET_USER_SUGGEST,
  moduleName,
  data,
  field: 'suggestedUsers'
})

export const calendarGetTasks = data => makeAsyncActionCreator({
  apiCall: api.calendarGetTasks,
  actionName: CALENDAR_GET_TASKS,
  moduleName,
  data,
  field: 'tasks'
})

export const getTaskDescription = data => makeAsyncActionCreator({
  apiCall: api.calendarGetTaskById,
  actionName: CALENDAR_GET_TASK_BY_ID,
  moduleName,
  data,
  field: 'taskDescription'
})

export const calendarCreateTask = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.calendarCreateTask,
  actionName: CALENDAR_CREATE_TASK,
  moduleName,
  data,
  onSuccess,
  onError
})

export const calendarUpdateTask = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.calendarUpdateTask,
  actionName: CALENDAR_UPDATE_TASK,
  moduleName,
  data,
  onSuccess,
  onError
})

export const calendarDeleteTask = (data, onSuccess, onError) => makeAsyncActionCreator({
  apiCall: api.calendarDeleteTask,
  actionName: CALENDAR_DELETE_TASK,
  moduleName,
  data,
  onSuccess,
  onError
})

export const calendarGetTodayTasks = data => makeAsyncActionCreator({
  apiCall: api.calendarGetTasks,
  actionName: CALENDAR_GET_TODAY_TASKS,
  moduleName,
  data,
  field: 'todayTasks',
})


// Reducer /////
export const initialState = {
  currentPeriod: {
    dateStart: null,
    dateEnd: null
  },
  recipientsType: TYPE_ALL,
  taskDescription: null,
  outsideClickRefs: [],
  contractors: [],
  isTooltipVisible: false,
};
  
export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }
  switch (action.type) {
    case SET_CURRENT_PERIOD:
      return {
        ...state,
        currentPeriod: {
          dateStart: action.data.dateStart,
          dateEnd: action.data.dateEnd
        }
      }
    case SET_RECIPIENTS_TYPE:
      return {
        ...state,
        recipientsType: action.data
      }
    case CLEAR_TASK_DESCRIPTION:
      return {
        ...state,
        taskDescription: null,
      }
    case ADD_REF_TO_OUTSIDE_CLICK:
      return {
        ...state,
        outsideClickRefs: [...state.outsideClickRefs, action.data],
      }
    case DELETE_REF_FROM_OUTSIDE_CLICK:
      return {
        ...state,
        outsideClickRefs: state.outsideClickRefs.filter((ref) => ref !== action.data),
      }
    case CLEAR_OUTSIDE_CLICK_ARRAY:
      return {
        ...state,
        outsideClickRefs: [],
      }
    case ADD_TO_CONTRACTORS_LIST:
      return {
        ...state,
        contractors: [...state.contractors, ...action.data],
      }
    case DELETE_FROM_CONTRACTORS_LIST:
      return {
        ...state,
        contractors: state.contractors.filter((contractor) => contractor !== action.data),
      }
    case CLEAR_CONTRACTORS_LIST:
      return {
        ...state,
        contractors: [],
      }
    case SET_TOOLTIP_STATUS:
      return {
        ...state,
        isTooltipVisible: action.data,
      }
    default:
      return state;
  }
};