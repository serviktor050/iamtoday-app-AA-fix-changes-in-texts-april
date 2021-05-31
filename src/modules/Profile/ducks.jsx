import fetchDucks from "modules/FetchDucks";
import { makeActionCreator, makeAsyncActionCreator } from "../../utils";
import api from "../../utils/api";
import moment from "moment";

export const moduleName = "profile";

const { REQUEST, SUCCESS, ERROR, loading } = fetchDucks(moduleName);

export const GET_USER_DIPLOMS = `${moduleName}/GET_USER_DIPLOMS`;

export const getUserDiploms = (data, onSuccess) => makeAsyncActionCreator({
  apiCall: api.getUserDiploms,
  actionName: GET_USER_DIPLOMS,
  data,
  moduleName,
  field: 'diploms',
  onSuccess
})

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