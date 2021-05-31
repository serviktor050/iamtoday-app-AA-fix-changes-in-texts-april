import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const userInfo = (state) => {
    return R.path(['userInfo'], state);
};

export const selectTutorsList = (state) => {
    return R.path([moduleName, "tutorsList"], state);
  };

export const selectTutorsFilterData = R.path([moduleName, "tutorsFilter", "data"]);
