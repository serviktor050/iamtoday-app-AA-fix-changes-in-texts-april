import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const userInfo = (state) => {
    return R.path(['userInfo'], state);
};

export const selectUserDiploms = state => R.path(['profile', 'diploms'], state)
