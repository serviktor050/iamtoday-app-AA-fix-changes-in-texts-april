import fetchDucks from "modules/FetchDucks";
import { makeActionCreator, makeAsyncActionCreator } from "../../utils";
import api from "../../utils/api";
import moment from "moment";

export const moduleName = "tutors-list";

const { REQUEST, SUCCESS, ERROR, loading } = fetchDucks(moduleName);

export const GET_TUTORS_LIST = `${moduleName}/GET_TUTORS_LIST`;
export const GET_TUTORS_FILTER = `${moduleName}/GET_TUTORS_FILTER`;

export const getTutorsFilter = (data, onSuccess = x => x) =>
  makeAsyncActionCreator({
    actionName: GET_TUTORS_FILTER,
    apiCall: api.getTutorFilter,
    field: "tutorsFilter",
    moduleName,
    onSuccess,
    data,
  });

export const getTutorsList = (data, onSuccess = x => x) =>
  makeAsyncActionCreator({
    actionName: GET_TUTORS_LIST,
    apiCall: api.getTutorsList,
    field: "tutorsList",
    moduleName,
    onSuccess,
    data,
  });

export const initialState = {};

export const reducer = (state = initialState, action) => {
  if (
    ~action.type.indexOf(REQUEST) ||
    ~action.type.indexOf(SUCCESS) ||
    ~action.type.indexOf(ERROR)
  ) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    };
  }
  switch (action.type) {
    default:
      return state;
  }
};
