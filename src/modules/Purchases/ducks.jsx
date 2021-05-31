import { makeActionCreator, makeAsyncActionCreator } from 'utils';
import fetchDucks from 'modules/FetchDucks';
import api from 'utils/api';

export const moduleName = 'purchases';

const {
  REQUEST,
  SUCCESS,
  ERROR,
  loading,
} = fetchDucks(moduleName);

export const GET_PURCHASES_LIST = `${moduleName}/GET_PURCHASES_LIST`;

// Action Creators

export const getPurchasesList = () => makeAsyncActionCreator({
  apiCall: api.getPurchasesList,
  actionName: GET_PURCHASES_LIST,
  moduleName,
  data: {},
  field: 'purchasesList',
  // onSuccess: async (data, dispatch, getState) => {
  //   console.log(data)
  //   console.log(window.location)
  //   debugger
  //   window.location.href = data.data.confirmationUrl;
  // }
});

// Reducer
export const initialState = {
};

export const reducer = (state = initialState, action) => {
  if (~action.type.indexOf(REQUEST) || ~action.type.indexOf(SUCCESS) || ~action.type.indexOf(ERROR)) {
    return {
      ...state,
      [action.field]: loading(state[action.field], action),
    }
  }

  switch (action.type) {
    default:
      return state;
  }
};
