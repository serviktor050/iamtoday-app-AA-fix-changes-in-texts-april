import { createSelector } from 'reselect';
import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const cart = (state) => {
    return R.path(['cart'], local(state));
};
export const userPoints = (state) => {
  return  R.path(['userPoints'], local(state));
};
export const costList = (state) => {
  return R.path(['costList'], local(state));
};
export const userInfo = (state) => {
  return R.path(['userInfo'], state);
};
export const lang = (state) => state.lang;
