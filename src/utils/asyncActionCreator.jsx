import * as R from 'ramda';
import fetchDucks from 'modules/FetchDucks';
import cookie from "react-cookie";

const SUCCESS = 1;

export const makeAsyncActionCreator = ({
  apiCall,
  field,
  data = {},
  dataApi = null,
  moduleName,
  actionName,
  mapData,
  errorHandler,
  onSuccess = () => {},
  onError = null,
  temporaryFlag = false,
}) => {
  const shouldFetch = (state, field) => {
    const localState = state[moduleName];
    return R.path([ field, 'isFetching'], localState);
  };
  const {
    request,
    success,
    error,
  } = fetchDucks(moduleName);

  return async (dispatch, getState) => {
    if (shouldFetch(getState(), field)) {
      return;
    }
    dispatch(request(actionName, field));
      const authToken = cookie.load('token');
      const payload = temporaryFlag ? data : {
        data,
        authToken
      };

    try {
      const res = await apiCall(payload, dataApi);
      if (res.data.errorCode !== SUCCESS) {
        dispatch(error(actionName, 'Ошибка на сервере', field));
        if(onError){
          onError(res.data, dispatch, getState);
        }
      } else {
        let data = res.data.data;
        if (mapData) {
          data = mapData(data, getState);
        }
        const itemsCounter = res.data.itemsCounter;
        dispatch(success(actionName, data, field, itemsCounter));
        if (onSuccess) {
          onSuccess(res.data, dispatch, getState);
        }
      }
    } catch (err) {
      const errorText = err;
      if (errorHandler) {
        errorHandler(err);
      }
      console.error(err);
      dispatch(error(actionName, errorText, field));
    }

  }
};

export default makeAsyncActionCreator;
