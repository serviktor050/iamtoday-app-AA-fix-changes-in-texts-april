import * as R from "ramda";
import { moduleName } from "../Admin";

const local = (state) => state[moduleName];

export const userInfo = (state) => {
  return R.path(["userInfo"], state);
};

export const selectSalesSummary = (state) => {
  return R.path(["sales", "salesSummary"], state);
};

export const selectSalesHistory = (state) => {
  return R.path(["sales", "salesHistory"], state);
};

export const selectSalesHistoryFilter = (state) => {
  return R.path(["sales", "salesHistoryFilter"], state);
};

export const selectSalesStructure = (state) => {
  return R.path(["sales", "salesStructure"], state);
};

export const selectSalesStructureFilter = (state) => {
  return R.path(["sales", "salesStructureFilter"], state);
};

export const selectSalesRegistration = (state) => {
  return {};
};

export const selectAllRequests = (state) => {
  return R.path(["sales", "tutorRequests"], state);
};

export const selectAllAcceptedRequests = state => R.path(['sales', 'tutorRequestsAccepted'], state)

export const selectDeclinedRequestsState = (state) => {
  return R.path(["sales", "declinedRequestsState"], state);
};

export const selectTutorsList = (state) => {
  return R.path(["sales", "tutorsList"], state);
};

export const selectCurrentTutor = (state) => {
  return R.path(["sales", "currentTutor"], state);
};

export const selectCurrentRequest = (state) => {
  return R.path(['sales', 'declinedRequestsState', 'currentRequest'], state);
}

export const selectCurrentUser = (state) => {
  return R.path(['sales', 'currentStudent'], state)
}

export const selectQuestons = state => R.path(['sales', 'questions'], state)
export const selectProfiles = (state) => R.path(['profiles'], local(state));
export const selectFilteredProfiles = (state) => R.path(['filteredProfiles'], local(state));