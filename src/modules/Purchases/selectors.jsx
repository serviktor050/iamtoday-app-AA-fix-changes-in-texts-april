import { createSelector } from 'reselect';
import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const purchasesList = (state) => {
  return R.path(['purchasesList'], local(state));
};
export const lang = (state) => state.lang;

