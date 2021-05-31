import * as R from 'ramda';
import { moduleName } from "../Mlm";

const local = (state) => state[moduleName];

export const userInfo = (state) => {
    return R.path(['userInfo'], state);
};

export const selectMlmSummary = (state) => {
    return R.path(['mlm', 'mlmSummary'], state);
};

export const selectMlmHistory = (state) => {
    return R.path(['mlm', 'mlmHistory'], state);
};

export const selectMlmHistoryFilter = (state) => {
    return R.path(['mlm', 'mlmHistoryFilter'], state);
};

export const selectMlmStructure = (state) => {
    return R.path(['mlm', 'mlmStructure'], state);
};

export const selectMlmStructureFilter = (state) => {
    return R.path(['mlm', 'mlmStructureFilter'], state);
};

export const selectMlmStatistic = (state) => {
    return R.path(['mlm', 'mlmStatistic'], state);
};

export const selectMlmMentorshipRequests = state => R.path(['mlm', 'mentorshipRequests'], state);

export const selectMlmMineOrdersHistory = state => R.path(['mlm', 'mlmMineOrdersHistory'], state);
export const selectCurrentTutor = (state) => {
    return R.path(['mlm', 'currentTutor'], state);
}

export const selectRejectedRequests = (state) => {
    return R.path(['mlm', 'outcommingRequests'], state)
}

export const selectNewMlmMentorshipRequests = state => R.path(['mlm', 'newMentorshipRequests'], state);

export const selectMlmRegistration = (state) => {
    return {};
};

export const selectWithdrawal = (state) => {
    return R.path(['mlm', 'withdrawal'], state)
}

